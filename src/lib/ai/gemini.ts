import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY environment variable');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use Gemini 2.0 Flash model
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

// Language detection using Gemini
export async function detectLanguage(text: string): Promise<'en' | 'sw'> {
  try {
    const prompt = `You are a language detector. Respond with only "en" for English or "sw" for Swahili. Text: "${text}"`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const language = response.text().trim().toLowerCase();
    
    return language === 'sw' ? 'sw' : 'en';
  } catch (error) {
    console.error('Language detection error:', error);
    return 'en'; // Default to English
  }
}

// Translate text between English and Swahili
export async function translateText(
  text: string,
  targetLanguage: 'en' | 'sw'
): Promise<string> {
  try {
    const languageNames = {
      en: 'English',
      sw: 'Swahili',
    };

    const prompt = `You are a professional translator. Translate the following text to ${languageNames[targetLanguage]}. Preserve the original meaning and tone. Only respond with the translation, nothing else.\n\nText: "${text}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text() || text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}

// Detect intent of user message
export async function detectIntent(message: string): Promise<{
  intent: 'search' | 'booking' | 'help' | 'general';
  confidence: number;
  entities?: Record<string, any>;
}> {
  try {
    const prompt = `You are an intent classifier for a chef booking platform. Analyze the user's message and classify it into one of these intents:
- "search": User is looking for chefs, dishes, or cuisines
- "booking": User wants to book a chef or manage bookings
- "help": User needs assistance or has questions
- "general": General conversation

Respond in JSON format: {"intent": "...", "confidence": 0.0-1.0, "entities": {...}}

Extract these entities if present:
- cuisine_type: type of food (e.g., Italian, Swahili, Japanese)
- dish_name: specific dish mentioned
- date: mentioned date/time
- budget: price range mentioned
- dietary_restrictions: dietary needs (vegan, gluten-free, etc.)
- guest_count: number of people

User message: "${message}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[^}]+\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        intent: parsed.intent || 'general',
        confidence: parsed.confidence || 0.5,
        entities: parsed.entities || {},
      };
    }
    
    return {
      intent: 'general',
      confidence: 0.5,
    };
  } catch (error) {
    console.error('Intent detection error:', error);
    return {
      intent: 'general',
      confidence: 0.5,
    };
  }
}

// Generate embeddings for vector search
// Note: Gemini uses a different embedding model
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    const result = await embeddingModel.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error('Embedding generation error:', error);
    throw error;
  }
}

// Generate chat response with context
export async function generateChatResponse(params: {
  userMessage: string;
  conversationHistory: { role: 'user' | 'assistant'; content: string }[];
  context: string;
  language: 'en' | 'sw';
}): Promise<string> {
  const { userMessage, conversationHistory, context, language } = params;

  const languageInstructions = {
    en: 'Respond in English.',
    sw: 'Respond in Swahili (Kiswahili).',
  };

  const systemPrompt = `You are a helpful AI assistant for ChefConnect, a platform connecting people with freelance chefs in Kenya.

${languageInstructions[language]}

Your role:
- Help users discover chefs and dishes based on their preferences
- Assist with booking chefs for home meals and events
- Provide information about chefs, cuisines, and pricing
- Be friendly, culturally aware, and helpful
- Use local context and understand East African food culture
- Keep responses concise and actionable

Context from knowledge base:
${context}

Guidelines:
- If asked about a chef, provide their name, specialties, rating, and price range
- For bookings, guide users through the 3-tap process
- For cuisine recommendations, consider their preferences and budget
- Always be respectful of dietary restrictions
- Use appropriate local references and cultural sensitivity`;

  try {
    // Build conversation history
    const conversationText = conversationHistory
      .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    const fullPrompt = `${systemPrompt}

Conversation History:
${conversationText}

User: ${userMessage}

Assistant:`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text() || (language === 'sw' 
      ? 'Samahani, sikuweza kutoa jibu.'
      : 'Sorry, I could not generate a response.');
  } catch (error) {
    console.error('Chat response generation error:', error);
    return language === 'sw' 
      ? 'Samahani, nimekutana na tatizo. Tafadhali jaribu tena.'
      : 'Sorry, I encountered an error. Please try again.';
  }
}
