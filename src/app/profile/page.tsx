"use client";

import { useAuth } from "@/lib/context/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Phone, MapPin, Edit, Save, Star } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, loading, profile } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
    if (user && profile) {
      setFormData({
        name: profile.name || '',
        email: user.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        bio: profile.bio || '',
      });
    }
  }, [user, loading, router, profile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  const handleSave = () => {
    // Save profile logic here
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl">My Profile</h1>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
            <Edit className="w-4 h-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={() => setIsEditing(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile Info</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-semibold">
                {formData.name.charAt(0) || 'U'}
              </div>
              <div>
                <h2 className="text-2xl font-semibold">{formData.name || 'User'}</h2>
                <p className="text-muted-foreground">{formData.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  disabled={!isEditing}
                  className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="bookings">
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Booking History</h3>
            <div className="space-y-4">
              <div className="border rounded-lg p-4 flex items-start justify-between">
                <div>
                  <p className="font-medium">Italian Dinner with Chef Maria</p>
                  <p className="text-sm text-muted-foreground">Dec 25, 2024 • 4 guests</p>
                  <div className="flex items-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <span className="text-sm bg-green-500/10 text-green-700 px-3 py-1 rounded-full">
                  Completed
                </span>
              </div>

              <div className="border rounded-lg p-4 flex items-start justify-between">
                <div>
                  <p className="font-medium">Japanese Omakase with Chef Kenji</p>
                  <p className="text-sm text-muted-foreground">Dec 28, 2024 • 2 guests</p>
                </div>
                <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                  Upcoming
                </span>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="favorites">
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Favorite Chefs</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    MR
                  </div>
                  <div>
                    <p className="font-medium">Chef Maria Rodriguez</p>
                    <p className="text-sm text-muted-foreground">Italian Cuisine</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">4.9</span>
                  <span className="text-sm text-muted-foreground">(127 reviews)</span>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    JO
                  </div>
                  <div>
                    <p className="font-medium">Chef James Ochieng</p>
                    <p className="text-sm text-muted-foreground">Mediterranean</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">4.8</span>
                  <span className="text-sm text-muted-foreground">(93 reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
