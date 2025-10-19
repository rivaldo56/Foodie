import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { createCalendarEvent, deleteCalendarEvent } from '@/lib/calendar/google';
import type { Database } from '@/lib/supabase/database.types';

// Sync booking to Google Calendar
export async function POST(request: NextRequest) {
  try {
    const { bookingId, action } = await request.json();

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
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

    // Get booking details
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        *,
        chef:chef_profiles!bookings_chef_id_fkey(
          name,
          google_calendar_id,
          user_id
        ),
        client:user_profiles!bookings_user_id_fkey(
          name,
          email
        )
      `)
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check if user is the chef
    if (booking.chef.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized - not the chef for this booking' },
        { status: 403 }
      );
    }

    // Check if calendar sync is enabled
    const { data: chefProfile } = await supabase
      .from('chef_profiles')
      .select('calendar_sync_enabled, google_calendar_id')
      .eq('user_id', user.id)
      .single();

    if (!chefProfile?.calendar_sync_enabled) {
      return NextResponse.json(
        { error: 'Calendar sync is not enabled' },
        { status: 400 }
      );
    }

    // Get Google Calendar access token (stored securely in your auth system)
    // This is a simplified version - implement proper token storage and refresh
    const accessToken = process.env.GOOGLE_CALENDAR_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Google Calendar not connected' },
        { status: 400 }
      );
    }

    if (action === 'create') {
      // Create calendar event
      const startDateTime = new Date(`${booking.date}T${booking.start_time}`);
      const endDateTime = new Date(`${booking.date}T${booking.end_time}`);

      const calendarEvent = {
        summary: `Booking: ${booking.client.name}`,
        description: `ChefConnect Booking\nGuests: ${booking.guests}\nAmount: $${booking.total_amount}\n${booking.special_requests ? `\nSpecial Requests: ${booking.special_requests}` : ''}`,
        location: typeof booking.location === 'object' 
          ? (booking.location as any).address 
          : 'Client Location',
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: 'Africa/Nairobi',
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: 'Africa/Nairobi',
        },
        attendees: [
          {
            email: booking.client.email,
            displayName: booking.client.name,
          },
        ],
      };

      const googleEvent = await createCalendarEvent(
        accessToken,
        calendarEvent,
        chefProfile.google_calendar_id || 'primary'
      );

      // Store the Google Calendar event ID
      await supabase
        .from('bookings')
        .update({
          metadata: {
            google_calendar_event_id: googleEvent.id,
          },
        } as any)
        .eq('id', bookingId);

      return NextResponse.json({
        success: true,
        eventId: googleEvent.id,
        message: 'Booking synced to Google Calendar',
      });
    } else if (action === 'delete') {
      // Delete calendar event
      const metadata = booking.metadata as any;
      const eventId = metadata?.google_calendar_event_id;

      if (eventId) {
        await deleteCalendarEvent(
          accessToken,
          eventId,
          chefProfile.google_calendar_id || 'primary'
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Booking removed from Google Calendar',
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Calendar sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync with Google Calendar' },
      { status: 500 }
    );
  }
}
