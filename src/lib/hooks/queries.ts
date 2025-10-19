import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';

type Tables = Database['public']['Tables'];
type Row<T extends keyof Tables> = Tables[T]['Row'];

export function useChef(id: string) {
  const [chef, setChef] = useState<Row<'chef_profiles'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchChef = async () => {
      try {
        const { data, error: err } = await supabase
          .from('chef_profiles')
          .select('*')
          .eq('id', id)
          .single();

        if (err) throw err;
        setChef(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchChef();
  }, [id]);

  return { chef, loading, error };
}

export function useChefDishes(chefId: string) {
  const [dishes, setDishes] = useState<Row<'dishes'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const { data, error: err } = await supabase
          .from('dishes')
          .select('*')
          .eq('chef_id', chefId)
          .order('created_at', { ascending: false });

        if (err) throw err;
        setDishes(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, [chefId]);

  return { dishes, loading, error };
}

export function useChefReviews(chefId: string) {
  const [reviews, setReviews] = useState<Row<'reviews'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error: err } = await supabase
          .from('reviews')
          .select('*, user_profiles(name, avatar_url)')
          .eq('chef_id', chefId)
          .order('created_at', { ascending: false });

        if (err) throw err;
        setReviews(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [chefId]);

  return { reviews, loading, error };
}

export function useBookings(userId: string, isChef: boolean = false) {
  const [bookings, setBookings] = useState<Row<'bookings'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data, error: err } = await supabase
          .from('bookings')
          .select(`
            *,
            chef_profiles(name, image_url),
            user_profiles(name)
          `)
          .eq(isChef ? 'chef_id' : 'user_id', userId)
          .order('date', { ascending: true });

        if (err) throw err;
        setBookings(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();

    // Subscribe to changes
    const subscription = supabase
      .channel('bookings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `${isChef ? 'chef_id' : 'user_id'}=eq.${userId}`,
        },
        () => {
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId, isChef]);

  return { bookings, loading, error };
}

// Real-time messaging hook
export function useMessages(bookingId: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error: err } = await supabase
          .from('messages')
          .select('*, user_profiles(name, avatar_url)')
          .eq('booking_id', bookingId)
          .order('created_at', { ascending: true });

        if (err) throw err;
        setMessages(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

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
          setMessages((current) => [...current, payload.new]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [bookingId]);

  const sendMessage = async (content: string, userId: string) => {
    try {
      const { error } = await supabase.from('messages').insert({
        booking_id: bookingId,
        user_id: userId,
        content,
      });

      if (error) throw error;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return { messages, loading, error, sendMessage };
}

// Search and filter hooks
export function useChefSearch(filters: {
  cuisine?: string[];
  priceRange?: { min: number; max: number };
  rating?: number;
  date?: string;
}) {
  const [chefs, setChefs] = useState<Row<'chef_profiles'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const searchChefs = async () => {
      try {
        let query = supabase.from('chef_profiles').select('*');

        if (filters.cuisine?.length) {
          query = query.contains('specialties', filters.cuisine);
        }

        if (filters.rating) {
          query = query.gte('rating', filters.rating);
        }

        if (filters.priceRange) {
          query = query.and(
            `price_range->>'min'::float8 >= ${filters.priceRange.min},` +
            `price_range->>'max'::float8 <= ${filters.priceRange.max}`
          );
        }

        const { data, error: err } = await query;

        if (err) throw err;
        setChefs(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    searchChefs();
  }, [filters]);

  return { chefs, loading, error };
}