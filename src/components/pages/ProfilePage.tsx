import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import { 
  User, Mail, MapPin, DollarSign, Star, Award, 
  Edit, Save, X, Plus, Camera, Shield
} from "lucide-react";
import { apiCall } from "../../utils/supabase/client";
import { toast } from "sonner";
import { AIChatbot } from "../AIChatbot";

interface ProfilePageProps {
  user: any;
}

export function ProfilePage({ user }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [editedProfile, setEditedProfile] = useState<any>({});
  const [newSpecialty, setNewSpecialty] = useState("");

  const isChef = user.role === 'chef';

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      if (isChef) {
        const response = await apiCall(`/chefs/${user.id}`);
        setProfile(response.chef);
        setEditedProfile(response.chef);
      } else {
        const response = await apiCall(`/client/${user.id}`);
        setProfile(response.client || {});
        setEditedProfile(response.client || {});
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const endpoint = isChef ? `/chefs/${user.id}` : `/client/${user.id}`;
      await apiCall(endpoint, {
        method: 'PUT',
        body: JSON.stringify(editedProfile)
      }, true);

      setProfile(editedProfile);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const addSpecialty = () => {
    if (newSpecialty.trim() && !editedProfile.specialties?.includes(newSpecialty.trim())) {
      setEditedProfile({
        ...editedProfile,
        specialties: [...(editedProfile.specialties || []), newSpecialty.trim()]
      });
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    setEditedProfile({
      ...editedProfile,
      specialties: editedProfile.specialties?.filter((s: string) => s !== specialty)
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <AIChatbot />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl mb-2">Profile</h1>
          <p className="text-muted-foreground">
            Manage your {isChef ? 'chef' : 'client'} profile and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarFallback className="bg-primary/10 text-primary text-3xl">
                      {user.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h2 className="text-2xl mb-1">{user.name}</h2>
                  <p className="text-sm text-muted-foreground mb-2">{user.email}</p>
                  <Badge className={isChef ? "bg-secondary" : "bg-primary"}>
                    {isChef ? 'Chef' : 'Client'}
                  </Badge>
                </div>

                {isChef && profile && (
                  <div className="w-full pt-4 border-t border-border space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-primary fill-current" />
                        <span className="font-semibold">{profile.rating || '4.9'}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Reviews</span>
                      <span className="font-semibold">{profile.reviewCount || '0'}</span>
                    </div>
                    {profile.verified && (
                      <div className="flex items-center justify-center gap-2 p-2 bg-secondary/10 rounded-lg">
                        <Shield className="w-4 h-4 text-secondary" />
                        <span className="text-sm text-secondary">Verified Chef</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  {isChef ? 'Chef Information' : 'Your Information'}
                </CardTitle>
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => {
                      setIsEditing(false);
                      setEditedProfile(profile);
                    }}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave} disabled={loading}>
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic">
                  <TabsList className="mb-6">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    {isChef && <TabsTrigger value="professional">Professional</TabsTrigger>}
                    <TabsTrigger value="preferences">Preferences</TabsTrigger>
                  </TabsList>

                  {/* Basic Info Tab */}
                  <TabsContent value="basic" className="space-y-6">
                    <div className="space-y-4">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={isEditing ? editedProfile.name || user.name : user.name}
                            onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={user.email}
                            disabled
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={isEditing ? editedProfile.location || '' : profile?.location || ''}
                            onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                            disabled={!isEditing}
                            placeholder="e.g., Nairobi, Kenya"
                          />
                        </div>

                        {isChef && (
                          <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                              id="bio"
                              value={isEditing ? editedProfile.bio || '' : profile?.bio || ''}
                              onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                              disabled={!isEditing}
                              rows={4}
                              placeholder="Tell clients about your culinary journey..."
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Professional Tab (Chef Only) */}
                  {isChef && (
                    <TabsContent value="professional" className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="rate">Hourly Rate ($)</Label>
                          <Input
                            id="rate"
                            type="number"
                            value={isEditing ? editedProfile.pricing?.hourly || '' : profile?.pricing?.hourly || ''}
                            onChange={(e) => setEditedProfile({ 
                              ...editedProfile, 
                              pricing: { ...editedProfile.pricing, hourly: e.target.value }
                            })}
                            disabled={!isEditing}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Specialties</Label>
                          {isEditing && (
                            <div className="flex gap-2 mb-2">
                              <Input
                                placeholder="Add specialty"
                                value={newSpecialty}
                                onChange={(e) => setNewSpecialty(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addSpecialty()}
                              />
                              <Button type="button" onClick={addSpecialty}>
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                          <div className="flex flex-wrap gap-2">
                            {(isEditing ? editedProfile.specialties : profile?.specialties)?.map((specialty: string) => (
                              <Badge key={specialty} variant="secondary" className="gap-1">
                                {specialty}
                                {isEditing && (
                                  <button
                                    onClick={() => removeSpecialty(specialty)}
                                    className="ml-1 hover:text-destructive"
                                  >
                                    ×
                                  </button>
                                )}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold flex items-center gap-2">
                            <Award className="w-4 h-4 text-primary" />
                            Achievements
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {profile?.badges?.map((badge: string) => (
                              <Badge key={badge} className="bg-accent text-accent-foreground">
                                {badge}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  )}

                  {/* Preferences Tab */}
                  <TabsContent value="preferences" className="space-y-6">
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {isChef 
                          ? 'Set your availability and notification preferences'
                          : 'Customize your food discovery and notification preferences'
                        }
                      </p>
                      
                      <div className="space-y-4 pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-muted-foreground">
                              Receive booking updates via email
                            </p>
                          </div>
                          <input type="checkbox" defaultChecked className="w-4 h-4" />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">SMS Reminders</p>
                            <p className="text-sm text-muted-foreground">
                              Get reminders 24h before bookings
                            </p>
                          </div>
                          <input type="checkbox" defaultChecked className="w-4 h-4" />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Marketing Communications</p>
                            <p className="text-sm text-muted-foreground">
                              Receive tips, recipes, and special offers
                            </p>
                          </div>
                          <input type="checkbox" className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
