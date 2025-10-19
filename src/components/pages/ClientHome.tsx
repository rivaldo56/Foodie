import { useState, useEffect } from "react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Star, MapPin, Search, Heart, TrendingUp, Sparkles, Calendar } from "lucide-react";
import { apiCall } from "../../utils/supabase/client";
import { ChefProfileDialog } from "../ChefProfileDialog";
import { AIChatbot } from "../AIChatbot";

interface ClientHomeProps {
  user: any;
}

// Mock AI-recommended dishes
const recommendedDishes = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwZm9vZCUyMHBsYXRlfGVufDB8fHx8MTczOTU2NDAwMHww&ixlib=rb-4.1.0&q=80&w=1080",
    chefId: "chef-1",
    chef: "Chef Wanjiku Kamau",
    title: "Traditional Pilau & Kuku Kienyeji",
    cuisine: "Kenyan",
    rating: 4.9,
    reviews: 234,
    price: "$35",
    location: "Nairobi",
    aiMatch: 98,
    reason: "Perfect for authentic Kenyan flavors"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJiZWN1ZSUyMG1lYXR8ZW58MHx8fHwxNzM5NTY0MDAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    chefId: "chef-2",
    chef: "Chef David Mwangi",
    title: "Premium Nyama Choma Experience",
    cuisine: "Nyama Choma",
    rating: 5.0,
    reviews: 312,
    price: "$55",
    location: "Karen",
    aiMatch: 96,
    reason: "Top-rated for authentic BBQ"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWFmb29kJTIwcGxhdHRlcnxlbnwwfHx8fDE3Mzk1NjQwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    chefId: "chef-3",
    chef: "Chef Amina Hassan",
    title: "Swahili Coastal Platter",
    cuisine: "Swahili Coast",
    rating: 4.9,
    reviews: 187,
    price: "$48",
    location: "Parklands",
    aiMatch: 94,
    reason: "Coastal flavors you'll love"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1574484284002-952d92456975?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBiaXJ5YW5pfGVufDB8fHx8MTczOTU2NDAwMHww&ixlib=rb-4.1.0&q=80&w=1080",
    chefId: "chef-4",
    chef: "Chef Fatuma Ahmed",
    title: "Aromatic Biryani & Samosas",
    cuisine: "Pilau & Biryani",
    rating: 4.8,
    reviews: 156,
    price: "$38",
    location: "Eastleigh",
    aiMatch: 92,
    reason: "Spice-rich dishes you prefer"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGRpc2h8ZW58MXx8fHwxNzYwMDU0NjA2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    chefId: "chef-5",
    chef: "Chef Sofia Rossi",
    title: "Handmade Pasta Creation",
    cuisine: "Italian",
    rating: 5.0,
    reviews: 201,
    price: "$65",
    location: "Lavington",
    aiMatch: 90,
    reason: "International flair"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwc3RldyUyMHVnYWxpfGVufDB8fHx8MTczOTU2NDAwMHww&ixlib=rb-4.1.0&q=80&w=1080",
    chefId: "chef-6",
    chef: "Chef James Ochieng",
    title: "Ugali, Beef Stew & Sukuma",
    cuisine: "Kenyan",
    rating: 4.9,
    reviews: 198,
    price: "$28",
    location: "Westlands",
    aiMatch: 88,
    reason: "Comfort food done right"
  }
];

export function ClientHome({ user }: ClientHomeProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChef, setSelectedChef] = useState<string | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await apiCall('/bookings', {}, true);
      setBookings(response.bookings || []);
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  const upcomingBookings = bookings.filter(b => 
    b.status === 'confirmed' && new Date(b.date) >= new Date()
  ).slice(0, 2);

  return (
    <div className="min-h-screen bg-background pb-24">
      <AIChatbot />
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl mb-2">
            Welcome back, {user.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-muted-foreground">
            Discover personalized chef recommendations just for you
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by cuisine, location, or chef name..."
              className="pl-12 h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Upcoming Bookings */}
        {upcomingBookings.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Upcoming Bookings
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {upcomingBookings.map((booking) => (
                <Card key={booking.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">Booking #{booking.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(booking.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                      <Badge className="bg-secondary text-secondary-foreground">
                        {booking.time}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      👥 {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* AI Recommendations Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-2xl">AI-Powered Recommendations</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedDishes.map((dish) => (
              <Card
                key={dish.id}
                className="group cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary/50 overflow-hidden"
                onClick={() => setSelectedChef(dish.chefId)}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <ImageWithFallback
                    src={dish.image}
                    alt={dish.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-primary text-primary-foreground border-0 gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {dish.aiMatch}% Match
                    </Badge>
                  </div>
                  <button 
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle favorite
                    }}
                  >
                    <Heart className="w-4 h-4 text-muted-foreground hover:text-primary" />
                  </button>
                </div>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="line-clamp-1 mb-1">{dish.title}</h3>
                    <p className="text-sm text-muted-foreground">{dish.chef}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {dish.cuisine}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-primary">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{dish.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {dish.location}
                    </span>
                    <span>{dish.price}</span>
                  </div>

                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground italic">
                      💡 {dish.reason}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Chef Profile Dialog */}
      {selectedChef && (
        <ChefProfileDialog
          chefId={selectedChef}
          open={!!selectedChef}
          onOpenChange={(open) => !open && setSelectedChef(null)}
          onBookingComplete={loadBookings}
        />
      )}
    </div>
  );
}
