-- Enable pgvector extension for vector embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Messages table for in-app chat
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_booking ON messages(booking_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);

-- AI Chatbot conversations table
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  language VARCHAR(10) DEFAULT 'en', -- 'en' or 'sw' for Swahili
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_conversations_user ON ai_conversations(user_id);

-- AI Chatbot messages table
CREATE TABLE IF NOT EXISTS ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL, -- 'user' or 'assistant'
  content TEXT NOT NULL,
  language VARCHAR(10) DEFAULT 'en',
  intent VARCHAR(50), -- 'search', 'booking', 'help', 'general'
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_messages_conversation ON ai_messages(conversation_id);
CREATE INDEX idx_ai_messages_created ON ai_messages(created_at);

-- Vectors table for RAG knowledge base
CREATE TABLE IF NOT EXISTS vectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type VARCHAR(50) NOT NULL, -- 'chef', 'dish', 'faq', 'recipe'
  source_id UUID NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536), -- OpenAI text-embedding-3-small dimension
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_vectors_source ON vectors(source_type, source_id);
-- Create index for vector similarity search
CREATE INDEX idx_vectors_embedding ON vectors USING ivfflat (embedding vector_cosine_ops);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'booking', 'message', 'review', 'payment', 'system'
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  action_url TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read);
CREATE INDEX idx_notifications_created ON notifications(created_at);

-- Update user_profiles to include language preference
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS language_preference VARCHAR(10) DEFAULT 'en',
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'client'; -- 'client' or 'chef'

-- Chef badges table
CREATE TABLE IF NOT EXISTS chef_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chef_id UUID REFERENCES chef_profiles(id) ON DELETE CASCADE,
  badge_type VARCHAR(50) NOT NULL, -- 'top_chef', '5_star', 'fast_responder', 'verified'
  earned_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chef_badges_chef ON chef_badges(chef_id);

-- Add calendar integration fields to chef_profiles
ALTER TABLE chef_profiles
ADD COLUMN IF NOT EXISTS google_calendar_id TEXT,
ADD COLUMN IF NOT EXISTS calendar_sync_enabled BOOLEAN DEFAULT false;

-- Add AI enhancement flag to dishes
ALTER TABLE dishes
ADD COLUMN IF NOT EXISTS ai_enhanced BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS enhancement_metadata JSONB;

-- User preferences for AI recommendations
CREATE TABLE IF NOT EXISTS user_recommendation_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE UNIQUE,
  cuisine_preferences TEXT[] DEFAULT '{}',
  dietary_restrictions TEXT[] DEFAULT '{}',
  budget_range JSONB DEFAULT '{"min": 0, "max": 1000}',
  preferred_meal_times TEXT[] DEFAULT '{}',
  favorite_chefs UUID[] DEFAULT '{}',
  disliked_ingredients TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_rec_prefs_user ON user_recommendation_preferences(user_id);

-- User activity for personalization
CREATE TABLE IF NOT EXISTS user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL, -- 'view_chef', 'view_dish', 'search', 'booking', 'review'
  entity_type VARCHAR(50), -- 'chef', 'dish'
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_activity_user ON user_activity(user_id);
CREATE INDEX idx_user_activity_type ON user_activity(activity_type);
CREATE INDEX idx_user_activity_created ON user_activity(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_vectors_updated_at BEFORE UPDATE ON vectors
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_conversations_updated_at BEFORE UPDATE ON ai_conversations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_rec_prefs_updated_at BEFORE UPDATE ON user_recommendation_preferences
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE vectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE chef_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_recommendation_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policies for messages
CREATE POLICY "Users can view their own messages" ON messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can insert their own messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- RLS Policies for AI conversations
CREATE POLICY "Users can view their own AI conversations" ON ai_conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI conversations" ON ai_conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for AI messages
CREATE POLICY "Users can view their AI messages" ON ai_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM ai_conversations 
      WHERE ai_conversations.id = ai_messages.conversation_id 
      AND ai_conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert AI messages" ON ai_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM ai_conversations 
      WHERE ai_conversations.id = ai_messages.conversation_id 
      AND ai_conversations.user_id = auth.uid()
    )
  );

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for vectors (public read for search)
CREATE POLICY "Anyone can read vectors" ON vectors
  FOR SELECT USING (true);

-- RLS Policies for chef badges (public read)
CREATE POLICY "Anyone can view chef badges" ON chef_badges
  FOR SELECT USING (true);

-- RLS Policies for user recommendation preferences
CREATE POLICY "Users can manage their own preferences" ON user_recommendation_preferences
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for user activity
CREATE POLICY "Users can view their own activity" ON user_activity
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can log their own activity" ON user_activity
  FOR INSERT WITH CHECK (auth.uid() = user_id);
