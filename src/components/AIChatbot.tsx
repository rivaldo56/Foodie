'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/context/auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIChatbot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'sw'>('en');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || !user) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setConversationId(data.conversationId);
      setLanguage(data.language);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setConversationId(null);
  };

  const getWelcomeMessage = () => {
    if (language === 'sw') {
      return {
        greeting: 'Habari! 👋',
        message: 'Je, unaweza kukusaidia kupata mpishi au chakula leo?',
        examples: [
          'Nataka mpishi wa chakula ya kienyeji',
          'Napenda chakula cha Italia',
          'Nionyeshe wapishi bora',
        ],
      };
    }

    return {
      greeting: 'Hello! 👋',
      message: 'How can I help you find a chef or dish today?',
      examples: [
        'Find me a chef for Italian cuisine',
        'Show me vegetarian dishes',
        'I need a chef for tomorrow evening',
      ],
    };
  };

  if (!user) {
    return null; // Don't show chatbot if not logged in
  }

  const welcome = getWelcomeMessage();

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2"
        aria-label="Open AI Assistant"
      >
        {isOpen ? (
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)]">
          <Card className="flex h-[600px] max-h-[80vh] flex-col overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b bg-gradient-to-r from-rose-500 to-pink-500 p-4 text-white">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                  🤖
                </div>
                <div>
                  <h3 className="font-semibold">Foodie AI</h3>
                  <p className="text-xs text-white/80">
                    {language === 'sw' ? 'Msaidizi Wako wa Chakula' : 'Your Food Assistant'}
                  </p>
                </div>
              </div>
              <button
                onClick={clearChat}
                className="rounded p-1 hover:bg-white/20 transition"
                title={language === 'sw' ? 'Futa mazungumzo' : 'Clear chat'}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.length === 0 && (
                <div className="text-center space-y-4 py-8">
                  <div className="text-4xl">👨‍🍳</div>
                  <div>
                    <h4 className="font-semibold text-lg">{welcome.greeting}</h4>
                    <p className="text-sm text-gray-600 mt-1">{welcome.message}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 font-medium">
                      {language === 'sw' ? 'Jaribu:' : 'Try asking:'}
                    </p>
                    {welcome.examples.map((example, i) => (
                      <button
                        key={i}
                        onClick={() => setInput(example)}
                        className="block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-sm hover:border-rose-300 hover:bg-rose-50 transition"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white'
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                    <p
                      className={`mt-1 text-xs ${
                        message.role === 'user'
                          ? 'text-white/70'
                          : 'text-gray-400'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg border border-gray-200 bg-white px-4 py-3">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]"></div>
                      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]"></div>
                      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="border-t bg-white p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    language === 'sw'
                      ? 'Andika ujumbe...'
                      : 'Type a message...'
                  }
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  disabled={loading}
                />
                <Button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-2 text-white hover:from-rose-600 hover:to-pink-600 disabled:opacity-50"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </>
  );
}
