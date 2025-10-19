import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/supabase/database.types';

// Badge criteria
const BADGE_CRITERIA = {
  top_chef: {
    minRating: 4.8,
    minReviews: 20,
    minBookings: 50,
  },
  '5_star': {
    minRating: 5.0,
    minReviews: 10,
  },
  fast_responder: {
    avgResponseTime: 3600, // 1 hour in seconds
    minResponses: 10,
  },
  verified: {
    // Manually assigned by admin
    manual: true,
  },
};

// Check and award badges to a chef
export async function POST(request: NextRequest) {
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
    const { data: chefProfile } = await supabase
      .from('chef_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!chefProfile) {
      return NextResponse.json(
        { error: 'Chef profile not found' },
        { status: 404 }
      );
    }

    // Get current badges
    const { data: existingBadges } = await supabase
      .from('chef_badges')
      .select('badge_type')
      .eq('chef_id', chefProfile.id);

    const existingBadgeTypes = existingBadges?.map(b => b.badge_type) || [];

    // Get stats
    const { data: reviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('chef_id', chefProfile.id);

    const { data: bookings } = await supabase
      .from('bookings')
      .select('status')
      .eq('chef_id', chefProfile.id);

    const completedBookings = bookings?.filter(b => b.status === 'completed').length || 0;
    const totalReviews = reviews?.length || 0;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

    const newBadges: string[] = [];

    // Check Top Chef badge
    if (
      !existingBadgeTypes.includes('top_chef') &&
      averageRating >= BADGE_CRITERIA.top_chef.minRating &&
      totalReviews >= BADGE_CRITERIA.top_chef.minReviews &&
      completedBookings >= BADGE_CRITERIA.top_chef.minBookings
    ) {
      await supabase.from('chef_badges').insert({
        chef_id: chefProfile.id,
        badge_type: 'top_chef',
      });
      newBadges.push('top_chef');
    }

    // Check 5 Star badge
    if (
      !existingBadgeTypes.includes('5_star') &&
      averageRating >= BADGE_CRITERIA['5_star'].minRating &&
      totalReviews >= BADGE_CRITERIA['5_star'].minReviews
    ) {
      await supabase.from('chef_badges').insert({
        chef_id: chefProfile.id,
        badge_type: '5_star',
      });
      newBadges.push('5_star');
    }

    return NextResponse.json({
      success: true,
      newBadges,
      message: newBadges.length > 0
        ? `Congratulations! You've earned ${newBadges.length} new badge(s)!`
        : 'No new badges earned yet. Keep up the great work!',
    });
  } catch (error) {
    console.error('Badges API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
