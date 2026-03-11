import React from 'react';
import { ChefHat, ShoppingBasket, LayoutDashboard, LogOut, Settings, Package } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/UIComponents';

interface SidebarProps {
  currentView: 'recipes' | 'ingredients';
  onNavigate: (view: 'recipes' | 'ingredients') => void;
}

export function Sidebar({ currentView, onNavigate }: SidebarProps) {
  const NavItem = ({ view, icon: Icon, label }: { view: 'recipes' | 'ingredients', icon: any, label: string }) => (
    <Button
      variant="ghost"
      onClick={() => onNavigate(view)}
      className={cn(
        "w-full justify-start gap-2 px-2",
        currentView === view 
          ? "bg-secondary text-foreground font-semibold" 
          : "text-muted-foreground hover:text-foreground hover:bg-transparent"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Button>
  );

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card text-card-foreground">
      {/* Brand Header */}
      <div className="h-14 flex items-center px-6 border-b">
        <div className="flex items-center gap-2 font-semibold">
           <Package className="h-6 w-6" />
           <span>Sumar Admin</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="grid items-start px-4 text-sm font-medium">
            <div className="px-2 py-2">
                <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
                    Platform
                </h2>
                <div className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start gap-2 px-2 text-muted-foreground">
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                    </Button>
                </div>
            </div>

            <div className="px-2 py-2">
                <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
                    Cost Control
                </h2>
                <div className="space-y-1">
                    <NavItem view="ingredients" icon={ShoppingBasket} label="Ingredients" />
                    <NavItem view="recipes" icon={ChefHat} label="Recipes" />
                </div>
            </div>
            
             <div className="px-2 py-2">
                <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
                    Settings
                </h2>
                <div className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start gap-2 px-2 text-muted-foreground">
                        <Settings className="h-4 w-4" />
                        Configuration
                    </Button>
                </div>
            </div>
        </nav>
      </div>

      {/* Footer User Profile (Fake) */}
      <div className="border-t p-4">
        <div className="flex items-center gap-4">
            <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center">
                <span className="text-xs font-medium">KG</span>
            </div>
            <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium leading-none">Kautapen Group</p>
                <p className="truncate text-xs text-muted-foreground">admin@kautapen.com</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto">
                <LogOut className="h-4 w-4" />
            </Button>
        </div>
      </div>
    </div>
  );
}