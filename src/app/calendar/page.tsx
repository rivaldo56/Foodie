"use client";

import { useAuth } from "@/lib/context/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CalendarPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl mb-8">My Calendar</h1>
      
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-xl font-semibold">Upcoming Bookings</h2>
            <span className="text-sm text-muted-foreground">Sync with Google Calendar</span>
          </div>
          
          {/* Calendar content will be rendered here */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">Italian Dinner</p>
                  <p className="text-sm text-muted-foreground">with Chef Maria</p>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Confirmed</span>
              </div>
              <p className="text-sm text-muted-foreground">Dec 25, 2024 • 7:00 PM</p>
              <p className="text-sm mt-2">4 guests • $340</p>
            </div>
            
            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">Japanese Omakase</p>
                  <p className="text-sm text-muted-foreground">with Chef Kenji</p>
                </div>
                <span className="text-xs bg-yellow-500/10 text-yellow-700 px-2 py-1 rounded">Pending</span>
              </div>
              <p className="text-sm text-muted-foreground">Dec 28, 2024 • 6:30 PM</p>
              <p className="text-sm mt-2">2 guests • $280</p>
            </div>
          </div>

          <div className="text-center py-8 text-muted-foreground">
            <p>More bookings coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
