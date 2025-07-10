import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AdminDashboardCards, 
  ManagerDashboardCards, 
  SalesDashboardCards 
} from '@/components/dashboard/DashboardCards';
import {
  InventoryOverviewChart,
  SalesTrendChart,
  StockStatusChart,
  TopProductsChart
} from '@/components/dashboard/DashboardCharts';
import { 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Package,
  Calendar,
  User
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const renderDashboardContent = () => {
    switch (user?.role.name) {
      case 'Admin':
        return <AdminDashboard />;
      case 'Manager':
        return <ManagerDashboard />;
      case 'Sales':
        return <SalesDashboard />;
      default:
        return <div>Loading...</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary to-accent p-6 rounded-lg text-primary-foreground">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-primary-foreground/90">
          Here's what's happening with your inventory today.
        </p>
      </div>

      {renderDashboardContent()}
    </div>
  );
};

const AdminDashboard = () => (
  <>
    {/* Metrics Cards */}
    <AdminDashboardCards />

    {/* Charts Section */}
    <div className="grid gap-6 lg:grid-cols-2">
      <InventoryOverviewChart />
      <SalesTrendChart />
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <StockStatusChart />
      <TopProductsChart />
    </div>

    {/* Recent Activity */}
    <RecentActivityCard />
  </>
);

const ManagerDashboard = () => (
  <>
    {/* Metrics Cards */}
    <ManagerDashboardCards />

    {/* Alerts Section */}
    <AlertsSection />

    {/* Charts Section */}
    <div className="grid gap-6 lg:grid-cols-2">
      <SalesTrendChart />
      <StockStatusChart />
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <InventoryOverviewChart />
      <PendingOrdersCard />
    </div>
  </>
);

const SalesDashboard = () => (
  <>
    {/* Metrics Cards */}
    <SalesDashboardCards />

    {/* Quick Actions */}
    <QuickActionsCard />

    {/* Charts Section */}
    <div className="grid gap-6 lg:grid-cols-2">
      <TopProductsChart />
      <ProductAvailabilityCard />
    </div>

    {/* Recent Orders */}
    <RecentOrdersCard />
  </>
);

const AlertsSection = () => (
  <Card className="border-border">
    <CardHeader>
      <CardTitle className="text-foreground flex items-center">
        <AlertTriangle className="h-5 w-5 mr-2 text-warning" />
        Priority Alerts
      </CardTitle>
      <CardDescription className="text-secondary-text">
        Items requiring immediate attention
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {[
          { type: 'Low Stock', item: 'Wireless Headphones', level: '5 units left', severity: 'high' },
          { type: 'Expiring', item: 'Protein Bars', date: 'Expires in 3 days', severity: 'medium' },
          { type: 'Overstock', item: 'Winter Jackets', level: '150% over target', severity: 'low' },
        ].map((alert, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-card-accent/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'}>
                {alert.type}
              </Badge>
              <div>
                <p className="font-medium text-foreground">{alert.item}</p>
                <p className="text-sm text-secondary-text">{alert.level || alert.date}</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Resolve
            </Button>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const QuickActionsCard = () => (
  <Card className="border-border">
    <CardHeader>
      <CardTitle className="text-foreground">Quick Actions</CardTitle>
      <CardDescription className="text-secondary-text">
        Common tasks for sales operations
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button className="h-20 flex flex-col space-y-2 bg-primary hover:bg-primary-hover">
          <Package className="h-6 w-6" />
          <span>New Order</span>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col space-y-2">
          <User className="h-6 w-6" />
          <span>Add Customer</span>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col space-y-2">
          <TrendingUp className="h-6 w-6" />
          <span>View Reports</span>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col space-y-2">
          <Calendar className="h-6 w-6" />
          <span>Schedule</span>
        </Button>
      </div>
    </CardContent>
  </Card>
);

const RecentActivityCard = () => (
  <Card className="border-border">
    <CardHeader>
      <CardTitle className="text-foreground">Recent Activity</CardTitle>
      <CardDescription className="text-secondary-text">
        Latest system transactions and updates
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[
          { user: 'Sarah Manager', action: 'Created purchase order #PO-2024-001', time: '2 minutes ago' },
          { user: 'Mike Sales', action: 'Completed sales order #SO-2024-156', time: '15 minutes ago' },
          { user: 'John Admin', action: 'Added new warehouse in Dallas', time: '1 hour ago' },
          { user: 'Sarah Manager', action: 'Updated inventory for Laptop Pro', time: '2 hours ago' },
        ].map((activity, index) => (
          <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-card-accent/10">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{activity.user}</p>
              <p className="text-sm text-secondary-text">{activity.action}</p>
            </div>
            <div className="flex items-center text-xs text-secondary-text">
              <Clock className="h-3 w-3 mr-1" />
              {activity.time}
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const PendingOrdersCard = () => (
  <Card className="border-border">
    <CardHeader>
      <CardTitle className="text-foreground">Pending Purchase Orders</CardTitle>
      <CardDescription className="text-secondary-text">
        Orders awaiting processing or delivery
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {[
          { id: 'PO-2024-001', supplier: 'TechCorp Inc.', amount: '$12,450', status: 'Ordered' },
          { id: 'PO-2024-002', supplier: 'SportGear Ltd.', amount: '$8,900', status: 'Pending' },
          { id: 'PO-2024-003', supplier: 'HomeStyle Co.', amount: '$15,600', status: 'Received' },
        ].map((order, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-card-accent/20 rounded-lg">
            <div>
              <p className="font-medium text-foreground">{order.id}</p>
              <p className="text-sm text-secondary-text">{order.supplier}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-foreground">{order.amount}</p>
              <Badge variant="outline">{order.status}</Badge>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const ProductAvailabilityCard = () => (
  <Card className="border-border">
    <CardHeader>
      <CardTitle className="text-foreground">Product Availability</CardTitle>
      <CardDescription className="text-secondary-text">
        Current stock status for top products
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {[
          { name: 'Wireless Headphones', stock: 45, status: 'In Stock' },
          { name: 'Laptop Pro', stock: 8, status: 'Low Stock' },
          { name: 'Smart Watch', stock: 125, status: 'In Stock' },
          { name: 'Tablet', stock: 0, status: 'Out of Stock' },
        ].map((product, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-card-accent/20 rounded-lg">
            <div>
              <p className="font-medium text-foreground">{product.name}</p>
              <p className="text-sm text-secondary-text">{product.stock} units</p>
            </div>
            <Badge 
              variant={product.status === 'In Stock' ? 'default' : 
                      product.status === 'Low Stock' ? 'secondary' : 'destructive'}
            >
              {product.status}
            </Badge>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const RecentOrdersCard = () => (
  <Card className="border-border">
    <CardHeader>
      <CardTitle className="text-foreground">Recent Sales Orders</CardTitle>
      <CardDescription className="text-secondary-text">
        Your latest customer orders
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {[
          { id: 'SO-2024-156', customer: 'ABC Electronics', amount: '$2,450', status: 'Processing' },
          { id: 'SO-2024-155', customer: 'XYZ Store', amount: '$890', status: 'Shipped' },
          { id: 'SO-2024-154', customer: 'Tech Solutions', amount: '$3,200', status: 'Delivered' },
        ].map((order, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-card-accent/20 rounded-lg">
            <div>
              <p className="font-medium text-foreground">{order.id}</p>
              <p className="text-sm text-secondary-text">{order.customer}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-foreground">{order.amount}</p>
              <Badge variant="outline">{order.status}</Badge>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default Dashboard;