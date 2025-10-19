'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/auth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface DashboardData {
  profile: any;
  stats: {
    totalBookings: number;
    completedBookings: number;
    pendingBookings: number;
    confirmedBookings: number;
    totalEarnings: number;
    commission: number;
    netEarnings: number;
    averageRating: number;
    totalReviews: number;
    unreadMessages: number;
  };
  badges: Array<{ id: string; badge_type: string; earned_at: string }>;
  upcomingBookings: any[];
  earningsTrend: Array<{ date: string; amount: number }>;
}

const BADGE_INFO: Record<string, { label: string; emoji: string; color: string }> = {
  top_chef: { label: 'Top Chef', emoji: '👑', color: 'bg-yellow-100 text-yellow-800' },
  '5_star': { label: '5-Star Chef', emoji: '⭐', color: 'bg-blue-100 text-blue-800' },
  fast_responder: { label: 'Fast Responder', emoji: '⚡', color: 'bg-green-100 text-green-800' },
  verified: { label: 'Verified', emoji: '✓', color: 'bg-purple-100 text-purple-800' },
};

export default function ChefDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);

  useEffect(() => {
    if (user) {
      loadDashboard();
    }
  }, [user, timeRange]);

  const loadDashboard = async () => {
    try {
      const response = await fetch(`/api/chef/dashboard?days=${timeRange}`);
      
      if (!response.ok) {
        throw new Error('Failed to load dashboard');
      }

      const dashboardData = await response.json();
      setData(dashboardData);
    } catch (error) {
      console.error('Dashboard error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const checkBadges = async () => {
    try {
      const response = await fetch('/api/chef/badges', {
        method: 'POST',
      });

      const result = await response.json();
      
      if (result.newBadges?.length > 0) {
        toast.success(result.message);
        loadDashboard(); // Reload to show new badges
      } else {
        toast(result.message, { icon: '📊' });
      }
    } catch (error) {
      console.error('Badge check error:', error);
      toast.error('Failed to check badges');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 animate-pulse rounded bg-gray-200"></div>
        <div className="grid gap-4 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-gray-200"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <Card className="p-8 text-center">
        <div className="mb-4 text-4xl">👨‍🍳</div>
        <h2 className="mb-2 text-xl font-semibold">Chef Profile Not Found</h2>
        <p className="text-gray-600">
          You need to set up your chef profile to access the dashboard.
        </p>
        <Button className="mt-4">Set Up Profile</Button>
      </Card>
    );
  }

  const { stats, badges, upcomingBookings, earningsTrend } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Chef Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your performance overview.</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value))}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <Button onClick={checkBadges} variant="outline" size="sm">
            Check Badges
          </Button>
        </div>
      </div>

      {/* Badges */}
      {badges && badges.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {badges.map((badge) => {
            const info = BADGE_INFO[badge.badge_type];
            return info ? (
              <div
                key={badge.id}
                className={`flex items-center space-x-2 rounded-full px-4 py-2 text-sm font-medium ${info.color}`}
              >
                <span>{info.emoji}</span>
                <span>{info.label}</span>
              </div>
            ) : null;
          })}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Net Earnings</div>
              <div className="mt-1 text-3xl font-bold">${stats.netEarnings.toFixed(0)}</div>
              <div className="mt-1 text-xs text-gray-500">
                Commission: ${stats.commission.toFixed(0)}
              </div>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Total Bookings</div>
              <div className="mt-1 text-3xl font-bold">{stats.totalBookings}</div>
              <div className="mt-1 text-xs text-gray-500">
                {stats.completedBookings} completed
              </div>
            </div>
            <div className="text-4xl">📅</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Average Rating</div>
              <div className="mt-1 text-3xl font-bold">{stats.averageRating}</div>
              <div className="mt-1 text-xs text-gray-500">
                {stats.totalReviews} reviews
              </div>
            </div>
            <div className="text-4xl">⭐</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Pending</div>
              <div className="mt-1 text-3xl font-bold">{stats.pendingBookings}</div>
              <div className="mt-1 text-xs text-gray-500">
                {stats.unreadMessages} new messages
              </div>
            </div>
            <div className="text-4xl">🔔</div>
          </div>
        </Card>
      </div>

      {/* Earnings Trend */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Earnings Trend (Last 7 Days)</h3>
        <div className="flex items-end justify-between space-x-2 h-48">
          {earningsTrend.map((day) => {
            const maxAmount = Math.max(...earningsTrend.map(d => d.amount), 100);
            const height = (day.amount / maxAmount) * 100;
            
            return (
              <div key={day.date} className="flex flex-1 flex-col items-center">
                <div className="relative w-full">
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-rose-500 to-pink-400 transition-all hover:from-rose-600 hover:to-pink-500"
                    style={{ height: `${height}%`, minHeight: day.amount > 0 ? '20px' : '0' }}
                  >
                    {day.amount > 0 && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold">
                        ${day.amount.toFixed(0)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Bookings */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Upcoming Bookings</h3>
            <Link href="/bookings" className="text-sm text-rose-600 hover:text-rose-700">
              View all →
            </Link>
          </div>
          {upcomingBookings && upcomingBookings.length > 0 ? (
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-start justify-between rounded-lg border p-4"
                >
                  <div>
                    <div className="font-medium">{booking.user?.name || 'Guest'}</div>
                    <div className="mt-1 text-sm text-gray-600">
                      {new Date(booking.date).toLocaleDateString()} at {booking.start_time}
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      {booking.guests} guests • ${booking.total_amount}
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              <div className="mb-2 text-3xl">📭</div>
              No upcoming bookings
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              href="/dashboard/menu"
              className="flex items-center justify-between rounded-lg border p-4 transition hover:bg-gray-50"
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">📖</div>
                <div>
                  <div className="font-medium">Manage Menu</div>
                  <div className="text-sm text-gray-600">Add or edit your dishes</div>
                </div>
              </div>
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              href="/dashboard/availability"
              className="flex items-center justify-between rounded-lg border p-4 transition hover:bg-gray-50"
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">📅</div>
                <div>
                  <div className="font-medium">Update Availability</div>
                  <div className="text-sm text-gray-600">Manage your calendar</div>
                </div>
              </div>
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              href="/dashboard/profile"
              className="flex items-center justify-between rounded-lg border p-4 transition hover:bg-gray-50"
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">👤</div>
                <div>
                  <div className="font-medium">Edit Profile</div>
                  <div className="text-sm text-gray-600">Update bio and photos</div>
                </div>
              </div>
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              href="/dashboard/payouts"
              className="flex items-center justify-between rounded-lg border p-4 transition hover:bg-gray-50"
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">💳</div>
                <div>
                  <div className="font-medium">Stripe Payouts</div>
                  <div className="text-sm text-gray-600">Manage payments</div>
                </div>
              </div>
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
