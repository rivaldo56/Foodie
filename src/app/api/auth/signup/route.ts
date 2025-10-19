import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role } = await request.json();

    // Validate required fields
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create admin client for user creation
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email for development
      user_metadata: {
        name,
        role
      }
    });

    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { message: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { message: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Create user profile in database
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        email,
        name,
        role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Don't fail if profile creation fails, user is already created
    }

    // If user is a chef, create chef profile
    if (role === 'chef') {
      await supabase
        .from('chef_profiles')
        .insert({
          id: authData.user.id,
          user_id: authData.user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
    }

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name,
        role
      }
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
