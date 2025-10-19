"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, CheckCircle, Upload } from "lucide-react";

export default function ChefOnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Professional Info
    businessName: "",
    yearsOfExperience: "",
    specialties: [] as string[],
    
    // Step 2: Services & Pricing
    serviceTypes: [] as string[],
    priceRange: "",
    maxGuests: "",
    
    // Step 3: Location & Availability
    serviceLocations: [] as string[],
    availability: [] as string[],
    
    // Step 4: Portfolio & Documents
    bio: "",
    certifications: [] as string[],
  });

  const specialtyOptions = ["Italian", "Japanese", "French", "Mexican", "Indian", "Thai", "Mediterranean", "Chinese", "Fusion", "Vegan"];
  const serviceOptions = ["Private Dinners", "Meal Prep", "Cooking Classes", "Corporate Events", "Wedding Catering", "Dietary Consultations"];
  const locationOptions = ["Nairobi CBD", "Westlands", "Karen", "Kilimani", "Lavington", "Gigiri"];
  const availabilityOptions = ["Weekday Evenings", "Weekends", "Weekday Lunch", "Early Morning", "Late Night", "Flexible"];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    toast.success("Welcome to ChefConnect! Your chef profile is being reviewed.");
    router.push('/dashboard');
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
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`flex items-center ${step < 5 ? 'flex-1' : ''}`}
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
                {step < 5 && (
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
            <span>Professional</span>
            <span>Services</span>
            <span>Location</span>
            <span>Portfolio</span>
            <span>Complete</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-card rounded-lg p-8 shadow-lg">
          {/* Step 1: Professional Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Tell us about your expertise</h2>
                <p className="text-muted-foreground">Share your culinary background</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="businessName">Business/Chef Name *</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="Chef Maria's Kitchen"
                  />
                </div>

                <div>
                  <Label htmlFor="experience">Years of Experience *</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={formData.yearsOfExperience}
                    onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                    placeholder="5"
                  />
                </div>

                <div>
                  <Label>Specialties *</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {specialtyOptions.map((specialty) => (
                      <Button
                        key={specialty}
                        type="button"
                        variant={formData.specialties.includes(specialty) ? "default" : "outline"}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            specialties: toggleArrayItem(formData.specialties, specialty),
                          })
                        }
                        size="sm"
                      >
                        {specialty}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Services & Pricing */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">What services do you offer?</h2>
                <p className="text-muted-foreground">Define your offerings</p>
              </div>

              <div>
                <Label>Service Types *</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {serviceOptions.map((service) => (
                    <Button
                      key={service}
                      type="button"
                      variant={formData.serviceTypes.includes(service) ? "default" : "outline"}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          serviceTypes: toggleArrayItem(formData.serviceTypes, service),
                        })
                      }
                      size="sm"
                    >
                      {service}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="priceRange">Price Range (per person) *</Label>
                  <Input
                    id="priceRange"
                    value={formData.priceRange}
                    onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                    placeholder="$50 - $150"
                  />
                </div>

                <div>
                  <Label htmlFor="maxGuests">Maximum Guests *</Label>
                  <Input
                    id="maxGuests"
                    type="number"
                    value={formData.maxGuests}
                    onChange={(e) => setFormData({ ...formData, maxGuests: e.target.value })}
                    placeholder="20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Location & Availability */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Where and when can you cook?</h2>
                <p className="text-muted-foreground">Set your service areas and availability</p>
              </div>

              <div>
                <Label>Service Locations *</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {locationOptions.map((location) => (
                    <Button
                      key={location}
                      type="button"
                      variant={formData.serviceLocations.includes(location) ? "default" : "outline"}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          serviceLocations: toggleArrayItem(formData.serviceLocations, location),
                        })
                      }
                      size="sm"
                    >
                      {location}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Availability *</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availabilityOptions.map((time) => (
                    <Button
                      key={time}
                      type="button"
                      variant={formData.availability.includes(time) ? "default" : "outline"}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          availability: toggleArrayItem(formData.availability, time),
                        })
                      }
                      size="sm"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Portfolio & Documents */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Showcase your work</h2>
                <p className="text-muted-foreground">Add your bio and certifications</p>
              </div>

              <div>
                <Label htmlFor="bio">Professional Bio *</Label>
                <textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full min-h-[120px] p-3 rounded-md border border-input bg-background"
                  placeholder="Tell clients about your culinary journey, training, and what makes your cooking special..."
                />
              </div>

              <div>
                <Label>Certifications & Photos</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 cursor-pointer transition-colors">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload food photos, certificates, or credentials
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    JPG, PNG up to 10MB
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Complete */}
          {currentStep === 5 && (
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-12 h-12 text-primary" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-2">Profile Under Review</h2>
                <p className="text-muted-foreground">
                  We'll verify your information and activate your profile within 24 hours.
                </p>
              </div>

              <div className="bg-muted rounded-lg p-4 text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Business Name:</span>
                  <span className="font-medium">{formData.businessName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Experience:</span>
                  <span className="font-medium">{formData.yearsOfExperience} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Specialties:</span>
                  <span className="font-medium">{formData.specialties.length} selected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Types:</span>
                  <span className="font-medium">{formData.serviceTypes.length} selected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max Guests:</span>
                  <span className="font-medium">{formData.maxGuests || 'N/A'}</span>
                </div>
              </div>

              <div className="bg-primary/10 text-primary rounded-lg p-4 text-sm">
                <p className="font-medium mb-1">What's next?</p>
                <ul className="text-left space-y-1">
                  <li>• We'll review your profile and documents</li>
                  <li>• You'll receive an email when approved</li>
                  <li>• Set up your menu and pricing</li>
                  <li>• Start accepting bookings!</li>
                </ul>
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
              {currentStep === 5 ? 'Go to Dashboard' : 'Next'}
              {currentStep !== 5 && <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
