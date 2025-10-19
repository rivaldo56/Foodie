import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/context/auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Message } from '@/types/chat';
import { supabase } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

interface Props {
  bookingId: string;
  recipientId: string;
  recipientName: string;
}

export default function ChatWindow({ bookingId, recipientId, recipientName }: Props) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
    subscribeToMessages();
    markMessagesAsRead();
  }, [bookingId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:user_profiles(name, avatar_url)
        `)
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const subscribeToMessages = () => {
    const subscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `booking_id=eq.${bookingId}`,
        },
        (payload) => {
          setMessages((current) => [...current, payload.new as Message]);
          if (payload.new.sender_id !== user?.id) {
            markMessageAsRead(payload.new.id);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const markMessagesAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('booking_id', bookingId)
        .eq('sender_id', recipientId)
        .eq('read', false);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    try {
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('messages').insert({
        booking_id: bookingId,
        sender_id: user.id,
        recipient_id: recipientId,
        content: newMessage,
      });

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="flex h-[600px] flex-col">
      <div className="border-b p-4">
        <h3 className="font-medium">{recipientName}</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender_id === user?.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  message.sender_id === user?.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100'
                }`}
              >
                <div className="break-words">{message.content}</div>
                <div
                  className={`mt-1 text-xs ${
                    message.sender_id === user?.id
                      ? 'text-blue-100'
                      : 'text-gray-500'
                  }`}
                >
                  {formatTime(message.created_at)}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={sendMessage} className="border-t p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-md border border-gray-300 px-3 py-2"
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !newMessage.trim()}>
            Send
          </Button>
        </div>
      </form>
    </Card>
  );
}