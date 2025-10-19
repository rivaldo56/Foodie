'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/auth';
import { AdminNavigation } from '@/components/AdminNavigation';
import { apiCall } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  ChefHat, 
  Calendar, 
  MessageSquare, 
  Settings, 
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  Ban,
  UserCheck,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

interface DashboardStats {
  totalUsers: number;
  totalChefs: number;
  pendingChefs: number;
  totalBookings: number;
  todayBookings: number;
  revenue: number;
  aiChats: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'chef' | 'admin';
  created_at: string;
  status: 'active' | 'suspended';
}

interface Chef {
  id: string;
  name: string;
  email: string;
  specialties: string[];
  status: 'pending' | 'approved' | 'rejected';
  rating: number;
  total_bookings: number;
  created_at: string;
}

interface Booking {
  id: string;
  client_name: string;
  chef_name: string;
  date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  amount: number;
}

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalChefs: 0,
    pendingChefs: 0,
    totalBookings: 0,
    todayBookings: 0,
    revenue: 0,
    aiChats: 0
  });
  const [users, setUsers] = useState<User[]>([]);
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      return;
    }
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load real stats from API
      const statsData = await apiCall('/admin/stats', {}, true);
      setStats(statsData);

      setUsers([
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'client',
          created_at: '2024-01-15',
          status: 'active'
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'chef',
          created_at: '2024-01-10',
          status: 'active'
        }
      ]);

      setChefs([
        {
          id: '1',
          name: 'Chef Wanjiku Kamau',
          email: 'wanjiku@example.com',
          specialties: ['Kenyan', 'Swahili Coast'],
          status: 'approved',
          rating: 4.9,
          total_bookings: 156,
          created_at: '2024-01-05'
        },
        {
          id: '2',
          name: 'Chef David Mwangi',
          email: 'david@example.com',
          specialties: ['Nyama Choma', 'BBQ'],
          status: 'pending',
          rating: 0,
          total_bookings: 0,
          created_at: '2024-01-16'
        }
      ]);

      setBookings([
        {
          id: '1',
          client_name: 'John Doe',
          chef_name: 'Chef Wanjiku',
          date: '2024-01-20',
          status: 'confirmed',
          amount: 3500
        },
        {
          id: '2',
          client_name: 'Jane Smith',
          chef_name: 'Chef David',
          date: '2024-01-18',
          status: 'pending',
          amount: 5500
        }
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveChef = async (chefId: string) => {
    try {
      // API call to approve chef
      toast.success('Chef approved successfully');
      loadDashboardData();
    } catch (error) {
      toast.error('Failed to approve chef');
    }
  };

  const handleRejectChef = async (chefId: string) => {
    try {
      // API call to reject chef
      toast.success('Chef rejected');
      loadDashboardData();
    } catch (error) {
      toast.error('Failed to reject chef');
    }
  };

  const handleSuspendUser = async (userId: string) => {
    try {
      // API call to suspend user
      toast.success('User suspended');
      loadDashboardData();
    } catch (error) {
      toast.error('Failed to suspend user');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Access Denied</CardTitle>
            <CardDescription className="text-center">
              You need admin privileges to access this dashboard.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation 
        user={user} 
        currentTab={activeTab}
        onNavigate={setActiveTab}
        onSignOut={signOut}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline w-3 h-3 mr-1" />
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Chefs</CardTitle>
                  <ChefHat className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalChefs}</div>
                  <p className="text-xs text-muted-foreground">
                    <AlertCircle className="inline w-3 h-3 mr-1" />
                    {stats.pendingChefs} pending approval
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">KSh {stats.revenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline w-3 h-3 mr-1" />
                    +8% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">AI Conversations</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.aiChats.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    <Sparkles className="inline w-3 h-3 mr-1" />
                    Powered by Gemini AI
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                  <CardDescription>Latest booking activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{booking.client_name}</p>
                          <p className="text-sm text-muted-foreground">
                            with {booking.chef_name} • {booking.date}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={
                            booking.status === 'confirmed' ? 'default' :
                            booking.status === 'pending' ? 'secondary' :
                            booking.status === 'completed' ? 'default' : 'destructive'
                          }>
                            {booking.status}
                          </Badge>
                          <p className="text-sm font-medium">KSh {booking.amount.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pending Chef Approvals</CardTitle>
                  <CardDescription>Chefs waiting for approval</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {chefs.filter(chef => chef.status === 'pending').map((chef) => (
                      <div key={chef.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{chef.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {chef.specialties.join(', ')}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleApproveChef(chef.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleRejectChef(chef.id)}
                          >
                            <Ban className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage all platform users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{user.role}</Badge>
                          <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                            {user.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleSuspendUser(user.id)}
                        >
                          <Ban className="w-4 h-4 mr-1" />
                          Suspend
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Chefs Tab */}
          {activeTab === 'chefs' && (
            <Card>
              <CardHeader>
                <CardTitle>Chef Management</CardTitle>
                <CardDescription>Manage chef profiles and approvals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chefs.map((chef) => (
                    <div key={chef.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{chef.name}</p>
                        <p className="text-sm text-muted-foreground">{chef.email}</p>
                        <p className="text-sm text-muted-foreground">
                          Specialties: {chef.specialties.join(', ')}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={
                            chef.status === 'approved' ? 'default' :
                            chef.status === 'pending' ? 'secondary' : 'destructive'
                          }>
                            {chef.status}
                          </Badge>
                          {chef.rating > 0 && (
                            <Badge variant="outline">
                              ⭐ {chef.rating} ({chef.total_bookings} bookings)
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View Profile
                        </Button>
                        {chef.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              onClick={() => handleApproveChef(chef.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <UserCheck className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleRejectChef(chef.id)}
                            >
                              <Ban className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <Card>
              <CardHeader>
                <CardTitle>Booking Management</CardTitle>
                <CardDescription>Monitor and manage all bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Booking #{booking.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.client_name} → {booking.chef_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Date: {booking.date} • Amount: KSh {booking.amount.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          booking.status === 'confirmed' ? 'default' :
                          booking.status === 'pending' ? 'secondary' :
                          booking.status === 'completed' ? 'default' : 'destructive'
                        }>
                          {booking.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Monitoring Tab */}
          {activeTab === 'ai' && (
            <Card>
              <CardHeader>
                <CardTitle>AI Chat Monitoring</CardTitle>
                <CardDescription>Monitor Gemini AI conversations and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">{stats.aiChats.toLocaleString()}</div>
                    <p className="text-sm text-muted-foreground">Total Conversations</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">94.2%</div>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">1.2s</div>
                    <p className="text-sm text-muted-foreground">Avg Response Time</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Recent AI Conversations</h4>
                  <div className="space-y-2">
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm"><strong>User:</strong> "Find me a chef for Italian cuisine"</p>
                      <p className="text-sm text-muted-foreground"><strong>AI:</strong> "I found 3 Italian chefs near you..."</p>
                      <p className="text-xs text-muted-foreground mt-1">2 minutes ago • English</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm"><strong>User:</strong> "Nataka mpishi wa chakula ya kienyeji"</p>
                      <p className="text-sm text-muted-foreground"><strong>AI:</strong> "Nimepata wapishi 5 wa chakula ya kienyeji..."</p>
                      <p className="text-xs text-muted-foreground mt-1">5 minutes ago • Swahili</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure platform settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">AI Configuration</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Current: Gemini 2.0 Flash
                    </p>
                    <Button size="sm" variant="outline">
                      Configure AI Settings
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Payment Settings</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Stripe integration active
                    </p>
                    <Button size="sm" variant="outline">
                      Manage Payments
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Automated emails enabled
                    </p>
                    <Button size="sm" variant="outline">
                      Email Settings
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Platform Analytics</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Google Analytics connected
                    </p>
                    <Button size="sm" variant="outline">
                      View Analytics
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
