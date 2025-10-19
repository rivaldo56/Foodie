import { supabase } from '@/lib/supabase/client';

export type NotificationType = 'booking' | 'message' | 'review' | 'payment' | 'system';

export interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  content: string;
  actionUrl?: string;
}

// Create a notification
export async function createNotification(params: CreateNotificationParams): Promise<void> {
  try {
    const { error } = await supabase.from('notifications').insert({
      user_id: params.userId,
      type: params.type,
      title: params.title,
      content: params.content,
      action_url: params.actionUrl,
    });

    if (error) throw error;
  } catch (error) {
    console.error('Failed to create notification:', error);
    throw error;
  }
}

// Get user notifications
export async function getUserNotifications(
  userId: string,
  limit: number = 20,
  includeRead: boolean = false
): Promise<any[]> {
  try {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (!includeRead) {
      query = query.eq('read', false);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Failed to get notifications:', error);
    return [];
  }
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) throw error;
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
  }
}

// Mark all notifications as read
export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
  }
}

// Delete a notification
export async function deleteNotification(notificationId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) throw error;
  } catch (error) {
    console.error('Failed to delete notification:', error);
  }
}

// Get unread notification count
export async function getUnreadCount(userId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;

    return count || 0;
  } catch (error) {
    console.error('Failed to get unread count:', error);
    return 0;
  }
}

// Notification templates for common actions
export const NotificationTemplates = {
  newBooking: (chefName: string, bookingId: string) => ({
    type: 'booking' as NotificationType,
    title: 'New Booking Request',
    content: `${chefName} has requested a booking. Review and accept it now.`,
    actionUrl: `/bookings/${bookingId}`,
  }),

  bookingConfirmed: (chefName: string, date: string, bookingId: string) => ({
    type: 'booking' as NotificationType,
    title: 'Booking Confirmed',
    content: `Your booking with ${chefName} on ${date} has been confirmed!`,
    actionUrl: `/bookings/${bookingId}`,
  }),

  bookingCancelled: (chefName: string, bookingId: string) => ({
    type: 'booking' as NotificationType,
    title: 'Booking Cancelled',
    content: `Your booking with ${chefName} has been cancelled.`,
    actionUrl: `/bookings/${bookingId}`,
  }),

  newMessage: (senderName: string, preview: string, bookingId: string) => ({
    type: 'message' as NotificationType,
    title: `New message from ${senderName}`,
    content: preview.substring(0, 100),
    actionUrl: `/bookings/${bookingId}`,
  }),

  newReview: (clientName: string, rating: number, reviewId: string) => ({
    type: 'review' as NotificationType,
    title: 'New Review Received',
    content: `${clientName} left you a ${rating}-star review!`,
    actionUrl: `/reviews/${reviewId}`,
  }),

  paymentReceived: (amount: number, bookingId: string) => ({
    type: 'payment' as NotificationType,
    title: 'Payment Received',
    content: `You've received $${amount} for a completed booking.`,
    actionUrl: `/bookings/${bookingId}`,
  }),

  badgeEarned: (badgeName: string) => ({
    type: 'system' as NotificationType,
    title: 'New Badge Earned!',
    content: `Congratulations! You've earned the "${badgeName}" badge.`,
    actionUrl: '/dashboard',
  }),
};

// Subscribe to real-time notifications
export function subscribeToNotifications(
  userId: string,
  callback: (notification: any) => void
) {
  const subscription = supabase
    .channel('notifications')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}
