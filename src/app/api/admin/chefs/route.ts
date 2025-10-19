import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
    }

    // Get all chefs with user profile data
    const { data: chefs, error } = await supabase
      .from('chef_profiles')
      .select(`
        *,
        user_profiles!inner(name, email)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ chefs });
  } catch (error: any) {
    console.error('Admin chefs error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { chefId, action } = await request.json();

    // Verify admin access
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
    }

    // Perform action
    let updateData: any = {};
    
    if (action === 'approve') {
      updateData = { 
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: user.id
      };
    } else if (action === 'reject') {
      updateData = { 
        status: 'rejected',
        rejected_at: new Date().toISOString(),
        rejected_by: user.id
      };
    } else if (action === 'suspend') {
      updateData = { 
        status: 'suspended',
        suspended_at: new Date().toISOString(),
        suspended_by: user.id
      };
    }

    const { error } = await supabase
      .from('chef_profiles')
      .update(updateData)
      .eq('id', chefId);

    if (error) throw error;

    // Send notification email to chef (implement later)
    // await sendChefStatusNotification(chefId, action);

    return NextResponse.json({ 
      message: `Chef ${action}d successfully` 
    });
  } catch (error: any) {
    console.error('Admin chef update error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
