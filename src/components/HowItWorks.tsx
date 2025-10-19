import { Search, Calendar, CreditCard, Star, Upload, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";

const clientSteps = [
  {
    icon: Search,
    title: "Discover & Browse",
    description: "Explore AI-powered recommendations and browse our visual discovery grid to find the perfect chef for your needs.",
    color: "text-primary"
  },
  {
    icon: Calendar,
    title: "Book in 3 Taps",
    description: "Select your date, time, and preferences. Our smart calendar syncs with chef availability for instant booking.",
    color: "text-secondary"
  },
  {
    icon: CreditCard,
    title: "Secure Payment",
    description: "Pay safely through our platform with integrated payment processing and transparent pricing.",
    color: "text-accent"
  },
  {
    icon: Star,
    title: "Enjoy & Review",
    description: "Experience personalized home dining, then share your feedback to help others discover great chefs.",
    color: "text-primary"
  }
];

const chefSteps = [
  {
    icon: Upload,
    title: "Create Your Profile",
    description: "Sign up, showcase your specialties, set your pricing, and upload photos of your signature dishes with AI enhancement.",
    color: "text-primary"
  },
  {
    icon: Calendar,
    title: "Manage Bookings",
    description: "Use our dashboard to accept/decline requests, manage your calendar, and track your upcoming gigs.",
    color: "text-secondary"
  },
  {
    icon: MessageSquare,
    title: "Connect with Clients",
    description: "Chat directly with clients to customize menus, discuss dietary needs, and build lasting relationships.",
    color: "text-accent"
  },
  {
    icon: CreditCard,
    title: "Get Paid & Grow",
    description: "Track earnings in real-time, receive payments automatically, and build your reputation with reviews and badges.",
    color: "text-primary"
  }
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl mb-4">How Foodie Works</h2>
          <p className="text-muted-foreground text-lg">
            Whether you're looking for a chef or want to become one, 
            we've made the process simple and delightful.
          </p>
        </div>

        <Tabs defaultValue="client" className="max-w-5xl mx-auto">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
            <TabsTrigger value="client" className="text-base">
              For Clients
            </TabsTrigger>
            <TabsTrigger value="chef" className="text-base">
              For Chefs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="client" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              {clientSteps.map((step, index) => (
                <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg bg-primary/10 ${step.color}`}>
                        <step.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-semibold text-muted-foreground">
                            Step {index + 1}
                          </span>
                        </div>
                        <h3 className="mb-2">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="chef" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              {chefSteps.map((step, index) => (
                <Card key={index} className="border-2 hover:border-secondary/50 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg bg-secondary/10 ${step.color}`}>
                        <step.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-semibold text-muted-foreground">
                            Step {index + 1}
                          </span>
                        </div>
                        <h3 className="mb-2">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
