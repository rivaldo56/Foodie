import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/supabase/database.types';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get chef profile
    const { data: chefProfile, error: chefError } = await supabase
      .from('chef_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (chefError || !chefProfile) {
      return NextResponse.json(
        { error: 'Chef profile not found' },
        { status: 404 }
      );
    }

    // Get time range from query params
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get bookings
    const { data: bookings } = await supabase
      .from('bookings')
      .select('*')
      .eq('chef_id', chefProfile.id)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    // Calculate stats
    const totalBookings = bookings?.length || 0;
    const completedBookings = bookings?.filter(b => b.status === 'completed').length || 0;
    const pendingBookings = bookings?.filter(b => b.status === 'pending').length || 0;
    const confirmedBookings = bookings?.filter(b => b.status === 'confirmed').length || 0;
    
    const totalEarnings = bookings
      ?.filter(b => b.payment_status === 'completed')
      .reduce((sum, b) => sum + b.total_amount, 0) || 0;

    // Calculate commission (15% platform fee)
    const commission = totalEarnings * 0.15;
    const netEarnings = totalEarnings - commission;

    // Get reviews
    const { data: reviews } = await supabase
      .from('reviews')
      .select('*')
      .eq('chef_id', chefProfile.id)
      .gte('created_at', startDate.toISOString());

    const averageRating = reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    // Get badges
    const { data: badges } = await supabase
      .from('chef_badges')
      .select('*')
      .eq('chef_id', chefProfile.id);

    // Get upcoming bookings
    const now = new Date().toISOString();
    const { data: upcomingBookings } = await supabase
      .from('bookings')
      .select(`
        *,
        user:user_profiles(name, email, phone)
      `)
      .eq('chef_id', chefProfile.id)
      .in('status', ['confirmed', 'pending'])
      .gte('date', now)
      .order('date', { ascending: true })
      .limit(5);

    // Get unread messages count
    const { data: unreadMessages } = await supabase
      .from('messages')
      .select('id')
      .eq('recipient_id', user.id)
      .eq('read', false);

    // Calculate earnings trend (last 7 days)
    const earningsByDay: Record<string, number> = {};
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    last7Days.forEach(day => {
      earningsByDay[day] = 0;
    });

    bookings
      ?.filter(b => b.payment_status === 'completed')
      .forEach(booking => {
        const bookingDate = new Date(booking.created_at).toISOString().split('T')[0];
        if (earningsByDay[bookingDate] !== undefined) {
          earningsByDay[bookingDate] += booking.total_amount * 0.85; // After commission
        }
      });

    return NextResponse.json({
      profile: chefProfile,
      stats: {
        totalBookings,
        completedBookings,
        pendingBookings,
        confirmedBookings,
        totalEarnings,
        commission,
        netEarnings,
        averageRating: parseFloat(averageRating.toFixed(1)),
        totalReviews: reviews?.length || 0,
        unreadMessages: unreadMessages?.length || 0,
      },
      badges,
      upcomingBookings,
      earningsTrend: Object.entries(earningsByDay).map(([date, amount]) => ({
        date,
        amount,
      })),
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
