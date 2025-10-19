import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { enhanceFoodPhoto } from '@/lib/replicate/image-enhancement';
import type { Database } from '@/lib/supabase/database.types';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, dishId, options } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

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

    // Check if user is a chef
    const { data: chefProfile } = await supabase
      .from('chef_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!chefProfile) {
      return NextResponse.json(
        { error: 'Only chefs can enhance images' },
        { status: 403 }
      );
    }

    // Enhance the image
    const enhancedImageUrl = await enhanceFoodPhoto(imageUrl, options);

    // If dishId is provided, update the dish
    if (dishId) {
      const { error: updateError } = await supabase
        .from('dishes')
        .update({
          image_url: enhancedImageUrl,
          ai_enhanced: true,
          enhancement_metadata: {
            original_url: imageUrl,
            enhanced_at: new Date().toISOString(),
            options,
          },
        })
        .eq('id', dishId)
        .eq('chef_id', chefProfile.id);

      if (updateError) {
        console.error('Failed to update dish:', updateError);
      }
    }

    return NextResponse.json({
      success: true,
      originalUrl: imageUrl,
      enhancedUrl: enhancedImageUrl,
      message: 'Image enhanced successfully',
    });
  } catch (error) {
    console.error('Image enhancement API error:', error);
    return NextResponse.json(
      { error: 'Failed to enhance image' },
      { status: 500 }
    );
  }
}
