"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";

export default function ClientOnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    name: "",
    phone: "",
    location: "",
    
    // Step 2: Preferences
    cuisines: [] as string[],
    dietaryRestrictions: [] as string[],
    
    // Step 3: Event Details
    typicalGuestCount: "",
    budget: "",
    occasions: [] as string[],
  });

  const cuisineOptions = ["Italian", "Japanese", "French", "Mexican", "Indian", "Thai", "Mediterranean", "Chinese"];
  const dietaryOptions = ["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Halal", "Kosher", "Nut Allergies"];
  const occasionOptions = ["Romantic Dinner", "Family Gathering", "Birthday Party", "Corporate Event", "Cooking Class", "Meal Prep"];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    // Save onboarding data to backend
    toast.success("Welcome to ChefConnect! Your profile is ready.");
    router.push('/');
  };

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter((i) => i !== item)
      : [...array, item];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex items-center ${step < 4 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    step < currentStep
                      ? 'bg-primary text-primary-foreground'
                      : step === currentStep
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                </div>
                {step < 4 && (
                  <div
                    className={`h-1 flex-1 mx-2 rounded transition-colors ${
                      step < currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Personal Info</span>
            <span>Preferences</span>
            <span>Event Details</span>
            <span>Complete</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-card rounded-lg p-8 shadow-lg">
          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Let's get to know you</h2>
                <p className="text-muted-foreground">Tell us a bit about yourself</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+254 700 000 000"
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Nairobi, Kenya"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Preferences */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">What do you love to eat?</h2>
                <p className="text-muted-foreground">Select your favorite cuisines</p>
              </div>

              <div>
                <Label>Cuisine Preferences</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {cuisineOptions.map((cuisine) => (
                    <Button
                      key={cuisine}
                      type="button"
                      variant={formData.cuisines.includes(cuisine) ? "default" : "outline"}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          cuisines: toggleArrayItem(formData.cuisines, cuisine),
                        })
                      }
                    >
                      {cuisine}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Dietary Restrictions (Optional)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {dietaryOptions.map((option) => (
                    <Button
                      key={option}
                      type="button"
                      variant={formData.dietaryRestrictions.includes(option) ? "default" : "outline"}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          dietaryRestrictions: toggleArrayItem(formData.dietaryRestrictions, option),
                        })
                      }
                      size="sm"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Event Details */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Tell us about your events</h2>
                <p className="text-muted-foreground">This helps us recommend the perfect chefs</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="guestCount">Typical Number of Guests</Label>
                  <Input
                    id="guestCount"
                    type="number"
                    value={formData.typicalGuestCount}
                    onChange={(e) => setFormData({ ...formData, typicalGuestCount: e.target.value })}
                    placeholder="4"
                  />
                </div>

                <div>
                  <Label htmlFor="budget">Budget Range per Person</Label>
                  <Input
                    id="budget"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="$50 - $100"
                  />
                </div>

                <div>
                  <Label>Typical Occasions</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {occasionOptions.map((occasion) => (
                      <Button
                        key={occasion}
                        type="button"
                        variant={formData.occasions.includes(occasion) ? "default" : "outline"}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            occasions: toggleArrayItem(formData.occasions, occasion),
                          })
                        }
                        size="sm"
                      >
                        {occasion}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Complete */}
          {currentStep === 4 && (
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-12 h-12 text-primary" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-2">All set!</h2>
                <p className="text-muted-foreground">
                  Your profile is ready. Let's find you the perfect chef!
                </p>
              </div>

              <div className="bg-muted rounded-lg p-4 text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium">{formData.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Favorite Cuisines:</span>
                  <span className="font-medium">{formData.cuisines.length} selected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Typical Guests:</span>
                  <span className="font-medium">{formData.typicalGuestCount || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>

            <Button onClick={handleNext} className="gap-2">
              {currentStep === 4 ? 'Get Started' : 'Next'}
              {currentStep !== 4 && <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
