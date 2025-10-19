'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/auth';
import {
  getUserNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  subscribeToNotifications,
} from '@/lib/notifications';
import { Button } from './ui/button';
import Link from 'next/link';

interface Notification {
  id: string;
  type: string;
  title: string;
  content: string;
  action_url: string | null;
  read: boolean;
  created_at: string;
}

export default function NotificationBell() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadNotifications();
      loadUnreadCount();

      // Subscribe to real-time notifications
      const unsubscribe = subscribeToNotifications(user.id, (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;

    setLoading(true);
    const data = await getUserNotifications(user.id, 10, true);
    setNotifications(data);
    setLoading(false);
  };

  const loadUnreadCount = async () => {
    if (!user) return;

    const count = await getUnreadCount(user.id);
    setUnreadCount(count);
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await markNotificationAsRead(notification.id);
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
      );
    }
    setIsOpen(false);
  };

  const handleMarkAllRead = async () => {
    if (!user) return;

    await markAllNotificationsAsRead(user.id);
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return '📅';
      case 'message':
        return '💬';
      case 'review':
        return '⭐';
      case 'payment':
        return '💰';
      case 'system':
        return '🔔';
      default:
        return '📢';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-full p-2 hover:bg-gray-100 transition"
        aria-label="Notifications"
      >
        <svg
          className="h-6 w-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 z-50 mt-2 w-96 max-w-[calc(100vw-2rem)] rounded-lg border bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-sm text-rose-600 hover:text-rose-700"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-rose-500"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="mb-2 text-4xl">🔔</div>
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`cursor-pointer border-b p-4 transition hover:bg-gray-50 ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      {notification.action_url ? (
                        <Link href={notification.action_url} className="block">
                          <NotificationContent
                            notification={notification}
                            getIcon={getNotificationIcon}
                            formatTime={formatTime}
                          />
                        </Link>
                      ) : (
                        <NotificationContent
                          notification={notification}
                          getIcon={getNotificationIcon}
                          formatTime={formatTime}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t p-3">
              <Link
                href="/notifications"
                className="block text-center text-sm text-rose-600 hover:text-rose-700"
                onClick={() => setIsOpen(false)}
              >
                View all notifications →
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function NotificationContent({
  notification,
  getIcon,
  formatTime,
}: {
  notification: Notification;
  getIcon: (type: string) => string;
  formatTime: (date: string) => string;
}) {
  return (
    <div className="flex items-start space-x-3">
      <div className="text-2xl">{getIcon(notification.type)}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <p className="font-medium text-sm">{notification.title}</p>
          {!notification.read && (
            <div className="ml-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
          )}
        </div>
        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
          {notification.content}
        </p>
        <p className="mt-1 text-xs text-gray-400">
          {formatTime(notification.created_at)}
        </p>
      </div>
    </div>
  );
}
