import { Shield, Award, Users, TrendingUp } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const stats = [
  {
    icon: Users,
    value: "1,000+",
    label: "Active Users",
    description: "Busy professionals and families trust Foodie",
    color: "text-primary"
  },
  {
    icon: Award,
    value: "100+",
    label: "Verified Chefs",
    description: "Background-checked culinary professionals",
    color: "text-secondary"
  },
  {
    icon: TrendingUp,
    value: "$10K+",
    label: "Monthly Bookings",
    description: "Supporting local chefs and food communities",
    color: "text-accent"
  },
  {
    icon: Shield,
    value: "4.8★",
    label: "Average Rating",
    description: "Consistently exceptional experiences",
    color: "text-primary"
  }
];

const testimonials = [
  {
    name: "Sarah K.",
    role: "Busy Professional",
    content: "Foodie has been a game-changer for my family. We get restaurant-quality meals at home without the hassle!",
    rating: 5
  },
  {
    name: "Chef David M.",
    role: "Freelance Chef",
    content: "This platform gave me the flexibility I needed. I'm fully booked and earning more than ever.",
    rating: 5
  },
  {
    name: "Linda O.",
    role: "Event Organizer",
    content: "Organized a chama dinner for 20 people. The chef was amazing and the booking process was so easy!",
    rating: 5
  }
];

export function TrustIndicators() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4">
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center">
                <div className={`inline-flex p-4 rounded-full bg-primary/10 mb-4 ${stat.color}`}>
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-3xl mb-1">{stat.value}</div>
                <div className="text-sm mb-2">{stat.label}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">
              Loved by Clients & Chefs
            </h2>
            <p className="text-muted-foreground text-lg">
              Real stories from our community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-primary">★</span>
                    ))}
                  </div>
                  <p className="text-sm mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
