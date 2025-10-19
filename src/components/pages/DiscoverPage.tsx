import { useState } from "react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Slider } from "../ui/slider";
import { Star, MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import { ChefProfileDialog } from "../ChefProfileDialog";
import { AIChatbot } from "../AIChatbot";

const allDishes = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800",
    chefId: "chef-1",
    chef: "Chef Wanjiku Kamau",
    title: "Traditional Pilau & Kuku",
    cuisine: "Kenyan",
    rating: 4.9,
    reviews: 234,
    price: 35,
    location: "Nairobi"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800",
    chefId: "chef-2",
    chef: "Chef David Mwangi",
    title: "Premium Nyama Choma",
    cuisine: "Nyama Choma",
    rating: 5.0,
    reviews: 312,
    price: 55,
    location: "Karen"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800",
    chefId: "chef-3",
    chef: "Chef James Ochieng",
    title: "Ugali, Beef Stew & Sukuma",
    cuisine: "Kenyan",
    rating: 4.9,
    reviews: 198,
    price: 28,
    location: "Westlands"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800",
    chefId: "chef-4",
    chef: "Chef Amina Hassan",
    title: "Swahili Coastal Platter",
    cuisine: "Swahili Coast",
    rating: 4.9,
    reviews: 187,
    price: 48,
    location: "Parklands"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800",
    chefId: "chef-5",
    chef: "Chef Fatuma Ahmed",
    title: "Aromatic Biryani & Samosas",
    cuisine: "Pilau & Biryani",
    rating: 4.8,
    reviews: 156,
    price: 38,
    location: "Eastleigh"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=800",
    chefId: "chef-6",
    chef: "Chef Peter Kariuki",
    title: "Mukimo & Mbuzi Fry",
    cuisine: "Kenyan",
    rating: 4.8,
    reviews: 143,
    price: 32,
    location: "Kileleshwa"
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800",
    chefId: "chef-7",
    chef: "Chef Sofia Rossi",
    title: "Handmade Pasta Creation",
    cuisine: "Italian",
    rating: 5.0,
    reviews: 201,
    price: 65,
    location: "Lavington"
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800",
    chefId: "chef-8",
    chef: "Chef Grace Njeri",
    title: "Githeri & Maharagwe Special",
    cuisine: "Kenyan",
    rating: 4.7,
    reviews: 124,
    price: 25,
    location: "Donholm"
  },
  {
    id: 9,
    image: "https://images.unsplash.com/photo-1593560704563-f176a2eb61db?w=800",
    chefId: "chef-9",
    chef: "Chef Ali Mohammed",
    title: "Zanzibar Coconut Curry",
    cuisine: "Swahili Coast",
    rating: 4.9,
    reviews: 165,
    price: 42,
    location: "South C"
  },
  {
    id: 10,
    image: "https://images.unsplash.com/photo-1645292821217-fb77e7fa7269?w=800",
    chefId: "chef-10",
    chef: "Chef Kenji Tanaka",
    title: "Asian Fusion Bowl",
    cuisine: "Asian",
    rating: 4.8,
    reviews: 112,
    price: 55,
    location: "Kilimani"
  },
  {
    id: 11,
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800",
    chefId: "chef-11",
    chef: "Chef Mary Wambui",
    title: "Matoke & Fish Stew",
    cuisine: "East African",
    rating: 4.8,
    reviews: 134,
    price: 30,
    location: "Rongai"
  },
  {
    id: 12,
    image: "https://images.unsplash.com/photo-1700482006355-ad309eff83ed?w=800",
    chefId: "chef-12",
    chef: "Chef Aisha Kamau",
    title: "Mandazi & Mahamri Treats",
    cuisine: "Swahili Coast",
    rating: 4.9,
    reviews: 156,
    price: 20,
    location: "Kilimani"
  }
];

export function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChef, setSelectedChef] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    cuisine: "all",
    priceRange: [0, 200],
    rating: "all",
    location: "all"
  });

  const cuisines = ["All", ...new Set(allDishes.map(d => d.cuisine))];
  const locations = ["All", ...new Set(allDishes.map(d => d.location))];

  const filteredDishes = allDishes.filter(dish => {
    const matchesSearch = dish.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dish.chef.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dish.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCuisine = filters.cuisine === "all" || dish.cuisine === filters.cuisine;
    const matchesPrice = dish.price >= filters.priceRange[0] && dish.price <= filters.priceRange[1];
    const matchesRating = filters.rating === "all" || dish.rating >= parseFloat(filters.rating);
    const matchesLocation = filters.location === "all" || dish.location === filters.location;

    return matchesSearch && matchesCuisine && matchesPrice && matchesRating && matchesLocation;
  });

  const resetFilters = () => {
    setFilters({
      cuisine: "all",
      priceRange: [0, 200],
      rating: "all",
      location: "all"
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <AIChatbot />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl mb-2">Discover Chefs</h1>
          <p className="text-muted-foreground">
            Browse {allDishes.length} amazing dishes from talented chefs
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search dishes, chefs, or cuisines..."
                className="pl-12 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {(filters.cuisine !== "all" || filters.rating !== "all" || filters.location !== "all") && (
                <Badge variant="secondary" className="ml-1">
                  Active
                </Badge>
              )}
            </Button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg">Filters</h3>
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    <X className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Cuisine Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cuisine</label>
                    <Select value={filters.cuisine} onValueChange={(v) => setFilters({ ...filters, cuisine: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {cuisines.map((cuisine) => (
                          <SelectItem key={cuisine} value={cuisine.toLowerCase()}>
                            {cuisine}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <Select value={filters.location} onValueChange={(v) => setFilters({ ...filters, location: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location.toLowerCase()}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Rating Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Minimum Rating</label>
                    <Select value={filters.rating} onValueChange={(v) => setFilters({ ...filters, rating: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Ratings</SelectItem>
                        <SelectItem value="4.5">4.5+ Stars</SelectItem>
                        <SelectItem value="4.7">4.7+ Stars</SelectItem>
                        <SelectItem value="4.9">4.9+ Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                    </label>
                    <Slider
                      value={filters.priceRange}
                      onValueChange={(v) => setFilters({ ...filters, priceRange: v })}
                      min={0}
                      max={200}
                      step={5}
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredDishes.length} of {allDishes.length} results
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDishes.map((dish) => (
            <Card
              key={dish.id}
              className="group cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary/50 overflow-hidden"
              onClick={() => setSelectedChef(dish.chefId)}
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <ImageWithFallback
                  src={dish.image}
                  alt={dish.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
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
                    <span className="text-muted-foreground">({dish.reviews})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {dish.location}
                  </span>
                  <span>${dish.price}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDishes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No results found</p>
            <Button variant="outline" onClick={resetFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Chef Profile Dialog */}
      {selectedChef && (
        <ChefProfileDialog
          chefId={selectedChef}
          open={!!selectedChef}
          onOpenChange={(open) => !open && setSelectedChef(null)}
        />
      )}
    </div>
  );
}
