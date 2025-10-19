import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getPersonalizedRecommendations } from '@/lib/ai/rag';
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

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '12');

    // Get personalized recommendations
    const recommendations = await getPersonalizedRecommendations({
      userId: user.id,
      limit,
    });

    // Fetch actual chef and dish data
    const chefIds = recommendations
      .filter((r) => r.type === 'chef')
      .map((r) => r.id);
    const dishIds = recommendations
      .filter((r) => r.type === 'dish')
      .map((r) => r.id);

    const [chefsData, dishesData] = await Promise.all([
      chefIds.length > 0
        ? supabase
            .from('chef_profiles')
            .select('*, badges:chef_badges(*)')
            .in('id', chefIds)
        : { data: [], error: null },
      dishIds.length > 0
        ? supabase
            .from('dishes')
            .select('*, chef:chef_profiles(name, image_url)')
            .in('id', dishIds)
        : { data: [], error: null },
    ]);

    // Combine and sort by recommendation score
    const items = [
      ...(chefsData.data || []).map((chef) => {
        const rec = recommendations.find((r) => r.id === chef.id);
        return {
          type: 'chef' as const,
          data: chef,
          score: rec?.score || 0,
        };
      }),
      ...(dishesData.data || []).map((dish) => {
        const rec = recommendations.find((r) => r.id === dish.id);
        return {
          type: 'dish' as const,
          data: dish,
          score: rec?.score || 0,
        };
      }),
    ].sort((a, b) => b.score - a.score);

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Recommendations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
