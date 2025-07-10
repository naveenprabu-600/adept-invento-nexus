import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Package, 
  Warehouse, 
  TrendingUp, 
  AlertTriangle,
  Users,
  ShoppingCart,
  DollarSign,
  Box
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  description?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon, 
  description 
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-error';
      default:
        return 'text-secondary-text';
    }
  };

  return (
    <Card className="border-border hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          {title}
        </CardTitle>
        <div className="text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {change && (
          <p className={`text-xs ${getChangeColor()} mt-1`}>
            {change}
          </p>
        )}
        {description && (
          <p className="text-xs text-secondary-text mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

// Admin Dashboard Cards
export const AdminDashboardCards = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <MetricCard
      title="Total Products"
      value="1,234"
      change="+12% from last month"
      changeType="positive"
      icon={<Package className="h-4 w-4" />}
    />
    <MetricCard
      title="Total Stock Items"
      value="45,678"
      change="+8% from last month"
      changeType="positive"
      icon={<Box className="h-4 w-4" />}
    />
    <MetricCard
      title="Warehouses"
      value="8"
      change="2 new this quarter"
      changeType="positive"
      icon={<Warehouse className="h-4 w-4" />}
    />
    <MetricCard
      title="Low Stock Items"
      value="23"
      change="Requires attention"
      changeType="negative"
      icon={<AlertTriangle className="h-4 w-4" />}
    />
    <MetricCard
      title="Active Users"
      value="156"
      change="+5% this month"
      changeType="positive"
      icon={<Users className="h-4 w-4" />}
    />
    <MetricCard
      title="Pending Orders"
      value="89"
      change="12 urgent"
      changeType="neutral"
      icon={<ShoppingCart className="h-4 w-4" />}
    />
    <MetricCard
      title="Monthly Revenue"
      value="$124,500"
      change="+15% from last month"
      changeType="positive"
      icon={<DollarSign className="h-4 w-4" />}
    />
    <MetricCard
      title="Stock Movements"
      value="1,567"
      change="This week"
      changeType="neutral"
      icon={<TrendingUp className="h-4 w-4" />}
    />
  </div>
);

// Manager Dashboard Cards
export const ManagerDashboardCards = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <MetricCard
      title="Stock Value"
      value="$89,450"
      change="+12% from last month"
      changeType="positive"
      icon={<DollarSign className="h-4 w-4" />}
    />
    <MetricCard
      title="Active Purchase Orders"
      value="34"
      change="8 pending delivery"
      changeType="neutral"
      icon={<ShoppingCart className="h-4 w-4" />}
    />
    <MetricCard
      title="Sales Orders"
      value="127"
      change="+18% this week"
      changeType="positive"
      icon={<TrendingUp className="h-4 w-4" />}
    />
    <MetricCard
      title="Low Stock Alerts"
      value="15"
      description="Products below reorder point"
      icon={<AlertTriangle className="h-4 w-4" />}
    />
    <MetricCard
      title="Expiring Stock"
      value="8"
      change="Next 30 days"
      changeType="negative"
      icon={<Package className="h-4 w-4" />}
    />
    <MetricCard
      title="Products Managed"
      value="456"
      change="Across 3 warehouses"
      changeType="neutral"
      icon={<Box className="h-4 w-4" />}
    />
  </div>
);

// Sales Dashboard Cards
export const SalesDashboardCards = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    <MetricCard
      title="My Sales This Month"
      value="$45,230"
      change="+22% from last month"
      changeType="positive"
      icon={<DollarSign className="h-4 w-4" />}
    />
    <MetricCard
      title="Pending Orders"
      value="18"
      change="3 require attention"
      changeType="neutral"
      icon={<ShoppingCart className="h-4 w-4" />}
    />
    <MetricCard
      title="Products Available"
      value="1,234"
      change="In stock across warehouses"
      changeType="positive"
      icon={<Package className="h-4 w-4" />}
    />
    <MetricCard
      title="Orders Completed"
      value="156"
      change="This month"
      changeType="positive"
      icon={<TrendingUp className="h-4 w-4" />}
    />
    <MetricCard
      title="Customer Inquiries"
      value="42"
      change="Pending response"
      changeType="neutral"
      icon={<Users className="h-4 w-4" />}
    />
    <MetricCard
      title="Low Stock Items"
      value="12"
      description="May affect sales"
      icon={<AlertTriangle className="h-4 w-4" />}
    />
  </div>
);