'use client';

import { useState } from "react";
import { useAuth } from "@/lib/context/auth";
import { Hero } from "@/components/Hero";
import { DiscoveryGrid } from "@/components/DiscoveryGrid";
import { HowItWorks } from "@/components/HowItWorks";
import { TrustIndicators } from "@/components/TrustIndicators";
import { Footer } from "@/components/Footer";
import { AuthDialog } from "@/components/AuthDialog";
import PersonalizedFeed from "@/components/PersonalizedFeed";
import { toast } from "sonner";

export default function HomePage() {
  const { user, loading } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authRole, setAuthRole] = useState<'client' | 'chef'>('client');

  const openAuthDialog = (role: 'client' | 'chef') => {
    setAuthRole(role);
    setAuthDialogOpen(true);
  };

  const handleAuthSuccess = (userData: any) => {
    setAuthDialogOpen(false);
    // User state will be updated via useAuth hook
  };

  const handleSkipAuth = () => {
    setAuthDialogOpen(false);
    toast.success('Browse freely! Sign up anytime to book a chef.', {
      duration: 4000,
    });
    // Scroll to discovery section to show content is accessible
    setTimeout(() => {
      const discoverySection = document.querySelector('#discovery-section');
      if (discoverySection) {
        discoverySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  };

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show personalized feed for logged in users
  if (user) {
    return (
      <div className="space-y-12">
        <section className="rounded-2xl bg-gradient-to-r from-primary/5 via-background to-secondary/5 p-8 md:p-12">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold md:text-5xl">
              Welcome back, <span className="text-primary">{user.name || 'Chef Lover'}!</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Your personalized chef recommendations are ready
            </p>
          </div>
        </section>

        <PersonalizedFeed />
      </div>
    );
  }

  // Landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-background">
      <Hero 
        onFindChef={() => openAuthDialog('client')} 
        onBecomeChef={() => openAuthDialog('chef')} 
      />
      <div id="discovery-section">
        <DiscoveryGrid />
      </div>
      <HowItWorks />
      <TrustIndicators />
      <Footer />
      
      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        defaultRole={authRole}
        onSuccess={handleAuthSuccess}
        onSkip={handleSkipAuth}
      />
    </div>
  );
}
