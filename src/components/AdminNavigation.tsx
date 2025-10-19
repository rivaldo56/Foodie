'use client';

import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { 
  ChefHat, 
  BarChart3, 
  Users, 
  Calendar, 
  MessageSquare, 
  Settings, 
  LogOut,
  Home,
  Sparkles
} from "lucide-react";

interface AdminNavigationProps {
  user: any;
  currentTab: string;
  onNavigate: (tab: string) => void;
  onSignOut: () => void;
}

export function AdminNavigation({ user, currentTab, onNavigate, onSignOut }: AdminNavigationProps) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'chefs', label: 'Chefs', icon: ChefHat },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'ai', label: 'AI Monitoring', icon: Sparkles },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <>
      {/* Top Header */}
      <div className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <ChefHat className="w-7 h-7 text-primary" />
              <span className="text-xl font-semibold">Foodie Admin</span>
            </div>

            {/* Navigation Tabs - Desktop */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <Badge className="bg-red-600 text-white">
                Admin
              </Badge>
              
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user.name?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm hidden md:block">{user.name}</span>
              </div>

              <Button variant="ghost" size="sm" onClick={onSignOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 py-2 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>🟢 System Status: Online</span>
              <span>📊 Last Updated: {new Date().toLocaleTimeString()}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => window.open('/', '_blank')}>
                <Home className="w-4 h-4 mr-1" />
                View Site
              </Button>
              <Button size="sm" onClick={() => window.location.reload()}>
                Refresh Data
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
