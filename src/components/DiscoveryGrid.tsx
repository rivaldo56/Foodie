"use client";

import { useState, useCallback, useEffect } from "react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Badge } from "./ui/badge";
import { Star, MapPin, TrendingUp, Loader2 } from "lucide-react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

const initialDishes = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1758580815433-5e35651c1243?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwcGxhdGVkJTIwZm9vZHxlbnwxfHx8fDE3NjAwNjM5MjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    chef: "Chef Maria Rodriguez",
    title: "Gourmet Plated Experience",
    cuisine: "French",
    rating: 4.9,
    reviews: 127,
    price: "$85",
    location: "Nairobi",
    trending: true
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1594998790278-5dc335e1d106?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGZyZXNoJTIwc2FsYWR8ZW58MXx8fHwxNzYwMDY1OTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    chef: "Chef James Ochieng",
    title: "Fresh Mediterranean Bowl",
    cuisine: "Mediterranean",
    rating: 4.8,
    reviews: 93,
    price: "$45",
    location: "Westlands"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGRpc2h8ZW58MXx8fHwxNzYwMDU0NjA2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    chef: "Chef Sofia Rossi",
    title: "Handmade Pasta Creation",
    cuisine: "Italian",
    rating: 5.0,
    reviews: 201,
    price: "$65",
    location: "Karen",
    trending: true
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1700482006355-ad309eff83ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0JTIwcGxhdGVkfGVufDF8fHx8MTc2MDA2NTk0NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    chef: "Chef Aisha Kamau",
    title: "Artisan Dessert Collection",
    cuisine: "Pastry",
    rating: 4.9,
    reviews: 156,
    price: "$35",
    location: "Kilimani"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1693422660544-014dd9f3ef73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwbWVhdCUyMHZlZ2V0YWJsZXN8ZW58MXx8fHwxNzYwMDY1OTQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    chef: "Chef David Mwangi",
    title: "Grilled Meat & Vegetables",
    cuisine: "BBQ",
    rating: 4.7,
    reviews: 88,
    price: "$75",
    location: "Lavington"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1645292821217-fb77e7fa7269?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGN1aXNpbmUlMjBib3dsfGVufDF8fHx8MTc2MDA2NTk0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    chef: "Chef Kenji Tanaka",
    title: "Asian Fusion Bowl",
    cuisine: "Asian",
    rating: 4.8,
    reviews: 112,
    price: "$55",
    location: "Parklands",
    trending: true
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1687877465634-a7599027966c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVha2Zhc3QlMjBicnVuY2glMjBwbGF0ZXxlbnwxfHx8fDE3NjAwNjU5NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    chef: "Chef Emma Thompson",
    title: "Gourmet Brunch Selection",
    cuisine: "Breakfast",
    rating: 4.9,
    reviews: 145,
    price: "$40",
    location: "Runda"
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1622021142947-da7dedc7c39a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMGtpdGNoZW58ZW58MXx8fHwxNzU5OTkzNzM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    chef: "Chef Marcus Lee",
    title: "Live Cooking Experience",
    cuisine: "Interactive",
    rating: 5.0,
    reviews: 178,
    price: "$120",
    location: "Muthaiga"
  }
];

export function DiscoveryGrid() {
  const [dishes, setDishes] = useState(initialDishes);
  const [isMounted, setIsMounted] = useState(false);

  // Only run on client to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch more dishes for infinite scroll
  const fetchMoreDishes = useCallback(async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const startId = dishes.length + 1;
    const cuisines = ["French", "Mediterranean", "Italian", "Pastry", "BBQ", "Asian", "Breakfast", "Interactive"];
    const locations = ["Nairobi", "Westlands", "Karen", "Kilimani", "Lavington", "Parklands", "Runda", "Muthaiga"];
    const ratings = [4.5, 4.6, 4.7, 4.8, 4.9, 5.0];
    const reviewCounts = [50, 75, 100, 125, 150, 175, 200];
    const prices = [30, 40, 50, 60, 70, 80, 90, 100];
    
    const newDishes = Array.from({ length: 8 }, (_, i) => ({
      id: startId + i,
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1080&q=80",
      chef: `Chef ${['Anna', 'Carlos', 'Yuki', 'Fatima', 'Luis'][i % 5]} ${['Smith', 'Garcia', 'Chen', 'Ahmed', 'Silva'][i % 5]}`,
      title: `Signature Dish ${startId + i}`,
      cuisine: cuisines[i % cuisines.length],
      rating: ratings[i % ratings.length],
      reviews: reviewCounts[i % reviewCounts.length],
      price: `$${prices[i % prices.length]}`,
      location: locations[i % locations.length],
      trending: i % 3 === 0,
    }));
    
    setDishes(prev => [...prev, ...newDishes]);
    return newDishes;
  }, [dishes.length]);

  const { observerTarget, isLoading, hasMore } = useInfiniteScroll(fetchMoreDishes);

  if (!isMounted) {
    return null; // Return null on server to avoid hydration mismatch
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm mb-4">
            <TrendingUp className="w-4 h-4" />
            <span>AI-Powered Recommendations</span>
          </div>
          <h2 className="text-3xl md:text-4xl mb-4">
            Discover Amazing Dishes
          </h2>
          <p className="text-muted-foreground">
            Browse our curated selection of chefs and their signature dishes. 
            Book in just 3 taps.
          </p>
        </div>

        {/* Pinterest-Style Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dishes.map((dish) => (
            <div
              key={dish.id}
              className="group relative bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-border"
            >
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <ImageWithFallback
                  src={dish.image}
                  alt={dish.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-sm opacity-90">{dish.chef}</p>
                  </div>
                </div>
                {/* Trending Badge */}
                {dish.trending && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-accent text-accent-foreground border-0">
                      🔥 Trending
                    </Badge>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="line-clamp-1 mb-1">{dish.title}</h3>
                  <Badge variant="outline" className="text-xs">
                    {dish.cuisine}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-primary">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{dish.rating}</span>
                    <span className="text-muted-foreground">({dish.reviews})</span>
                  </div>
                  <span className="text-foreground">{dish.price}</span>
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>{dish.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Infinite Scroll Trigger */}
        <div ref={observerTarget} className="flex justify-center py-8">
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading more dishes...</span>
            </div>
          )}
          {!hasMore && !isLoading && dishes.length > 8 && (
            <p className="text-muted-foreground">You've seen all the dishes!</p>
          )}
        </div>
      </div>
    </section>
  );
}
