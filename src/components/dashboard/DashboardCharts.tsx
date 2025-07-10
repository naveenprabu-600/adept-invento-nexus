import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// Sample data for charts
const inventoryData = [
  { category: 'Electronics', stock: 2400, value: 45000 },
  { category: 'Clothing', stock: 1800, value: 23000 },
  { category: 'Books', stock: 3200, value: 18000 },
  { category: 'Home & Garden', stock: 1600, value: 31000 },
  { category: 'Sports', stock: 2200, value: 28000 },
  { category: 'Automotive', stock: 1400, value: 42000 },
];

const salesTrendData = [
  { month: 'Jan', sales: 45000, purchases: 38000 },
  { month: 'Feb', sales: 52000, purchases: 42000 },
  { month: 'Mar', sales: 48000, purchases: 35000 },
  { month: 'Apr', sales: 61000, purchases: 48000 },
  { month: 'May', sales: 55000, purchases: 45000 },
  { month: 'Jun', sales: 67000, purchases: 52000 },
];

const stockStatusData = [
  { name: 'In Stock', value: 850, color: '#57C5B6' },
  { name: 'Low Stock', value: 120, color: '#159895' },
  { name: 'Out of Stock', value: 45, color: '#1A5F7A' },
];

const topProductsData = [
  { product: 'Laptop Pro', sold: 145, revenue: 72500 },
  { product: 'Wireless Headphones', sold: 289, revenue: 28900 },
  { product: 'Smart Watch', sold: 178, revenue: 53400 },
  { product: 'Tablet', sold: 156, revenue: 46800 },
  { product: 'Smartphone', sold: 234, revenue: 117000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border p-3 rounded-lg shadow-lg">
        <p className="text-foreground font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.dataKey}: {typeof entry.value === 'number' && entry.value > 1000 
              ? `$${(entry.value / 1000).toFixed(1)}k` 
              : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const InventoryOverviewChart = () => (
  <Card className="border-border">
    <CardHeader>
      <CardTitle className="text-foreground">Inventory by Category</CardTitle>
      <CardDescription className="text-secondary-text">
        Stock levels and values across product categories
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={inventoryData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#9ACBD0" opacity={0.3} />
          <XAxis 
            dataKey="category" 
            tick={{ fill: '#002B5B', fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis tick={{ fill: '#002B5B', fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="stock" fill="#159895" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export const SalesTrendChart = () => (
  <Card className="border-border">
    <CardHeader>
      <CardTitle className="text-foreground">Sales vs Purchase Trend</CardTitle>
      <CardDescription className="text-secondary-text">
        Monthly comparison of sales and purchases
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={salesTrendData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#9ACBD0" opacity={0.3} />
          <XAxis dataKey="month" tick={{ fill: '#002B5B', fontSize: 12 }} />
          <YAxis tick={{ fill: '#002B5B', fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="sales" 
            stroke="#159895" 
            strokeWidth={3}
            dot={{ fill: '#159895', strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="purchases" 
            stroke="#57C5B6" 
            strokeWidth={3}
            dot={{ fill: '#57C5B6', strokeWidth: 2, r: 4 }}
          />
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export const StockStatusChart = () => (
  <Card className="border-border">
    <CardHeader>
      <CardTitle className="text-foreground">Stock Status Distribution</CardTitle>
      <CardDescription className="text-secondary-text">
        Current inventory status overview
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={stockStatusData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {stockStatusData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [value, 'Products']}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #9ACBD0',
              borderRadius: '8px'
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export const TopProductsChart = () => (
  <Card className="border-border">
    <CardHeader>
      <CardTitle className="text-foreground">Top Selling Products</CardTitle>
      <CardDescription className="text-secondary-text">
        Best performing products this month
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={topProductsData} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" stroke="#9ACBD0" opacity={0.3} />
          <XAxis type="number" tick={{ fill: '#002B5B', fontSize: 12 }} />
          <YAxis 
            type="category" 
            dataKey="product" 
            tick={{ fill: '#002B5B', fontSize: 12 }}
            width={120}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="sold" fill="#57C5B6" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);