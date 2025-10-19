"use client";

import { Button } from "./ui/button";
import { ChefHat, Users } from "lucide-react";

interface HeroProps {
  onFindChef?: () => void;
  onBecomeChef?: () => void;
}

export function Hero({ onFindChef, onBecomeChef }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ChefHat className="w-8 h-8 text-primary" />
          <span className="text-xl font-semibold">Foodie</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost">Sign In</Button>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full border border-secondary/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
            </span>
            <span className="text-sm">Now connecting chefs with food lovers</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl">
            Discover Your Perfect
            <span className="block text-primary mt-2">Personal Chef</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with talented freelance chefs for personalized home dining, 
            events, and unforgettable culinary experiences.
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button 
              size="lg" 
              className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90 text-lg px-8 py-6"
              onClick={onFindChef}
            >
              <Users className="w-5 h-5" />
              Find a Chef
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto gap-2 border-2 border-secondary text-secondary hover:bg-secondary hover:text-white text-lg px-8 py-6"
              onClick={onBecomeChef}
            >
              <ChefHat className="w-5 h-5" />
              Become a Chef
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-wrap items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
            <div className="flex flex-col items-center">
              <span className="text-2xl text-foreground">1,000+</span>
              <span>Active Users</span>
            </div>
            <div className="h-8 w-px bg-border"></div>
            <div className="flex flex-col items-center">
              <span className="text-2xl text-foreground">100+</span>
              <span>Verified Chefs</span>
            </div>
            <div className="h-8 w-px bg-border"></div>
            <div className="flex flex-col items-center">
              <span className="text-2xl text-foreground">4.8★</span>
              <span>Avg Rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl"></div>
    </section>
  );
}
