export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: string
          user_id: string
          chef_id: string
          status: string
          date: string
          start_time: string
          end_time: string
          guests: number
          total_amount: number
          payment_status: string
          location: Json
          special_requests: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          chef_id: string
          status?: string
          date: string
          start_time: string
          end_time: string
          guests: number
          total_amount: number
          payment_status?: string
          location: Json
          special_requests?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          chef_id?: string
          status?: string
          date?: string
          start_time?: string
          end_time?: string
          guests?: number
          total_amount?: number
          payment_status?: string
          location?: Json
          special_requests?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      chef_profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          bio: string
          specialties: string[]
          rating: number
          price_range: Json
          availability: Json | null
          image_url: string
          gallery: string[] | null
          stripe_account_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          bio: string
          specialties: string[]
          rating?: number
          price_range: Json
          availability?: Json | null
          image_url: string
          gallery?: string[] | null
          stripe_account_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          bio?: string
          specialties?: string[]
          rating?: number
          price_range?: Json
          availability?: Json | null
          image_url?: string
          gallery?: string[] | null
          stripe_account_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      dishes: {
        Row: {
          id: string
          chef_id: string
          name: string
          description: string
          price: number
          image_url: string
          cuisine_type: string[]
          dietary_info: string[]
          prep_time: number
          serves: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          chef_id: string
          name: string
          description: string
          price: number
          image_url: string
          cuisine_type: string[]
          dietary_info: string[]
          prep_time: number
          serves: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          chef_id?: string
          name?: string
          description?: string
          price?: number
          image_url?: string
          cuisine_type?: string[]
          dietary_info?: string[]
          prep_time?: number
          serves?: number
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          chef_id: string
          booking_id: string
          rating: number
          comment: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          chef_id: string
          booking_id: string
          rating: number
          comment: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          chef_id?: string
          booking_id?: string
          rating?: number
          comment?: string
          created_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          preferences: Json | null
          language_preference: string
          phone: string | null
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar_url?: string | null
          preferences?: Json | null
          language_preference?: string
          phone?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          preferences?: Json | null
          language_preference?: string
          phone?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          booking_id: string
          sender_id: string
          recipient_id: string
          content: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          sender_id: string
          recipient_id: string
          content: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          sender_id?: string
          recipient_id?: string
          content?: string
          read?: boolean
          created_at?: string
        }
      }
      ai_conversations: {
        Row: {
          id: string
          user_id: string
          language: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          language?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          language?: string
          created_at?: string
          updated_at?: string
        }
      }
      ai_messages: {
        Row: {
          id: string
          conversation_id: string
          role: string
          content: string
          language: string
          intent: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          role: string
          content: string
          language?: string
          intent?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          role?: string
          content?: string
          language?: string
          intent?: string | null
          metadata?: Json
          created_at?: string
        }
      }
      vectors: {
        Row: {
          id: string
          source_type: string
          source_id: string
          content: string
          embedding: number[] | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          source_type: string
          source_id: string
          content: string
          embedding?: number[] | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          source_type?: string
          source_id?: string
          content?: string
          embedding?: number[] | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          content: string
          action_url: string | null
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          content: string
          action_url?: string | null
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          content?: string
          action_url?: string | null
          read?: boolean
          created_at?: string
        }
      }
      chef_badges: {
        Row: {
          id: string
          chef_id: string
          badge_type: string
          earned_at: string
        }
        Insert: {
          id?: string
          chef_id: string
          badge_type: string
          earned_at?: string
        }
        Update: {
          id?: string
          chef_id?: string
          badge_type?: string
          earned_at?: string
        }
      }
      user_recommendation_preferences: {
        Row: {
          id: string
          user_id: string
          cuisine_preferences: string[]
          dietary_restrictions: string[]
          budget_range: Json
          preferred_meal_times: string[]
          favorite_chefs: string[]
          disliked_ingredients: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          cuisine_preferences?: string[]
          dietary_restrictions?: string[]
          budget_range?: Json
          preferred_meal_times?: string[]
          favorite_chefs?: string[]
          disliked_ingredients?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          cuisine_preferences?: string[]
          dietary_restrictions?: string[]
          budget_range?: Json
          preferred_meal_times?: string[]
          favorite_chefs?: string[]
          disliked_ingredients?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      user_activity: {
        Row: {
          id: string
          user_id: string
          activity_type: string
          entity_type: string | null
          entity_id: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          activity_type: string
          entity_type?: string | null
          entity_id?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          activity_type?: string
          entity_type?: string | null
          entity_id?: string | null
          metadata?: Json
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      match_vectors: {
        Args: {
          query_embedding: number[]
          match_threshold: number
          match_count: number
        }
        Returns: {
          id: string
          source_type: string
          source_id: string
          content: string
          similarity: number
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}