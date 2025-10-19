import { supabase } from '@/lib/supabase/client';
import { generateEmbedding } from './openai';
import type { Database } from '@/lib/supabase/database.types';

type VectorRow = Database['public']['Tables']['vectors']['Row'];

// Store a document in the vector database
export async function storeVector(params: {
  sourceType: 'chef' | 'dish' | 'faq' | 'recipe';
  sourceId: string;
  content: string;
  metadata?: Record<string, any>;
}): Promise<void> {
  const { sourceType, sourceId, content, metadata = {} } = params;

  try {
    // Generate embedding
    const embedding = await generateEmbedding(content);

    // Store in database
    const { error } = await supabase.from('vectors').insert({
      source_type: sourceType,
      source_id: sourceId,
      content,
      embedding,
      metadata,
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error storing vector:', error);
    throw error;
  }
}

// Search vectors by similarity
export async function searchVectors(params: {
  query: string;
  matchThreshold?: number;
  matchCount?: number;
  sourceType?: string;
}): Promise<Array<{
  id: string;
  sourceType: string;
  sourceId: string;
  content: string;
  similarity: number;
  metadata: any;
}>> {
  const {
    query,
    matchThreshold = 0.7,
    matchCount = 10,
    sourceType,
  } = params;

  try {
    // Generate embedding for query
    const queryEmbedding = await generateEmbedding(query);

    // Call Supabase function for vector search
    const { data, error } = await supabase.rpc('match_vectors', {
      query_embedding: queryEmbedding,
      match_threshold: matchThreshold,
      match_count: matchCount,
    });

    if (error) throw error;

    // Filter by source type if specified
    let results = data || [];
    if (sourceType) {
      results = results.filter((r: any) => r.source_type === sourceType);
    }

    return results.map((r: any) => ({
      id: r.id,
      sourceType: r.source_type,
      sourceId: r.source_id,
      content: r.content,
      similarity: r.similarity,
      metadata: r.metadata,
    }));
  } catch (error) {
    console.error('Error searching vectors:', error);
    return [];
  }
}

// Index all chefs for RAG
export async function indexChefs(): Promise<number> {
  try {
    const { data: chefs, error } = await supabase
      .from('chef_profiles')
      .select('*');

    if (error) throw error;

    let indexed = 0;
    for (const chef of chefs || []) {
      const content = `Chef: ${chef.name}. ${chef.bio} Specialties: ${chef.specialties.join(', ')}. Price range: $${chef.price_range.min}-$${chef.price_range.max}. Rating: ${chef.rating}/5.`;

      await storeVector({
        sourceType: 'chef',
        sourceId: chef.id,
        content,
        metadata: {
          name: chef.name,
          specialties: chef.specialties,
          rating: chef.rating,
          price_range: chef.price_range,
        },
      });

      indexed++;
    }

    return indexed;
  } catch (error) {
    console.error('Error indexing chefs:', error);
    throw error;
  }
}

// Index all dishes for RAG
export async function indexDishes(): Promise<number> {
  try {
    const { data: dishes, error } = await supabase
      .from('dishes')
      .select(`
        *,
        chef:chef_profiles(name)
      `);

    if (error) throw error;

    let indexed = 0;
    for (const dish of dishes || []) {
      const content = `Dish: ${dish.name}. ${dish.description} Cuisine: ${dish.cuisine_type.join(', ')}. Price: $${dish.price}. Serves: ${dish.serves}. Prep time: ${dish.prep_time} minutes. Chef: ${dish.chef?.name || 'Unknown'}.`;

      await storeVector({
        sourceType: 'dish',
        sourceId: dish.id,
        content,
        metadata: {
          name: dish.name,
          chef_id: dish.chef_id,
          cuisine_type: dish.cuisine_type,
          price: dish.price,
          dietary_info: dish.dietary_info,
        },
      });

      indexed++;
    }

    return indexed;
  } catch (error) {
    console.error('Error indexing dishes:', error);
    throw error;
  }
}

// Get context for chatbot from vector search
export async function getChatbotContext(query: string): Promise<string> {
  const results = await searchVectors({
    query,
    matchThreshold: 0.75,
    matchCount: 5,
  });

  if (results.length === 0) {
    return 'No specific information found in knowledge base.';
  }

  return results
    .map((r, i) => `[${i + 1}] ${r.content} (Relevance: ${Math.round(r.similarity * 100)}%)`)
    .join('\n\n');
}

// Update vector when source content changes
export async function updateVector(params: {
  sourceType: 'chef' | 'dish' | 'faq' | 'recipe';
  sourceId: string;
  content: string;
  metadata?: Record<string, any>;
}): Promise<void> {
  const { sourceType, sourceId } = params;

  try {
    // Delete existing vectors for this source
    await supabase
      .from('vectors')
      .delete()
      .eq('source_type', sourceType)
      .eq('source_id', sourceId);

    // Store new vector
    await storeVector(params);
  } catch (error) {
    console.error('Error updating vector:', error);
    throw error;
  }
}

// Delete vectors for a source
export async function deleteVector(params: {
  sourceType: string;
  sourceId: string;
}): Promise<void> {
  const { sourceType, sourceId } = params;

  try {
    const { error } = await supabase
      .from('vectors')
      .delete()
      .eq('source_type', sourceType)
      .eq('source_id', sourceId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting vector:', error);
    throw error;
  }
}

// Get recommendations based on user preferences
export async function getPersonalizedRecommendations(params: {
  userId: string;
  limit?: number;
}): Promise<Array<{ type: 'chef' | 'dish'; id: string; score: number }>> {
  const { userId, limit = 10 } = params;

  try {
    // Get user preferences
    const { data: prefs } = await supabase
      .from('user_recommendation_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!prefs) {
      return [];
    }

    // Build query from preferences
    const queryParts = [];
    if (prefs.cuisine_preferences.length > 0) {
      queryParts.push(`Cuisines: ${prefs.cuisine_preferences.join(', ')}`);
    }
    if (prefs.dietary_restrictions.length > 0) {
      queryParts.push(`Dietary: ${prefs.dietary_restrictions.join(', ')}`);
    }

    const query = queryParts.join('. ') || 'Popular chefs and dishes';

    // Search vectors
    const results = await searchVectors({
      query,
      matchThreshold: 0.6,
      matchCount: limit,
    });

    return results.map(r => ({
      type: r.sourceType as 'chef' | 'dish',
      id: r.sourceId,
      score: r.similarity,
    }));
  } catch (error) {
    console.error('Error getting personalized recommendations:', error);
    return [];
  }
}
