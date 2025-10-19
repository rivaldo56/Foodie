import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
type ChefProfile = Database['public']['Tables']['chef_profiles']['Row'];

interface AuthContextType {
  user: (User & { role?: string; name?: string }) | null;
  profile: UserProfile | null;
  chefProfile: ChefProfile | null;
  loading: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [chefProfile, setChefProfile] = useState<ChefProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error getting session:', error);
        setLoading(false);
      });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setChefProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      // Fetch user profile
      const { data: userProfile, error: userError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) throw userError;
      setProfile(userProfile);

      // Update user object with profile data
      setUser(prevUser => prevUser ? {
        ...prevUser,
        role: userProfile.role,
        name: userProfile.name
      } : null);

      // Check if user is also a chef
      const { data: chef, error: chefError } = await supabase
        .from('chef_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!chefError) {
        setChefProfile(chef);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signIn = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const refreshProfile = () => {
    if (user) {
      return fetchProfile(user.id);
    }
    return Promise.resolve();
  };

  const value = {
    user,
    profile,
    chefProfile,
    loading,
    signIn,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}