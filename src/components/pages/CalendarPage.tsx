import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Calendar as CalendarIcon, Clock, MapPin, Users, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { apiCall } from "../../utils/supabase/client";
import { AIChatbot } from "../AIChatbot";

interface CalendarPageProps {
  user: any;
}

export function CalendarPage({ user }: CalendarPageProps) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(true);

  const isChef = user.role === 'chef';

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await apiCall('/bookings', {}, true);
      setBookings(response.bookings || []);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingBookings = bookings.filter(b => 
    new Date(b.date) >= new Date() && (b.status === 'confirmed' || b.status === 'pending')
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastBookings = bookings.filter(b => 
    new Date(b.date) < new Date()
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');

  const bookingDates = bookings
    .filter(b => b.status === 'confirmed')
    .map(b => new Date(b.date));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/10 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'cancelled':
        return 'bg-red-500/10 text-red-700 border-red-200';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <AIChatbot />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl mb-2">
            {isChef ? 'My Bookings' : 'My Calendar'}
          </h1>
          <p className="text-muted-foreground">
            {isChef 
              ? 'Manage your upcoming cooking sessions'
              : 'Track your upcoming culinary experiences'
            }
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Upcoming</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{upcomingBookings.length}</div>
              <p className="text-xs text-muted-foreground">
                Scheduled events
              </p>
            </CardContent>
          </Card>

          {isChef && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Pending Requests</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{pendingBookings.length}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting response
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Confirmed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{confirmedBookings.length}</div>
              <p className="text-xs text-muted-foreground">
                Ready to go
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                modifiers={{
                  booked: bookingDates
                }}
                modifiersStyles={{
                  booked: {
                    backgroundColor: 'hsl(var(--primary) / 0.1)',
                    color: 'hsl(var(--primary))',
                    fontWeight: 'bold'
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* Bookings List */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="upcoming">
              <TabsList className="mb-4">
                <TabsTrigger value="upcoming">
                  Upcoming ({upcomingBookings.length})
                </TabsTrigger>
                <TabsTrigger value="past">
                  Past ({pastBookings.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="space-y-4">
                {upcomingBookings.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No upcoming bookings</p>
                    </CardContent>
                  </Card>
                ) : (
                  upcomingBookings.map((booking) => (
                    <Card key={booking.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">
                                Booking #{booking.id.slice(0, 8)}
                              </h3>
                              {getStatusIcon(booking.status)}
                            </div>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </Badge>
                          </div>
                          {isChef && booking.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button size="sm" variant="default">Accept</Button>
                              <Button size="sm" variant="outline">Decline</Button>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4" />
                            <span>
                              {new Date(booking.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{booking.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}</span>
                          </div>
                          {booking.notes && (
                            <div className="pt-2 border-t border-border">
                              <p className="italic">"{booking.notes}"</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="past" className="space-y-4">
                {pastBookings.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No past bookings</p>
                    </CardContent>
                  </Card>
                ) : (
                  pastBookings.map((booking) => (
                    <Card key={booking.id} className="opacity-75">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="space-y-1">
                            <h3 className="font-semibold">
                              Booking #{booking.id.slice(0, 8)}
                            </h3>
                            <Badge variant="outline">Completed</Badge>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4" />
                            <span>
                              {new Date(booking.date).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{booking.time}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
