import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  try {
    // Get auth token from header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');

    // Create client with user token to verify admin
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get user from token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        { message: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get dashboard statistics
    const [
      { count: totalUsers },
      { count: totalChefs },
      { count: pendingChefs },
      { count: totalBookings },
      { count: todayBookings },
      { count: aiChats }
    ] = await Promise.all([
      supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
      supabase.from('chef_profiles').select('*', { count: 'exact', head: true }),
      supabase.from('chef_profiles').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('bookings').select('*', { count: 'exact', head: true }),
      supabase.from('bookings').select('*', { count: 'exact', head: true }).gte('created_at', new Date().toISOString().split('T')[0]),
      supabase.from('ai_conversations').select('*', { count: 'exact', head: true })
    ]);

    // Calculate revenue (mock for now)
    const { data: bookingsData } = await supabase
      .from('bookings')
      .select('amount')
      .eq('status', 'completed');

    const revenue = bookingsData?.reduce((sum, booking) => sum + (booking.amount || 0), 0) || 0;

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      totalChefs: totalChefs || 0,
      pendingChefs: pendingChefs || 0,
      totalBookings: totalBookings || 0,
      todayBookings: todayBookings || 0,
      revenue,
      aiChats: aiChats || 0
    });
  } catch (error: any) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
