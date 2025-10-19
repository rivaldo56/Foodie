import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/context/auth';
import toast from 'react-hot-toast';

export function useNotifications() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Request notification permission
    if ('Notification' in window) {
      Notification.requestPermission();
    }

    // Subscribe to new messages
    const messageSubscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${user.id}`,
        },
        (payload) => {
          showNotification('New Message', payload.new.content);
        }
      )
      .subscribe();

    // Subscribe to booking updates
    const bookingSubscription = supabase
      .channel('bookings')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookings',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const booking = payload.new;
          showNotification(
            'Booking Update',
            `Your booking status has changed to: ${booking.status}`
          );
        }
      )
      .subscribe();

    return () => {
      messageSubscription.unsubscribe();
      bookingSubscription.unsubscribe();
    };
  }, [user]);

  const showNotification = (title: string, body: string) => {
    // Show toast notification in-app
    toast(body, {
      icon: '🔔',
    });

    // Show system notification if permitted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
      });
    }
  };
}

// Service Worker registration for push notifications
export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      return registration;
    } catch (error) {
      console.error('Service worker registration failed:', error);
      return null;
    }
  }
  return null;
}