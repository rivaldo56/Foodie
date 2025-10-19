import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { MessageSquare, Send, Search } from "lucide-react";
import { AIChatbot } from "../AIChatbot";

interface MessagesPageProps {
  user: any;
}

// Mock conversations
const mockConversations = [
  {
    id: "1",
    name: "Chef Maria Rodriguez",
    role: "chef",
    lastMessage: "I'd be happy to prepare that for your event!",
    time: "2m ago",
    unread: 2,
    avatar: "M"
  },
  {
    id: "2",
    name: "Chef Sofia Rossi",
    role: "chef",
    lastMessage: "What time works best for you?",
    time: "1h ago",
    unread: 0,
    avatar: "S"
  },
  {
    id: "3",
    name: "Sarah Johnson",
    role: "client",
    lastMessage: "Thank you for the amazing dinner!",
    time: "3h ago",
    unread: 0,
    avatar: "S"
  }
];

const mockMessages = [
  {
    id: "1",
    sender: "them",
    text: "Hi! I saw your booking request for Saturday.",
    time: "10:30 AM"
  },
  {
    id: "2",
    sender: "me",
    text: "Yes! I'm looking forward to it. Can we discuss the menu?",
    time: "10:32 AM"
  },
  {
    id: "3",
    sender: "them",
    text: "Of course! I was thinking of starting with a fresh burrata appetizer, then moving to handmade pasta for the main course.",
    time: "10:35 AM"
  },
  {
    id: "4",
    sender: "me",
    text: "That sounds perfect! Do you have any vegetarian options?",
    time: "10:37 AM"
  },
  {
    id: "5",
    sender: "them",
    text: "Absolutely! I can prepare a mushroom risotto as an alternative. It's one of my specialties.",
    time: "10:40 AM"
  },
  {
    id: "6",
    sender: "me",
    text: "Perfect! Two guests are vegetarian. Can you accommodate that?",
    time: "10:42 AM"
  },
  {
    id: "7",
    sender: "them",
    text: "I'd be happy to prepare that for your event!",
    time: "10:45 AM"
  }
];

export function MessagesPage({ user }: MessagesPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [newMessage, setNewMessage] = useState("");

  const isChef = user.role === 'chef';

  const filteredConversations = mockConversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Handle send message
      setNewMessage("");
    }
  };

  return (
    <div className="h-[calc(100vh-5rem)] bg-background pb-20">
      <AIChatbot />
      <div className="container mx-auto px-4 py-8 h-full">
        <div className="grid lg:grid-cols-3 gap-6 h-full">
          {/* Conversations List */}
          <Card className="lg:col-span-1 h-full flex flex-col">
            <CardContent className="p-4 flex-1 flex flex-col">
              <div className="mb-4">
                <h2 className="text-2xl mb-4">Messages</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <ScrollArea className="flex-1 -mx-4 px-4">
                <div className="space-y-2">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`p-4 rounded-lg cursor-pointer transition-colors ${
                        selectedConversation.id === conversation.id
                          ? 'bg-primary/10 border border-primary/20'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {conversation.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-sm truncate">
                              {conversation.name}
                            </h3>
                            <span className="text-xs text-muted-foreground">
                              {conversation.time}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground truncate">
                              {conversation.lastMessage}
                            </p>
                            {conversation.unread > 0 && (
                              <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                                {conversation.unread}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2 h-full flex flex-col">
            <CardContent className="p-0 flex-1 flex flex-col h-full">
              {/* Chat Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {selectedConversation.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{selectedConversation.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedConversation.role === 'chef' ? 'Professional Chef' : 'Client'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {mockMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.sender === 'me'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender === 'me'
                              ? 'text-primary-foreground/70'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
