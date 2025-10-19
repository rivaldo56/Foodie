'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/auth';
import ChefCard from './ChefCard';
import DishCard from './DishCard';
import { Button } from './ui/button';
import toast from 'react-hot-toast';

interface Chef {
  id: string;
  name: string;
  image_url: string;
  specialties: string[];
  rating: number;
  price_range: { min: number; max: number };
}

interface Dish {
  id: string;
  name: string;
  image_url: string;
  price: number;
  cuisine_type: string[];
  chef: { name: string; image_url: string };
}

interface FeedItem {
  type: 'chef' | 'dish';
  data: Chef | Dish;
  score: number;
}

export default function PersonalizedFeed() {
  const { user } = useAuth();
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      loadRecommendations();
    }
  }, [user]);

  const loadRecommendations = async () => {
    try {
      const response = await fetch('/api/recommendations?limit=12');
      
      if (!response.ok) {
        throw new Error('Failed to load recommendations');
      }

      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
      toast.error('Failed to load personalized feed');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadRecommendations();
  };

  if (!user) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        <div className="mb-4 text-4xl">🔒</div>
        <h3 className="mb-2 text-lg font-semibold">Sign in for personalized recommendations</h3>
        <p className="text-gray-600">
          Get AI-powered chef and dish suggestions based on your taste preferences.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-8 w-64 animate-pulse rounded bg-gray-200"></div>
          <div className="h-10 w-32 animate-pulse rounded bg-gray-200"></div>
        </div>
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="mb-4 break-inside-avoid rounded-lg bg-gray-100 animate-pulse"
            >
              <div className="h-56 w-full"></div>
              <div className="p-3 space-y-2">
                <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Recommended for You</h2>
          <p className="text-sm text-gray-600">
            AI-powered suggestions based on your preferences
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
        >
          {refreshing ? (
            <>
              <svg
                className="mr-2 h-4 w-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Refreshing...
            </>
          ) : (
            <>
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </>
          )}
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border bg-white p-12 text-center">
          <div className="mb-4 text-5xl">🎯</div>
          <h3 className="mb-2 text-lg font-semibold">
            Building your personalized feed
          </h3>
          <p className="text-gray-600">
            Explore some chefs and dishes to get personalized recommendations!
          </p>
        </div>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {items.map((item, index) => (
            <div key={`${item.type}-${item.data.id}-${index}`}>
              {item.type === 'chef' ? (
                <ChefCard
                  id={item.data.id}
                  name={(item.data as Chef).name}
                  specialties={(item.data as Chef).specialties.join(', ')}
                  img={(item.data as Chef).image_url}
                />
              ) : (
                <DishCard
                  id={item.data.id}
                  name={(item.data as Dish).name}
                  img={(item.data as Dish).image_url}
                  price={(item.data as Dish).price}
                  cuisineType={(item.data as Dish).cuisine_type}
                  chefName={(item.data as Dish).chef.name}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
