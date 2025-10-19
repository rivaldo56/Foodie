import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ChefHat, Home, Search, Calendar, MessageSquare, User, LogOut } from "lucide-react";

export type NavPage = 'home' | 'discover' | 'calendar' | 'messages' | 'profile';

interface NavigationProps {
  user: any;
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  onSignOut: () => void;
}

export function Navigation({ user, currentPage, onNavigate, onSignOut }: NavigationProps) {
  const isChef = user.role === 'chef';

  const navItems = [
    { id: 'home' as NavPage, label: 'Home', icon: Home },
    { id: 'discover' as NavPage, label: 'Discover', icon: Search },
    { id: 'calendar' as NavPage, label: 'Calendar', icon: Calendar },
    { id: 'messages' as NavPage, label: 'Messages', icon: MessageSquare },
    { id: 'profile' as NavPage, label: 'Profile', icon: User }
  ];

  return (
    <>
      {/* Top Header - Desktop Only */}
      <div className="hidden md:block bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
              <ChefHat className="w-7 h-7 text-primary" />
              <span className="text-xl font-semibold">Foodie</span>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              {isChef && (
                <Badge className="bg-secondary text-secondary-foreground">
                  Chef
                </Badge>
              )}
              
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{user.name}</span>
              </div>

              <Button variant="ghost" size="sm" onClick={onSignOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Pinterest Style */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 safe-area-inset-bottom pointer-events-none">
        <div className="container mx-auto px-4 pb-4">
          <div className="bg-card/95 backdrop-blur-lg border border-border rounded-full shadow-lg pointer-events-auto max-w-md mx-auto">
            <div className="flex items-center justify-around px-2 py-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`group relative flex flex-col items-center gap-1 py-2 px-3 rounded-full transition-all duration-300 min-w-[60px] hover:scale-110 ${
                      isActive 
                        ? 'text-primary bg-primary/10' 
                        : 'text-muted-foreground hover:bg-muted/50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 transition-transform duration-300 ${
                      isActive ? 'scale-110' : 'group-hover:scale-110'
                    }`} />
                    <span className={`text-xs transition-all duration-300 ${
                      isActive ? 'opacity-100 font-medium' : 'opacity-70 group-hover:opacity-100'
                    }`}>
                      {item.label}
                    </span>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
