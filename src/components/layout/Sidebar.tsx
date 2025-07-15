import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  Users,
  Warehouse,
  FileText,
  ClipboardList,
  Package,
  Box,
  ShoppingCart,
  TruckIcon,
  Building2,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Package2,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const { user } = useAuth();
  const location = useLocation();

  const adminMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Users, label: 'User Management', href: '/users' },
    { icon: Warehouse, label: 'Warehouse Management', href: '/warehouses' },
    { icon: TrendingUp, label: 'Demand Forecasting', href: '/demand-forecasting' },
    { icon: FileText, label: 'Reports', href: '/reports' },
    { icon: ClipboardList, label: 'Audit Trail', href: '/audit-trail' },
  ];

  const managerMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Package, label: 'Product Management', href: '/products' },
    { icon: Box, label: 'Inventory Management', href: '/inventory' },
    { icon: ShoppingCart, label: 'Purchase Orders', href: '/purchase-orders' },
    { icon: TruckIcon, label: 'Sales Orders', href: '/sales-orders' },
    { icon: Building2, label: 'Supplier Management', href: '/suppliers' },
    { icon: BarChart3, label: 'Reports', href: '/reports' },
  ];

  const salesMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: TruckIcon, label: 'Sales Orders', href: '/sales-orders' },
    { icon: Package, label: 'Product Catalog', href: '/product-catalog' },
  ];

  const getMenuItems = () => {
    switch (user?.role.name) {
      case 'Admin':
        return adminMenuItems;
      case 'Manager':
        return managerMenuItems;
      case 'Sales':
        return salesMenuItems;
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <div className={cn(
      "bg-sidebar text-sidebar-foreground h-full flex flex-col transition-all duration-300 ease-in-out border-r border-sidebar-border",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <Package2 className="h-8 w-8 text-sidebar-accent" />
              <div>
                <h1 className="text-lg font-bold text-sidebar-foreground">Adept Invento</h1>
                <p className="text-xs text-sidebar-foreground/70">Inventory Management</p>
              </div>
            </div>
          )}
          {isCollapsed && (
            <Package2 className="h-8 w-8 text-sidebar-accent mx-auto" />
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground"
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info */}
      {!isCollapsed && user && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-sidebar-accent rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-sidebar-foreground">
                {user.firstName[0]}{user.lastName[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-sidebar-foreground/70 truncate">
                {user.role.name}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Collapse Toggle */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="w-full justify-center text-sidebar-foreground hover:bg-sidebar-foreground/10"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Collapse
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;