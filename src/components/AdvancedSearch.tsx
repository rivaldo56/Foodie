import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter, useSearchParams } from 'next/navigation';

interface SearchFilters {
  cuisine?: string[];
  priceRange?: [number, number];
  rating?: number;
  dietary?: string[];
  availability?: string;
  location?: string;
}

const CUISINES = [
  'Italian',
  'Japanese',
  'Indian',
  'French',
  'Mexican',
  'Thai',
  'Mediterranean',
  'Chinese',
  'American',
  'Fusion',
];

const DIETARY = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Kosher',
  'Halal',
  'Paleo',
  'Keto',
];

export default function AdvancedSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState<SearchFilters>({
    cuisine: searchParams.get('cuisine')?.split(',') || [],
    priceRange: searchParams.get('price')?.split(',').map(Number) as [number, number] || [0, 500],
    rating: Number(searchParams.get('rating')) || 0,
    dietary: searchParams.get('dietary')?.split(',') || [],
    availability: searchParams.get('date') || '',
    location: searchParams.get('location') || '',
  });

  const handleCuisineToggle = (cuisine: string) => {
    setFilters((prev) => ({
      ...prev,
      cuisine: prev.cuisine?.includes(cuisine)
        ? prev.cuisine.filter((c) => c !== cuisine)
        : [...(prev.cuisine || []), cuisine],
    }));
  };

  const handleDietaryToggle = (diet: string) => {
    setFilters((prev) => ({
      ...prev,
      dietary: prev.dietary?.includes(diet)
        ? prev.dietary.filter((d) => d !== diet)
        : [...(prev.dietary || []), diet],
    }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    
    if (filters.cuisine?.length) {
      params.set('cuisine', filters.cuisine.join(','));
    }
    
    if (filters.priceRange) {
      params.set('price', filters.priceRange.join(','));
    }
    
    if (filters.rating) {
      params.set('rating', filters.rating.toString());
    }
    
    if (filters.dietary?.length) {
      params.set('dietary', filters.dietary.join(','));
    }
    
    if (filters.availability) {
      params.set('date', filters.availability);
    }
    
    if (filters.location) {
      params.set('location', filters.location);
    }

    router.push(`/discover?${params.toString()}`);
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="mb-2 font-medium">Cuisine Types</h3>
          <div className="flex flex-wrap gap-2">
            {CUISINES.map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => handleCuisineToggle(cuisine)}
                className={`rounded-full px-3 py-1 text-sm ${
                  filters.cuisine?.includes(cuisine)
                    ? 'bg-black text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-2 font-medium">Price Range</h3>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="0"
              max="500"
              step="10"
              value={filters.priceRange?.[1] ?? 500}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  priceRange: [prev.priceRange?.[0] ?? 0, Number(e.target.value)],
                }))
              }
              className="w-full"
            />
            <span className="min-w-[80px] text-sm">
              ${filters.priceRange?.[0]}-${filters.priceRange?.[1]}
            </span>
          </div>
        </div>

        <div>
          <h3 className="mb-2 font-medium">Minimum Rating</h3>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => setFilters((prev) => ({ ...prev, rating }))}
                className={`text-2xl ${
                  (filters.rating ?? 0) >= rating
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-2 font-medium">Dietary Requirements</h3>
          <div className="flex flex-wrap gap-2">
            {DIETARY.map((diet) => (
              <button
                key={diet}
                onClick={() => handleDietaryToggle(diet)}
                className={`rounded-full px-3 py-1 text-sm ${
                  filters.dietary?.includes(diet)
                    ? 'bg-black text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {diet}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-2 font-medium">Availability</h3>
          <input
            type="date"
            value={filters.availability}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, availability: e.target.value }))
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <h3 className="mb-2 font-medium">Location</h3>
          <input
            type="text"
            value={filters.location}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, location: e.target.value }))
            }
            placeholder="Enter city or postal code"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <Button onClick={applyFilters} fullWidth>
          Apply Filters
        </Button>
      </div>
    </Card>
  );
}