// Google Calendar integration for ChefConnect

export interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
  }>;
}

// Get Google Calendar authorization URL
export function getGoogleCalendarAuthUrl(redirectUri: string, state?: string): string {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  
  if (!clientId) {
    throw new Error('Google Client ID not configured');
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/calendar.events',
    access_type: 'offline',
    prompt: 'consent',
    ...(state && { state }),
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

// Exchange authorization code for access token
export async function exchangeCodeForToken(code: string, redirectUri: string): Promise<{
  access_token: string;
  refresh_token?: string;
  expiry_date: number;
}> {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth credentials not configured');
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to exchange code for token');
  }

  const data = await response.json();

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expiry_date: Date.now() + (data.expires_in * 1000),
  };
}

// Refresh access token
export async function refreshAccessToken(refreshToken: string): Promise<{
  access_token: string;
  expiry_date: number;
}> {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth credentials not configured');
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh access token');
  }

  const data = await response.json();

  return {
    access_token: data.access_token,
    expiry_date: Date.now() + (data.expires_in * 1000),
  };
}

// Create a calendar event
export async function createCalendarEvent(
  accessToken: string,
  event: CalendarEvent,
  calendarId: string = 'primary'
): Promise<any> {
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to create calendar event: ${error.message}`);
  }

  return response.json();
}

// Update a calendar event
export async function updateCalendarEvent(
  accessToken: string,
  eventId: string,
  event: CalendarEvent,
  calendarId: string = 'primary'
): Promise<any> {
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update calendar event');
  }

  return response.json();
}

// Delete a calendar event
export async function deleteCalendarEvent(
  accessToken: string,
  eventId: string,
  calendarId: string = 'primary'
): Promise<void> {
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to delete calendar event');
  }
}

// Get events from calendar
export async function getCalendarEvents(
  accessToken: string,
  params: {
    timeMin?: string;
    timeMax?: string;
    maxResults?: number;
    calendarId?: string;
  } = {}
): Promise<any[]> {
  const {
    timeMin = new Date().toISOString(),
    timeMax,
    maxResults = 10,
    calendarId = 'primary',
  } = params;

  const queryParams = new URLSearchParams({
    timeMin,
    ...(timeMax && { timeMax }),
    maxResults: maxResults.toString(),
    singleEvents: 'true',
    orderBy: 'startTime',
  });

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?${queryParams}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch calendar events');
  }

  const data = await response.json();
  return data.items || [];
}
