import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { detectLanguage, detectIntent, generateChatResponse } from '@/lib/ai/gemini';
import { getChatbotContext } from '@/lib/ai/rag';
import type { Database } from '@/lib/supabase/database.types';

export async function POST(request: NextRequest) {
  try {
    const { message, conversationId } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Initialize Supabase client
    const supabase = createRouteHandlerClient<Database>({ cookies });

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Detect language
    const language = await detectLanguage(message);

    // Detect intent and extract entities
    const { intent, entities } = await detectIntent(message);

    let conversation;

    // Get or create conversation
    if (conversationId) {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('id', conversationId)
        .eq('user_id', user.id)
        .single();

      if (error || !data) {
        return NextResponse.json(
          { error: 'Conversation not found' },
          { status: 404 }
        );
      }

      conversation = data;

      // Update conversation language if changed
      if (conversation.language !== language) {
        await supabase
          .from('ai_conversations')
          .update({ language })
          .eq('id', conversationId);
      }
    } else {
      // Create new conversation
      const { data, error } = await supabase
        .from('ai_conversations')
        .insert({
          user_id: user.id,
          language,
        })
        .select()
        .single();

      if (error || !data) {
        return NextResponse.json(
          { error: 'Failed to create conversation' },
          { status: 500 }
        );
      }

      conversation = data;
    }

    // Get conversation history
    const { data: historyData } = await supabase
      .from('ai_messages')
      .select('role, content')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true })
      .limit(10);

    const conversationHistory = historyData || [];

    // Get context from RAG
    const context = await getChatbotContext(message);

    // Generate response
    const responseText = await generateChatResponse({
      userMessage: message,
      conversationHistory: conversationHistory.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      context,
      language,
    });

    // Store user message
    await supabase.from('ai_messages').insert({
      conversation_id: conversation.id,
      role: 'user',
      content: message,
      language,
      intent,
      metadata: { entities },
    });

    // Store assistant response
    await supabase.from('ai_messages').insert({
      conversation_id: conversation.id,
      role: 'assistant',
      content: responseText,
      language,
      metadata: {},
    });

    // Log user activity for search intents
    if (intent === 'search' && entities) {
      await supabase.from('user_activity').insert({
        user_id: user.id,
        activity_type: 'search',
        metadata: {
          query: message,
          entities,
          language,
        },
      });
    }

    return NextResponse.json({
      response: responseText,
      conversationId: conversation.id,
      language,
      intent,
      entities,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
