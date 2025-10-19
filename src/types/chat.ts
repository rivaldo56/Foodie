export interface Message {
  id: string;
  booking_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read: boolean;
  sender?: {
    name: string;
    avatar_url: string | null;
  };
}

export interface ChatRoom {
  id: string;
  booking_id: string;
  chef_id: string;
  user_id: string;
  last_message?: Message;
  unread_count: number;
  created_at: string;
  updated_at: string;
  participant?: {
    name: string;
    avatar_url: string | null;
  };
}