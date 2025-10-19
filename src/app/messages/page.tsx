"use client";

import { useAuth } from "@/lib/context/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Search } from "lucide-react";

export default function MessagesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedChat, setSelectedChat] = useState<number | null>(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  const conversations = [
    { id: 1, name: "Chef Maria Rodriguez", lastMessage: "Looking forward to cooking for you!", time: "2m ago", unread: 2, avatar: "MR" },
    { id: 2, name: "Chef James Ochieng", lastMessage: "What time works best for you?", time: "1h ago", unread: 0, avatar: "JO" },
    { id: 3, name: "Chef Sarah Kim", lastMessage: "I can accommodate your dietary restrictions", time: "3h ago", unread: 1, avatar: "SK" },
  ];

  const messages = [
    { id: 1, text: "Hi! I'd love to book you for a dinner party", sender: "me", time: "10:00 AM" },
    { id: 2, text: "Hello! I'd be delighted to help. How many guests?", sender: "chef", time: "10:05 AM" },
    { id: 3, text: "We're expecting 8 people", sender: "me", time: "10:06 AM" },
    { id: 4, text: "Perfect! I can create a custom Italian menu for you", sender: "chef", time: "10:08 AM" },
    { id: 5, text: "Looking forward to cooking for you!", sender: "chef", time: "10:10 AM" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl mb-6">Messages</h1>
      
      <div className="grid md:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <div className="md:col-span-1 border rounded-lg overflow-hidden flex flex-col bg-card">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search messages..." className="pl-10" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedChat(conv.id)}
                className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                  selectedChat === conv.id ? 'bg-muted' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {conv.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-medium truncate">{conv.name}</p>
                      <span className="text-xs text-muted-foreground">{conv.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {conv.unread}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="md:col-span-2 border rounded-lg flex flex-col bg-card">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  MR
                </div>
                <div>
                  <p className="font-medium">Chef Maria Rodriguez</p>
                  <p className="text-xs text-muted-foreground">Active now</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        msg.sender === 'me'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && message.trim()) {
                        // Send message logic here
                        setMessage("");
                      }
                    }}
                  />
                  <Button size="icon">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
