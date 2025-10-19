'use client';

import { Suspense, useState } from 'react';
import ChefCard from "@/components/ChefCard";
import AdvancedSearch from "@/components/AdvancedSearch";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useSearchParams } from 'next/navigation';

export default function DiscoverPage() {
  const [showFilters, setShowFilters] = useState(false);
  const searchParams = useSearchParams();

  // Mock data - in a real app, this would come from your backend with proper filtering
  const chefs = Array.from({ length: 18 }, (_, i) => ({
    id: i + 1,
    name: `Chef ${i + 1}`,
    specialties: ["Italian", "Japanese", "French", "Mexican"][i % 4],
    rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
    priceRange: Math.floor(Math.random() * 300) + 200, // $200-$500
    dietaryOptions: ["Vegetarian", "Vegan", "Gluten-Free"][i % 3],
    img: `https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1200&auto=format&fit=crop`,
  }));

  // Filter chefs based on search params
  const filteredChefs = chefs.filter(chef => {
    const cuisine = searchParams.get('cuisine')?.split(',');
    const priceRange = searchParams.get('price')?.split(',').map(Number);
    const rating = Number(searchParams.get('rating'));
    const dietary = searchParams.get('dietary')?.split(',');

    if (cuisine?.length && !cuisine.includes(chef.specialties)) {
      return false;
    }

    if (priceRange && (chef.priceRange < priceRange[0] || chef.priceRange > priceRange[1])) {
      return false;
    }

    if (rating && chef.rating < rating) {
      return false;
    }

    if (dietary?.length && !dietary.includes(chef.dietaryOptions)) {
      return false;
    }

    return true;
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Discover Amazing Chefs</h1>
          <Button onClick={() => setShowFilters(true)}>
            Filter Results
          </Button>
        </div>

        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {filteredChefs.map((chef) => (
            <ChefCard
              key={chef.id}
              id={chef.id}
              name={chef.name}
              specialties={chef.specialties}
              img={chef.img}
            />
          ))}
        </div>

        {/* Infinite Scroll Trigger */}
        <div ref={observerTarget} className="flex justify-center py-8">
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading more chefs...</span>
            </div>
          )}
          {!hasMore && !isLoading && filteredChefs.length > 18 && (
            <p className="text-muted-foreground">No more chefs to load</p>
          )}
        </div>

        <Modal
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          title="Advanced Search"
        >
          <AdvancedSearch />
        </Modal>
      </div>
    </Suspense>
  );
}
