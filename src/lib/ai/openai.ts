import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Language detection using GPT-4o
export async function detectLanguage(text: string): Promise<'en' | 'sw'> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a language detector. Respond with only "en" for English or "sw" for Swahili.',
        },
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: 0,
      max_tokens: 10,
    });

    const language = response.choices[0]?.message?.content?.trim().toLowerCase();
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

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate the following text to ${languageNames[targetLanguage]}. Preserve the original meaning and tone. Only respond with the translation, nothing else.`,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: 0.3,
    });

    return response.choices[0]?.message?.content || text;
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
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an intent classifier for a chef booking platform. Analyze the user's message and classify it into one of these intents:
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
- guest_count: number of people`,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      temperature: 0,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0]?.message?.content || '{}');
    return {
      intent: result.intent || 'general',
      confidence: result.confidence || 0.5,
      entities: result.entities || {},
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
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });

    return response.data[0].embedding;
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
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user', content: userMessage },
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('Chat response generation error:', error);
    return language === 'sw' 
      ? 'Samahani, nimekutana na tatizo. Tafadhali jaribu tena.'
      : 'Sorry, I encountered an error. Please try again.';
  }
}
