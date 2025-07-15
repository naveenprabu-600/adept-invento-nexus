import React, { useState, useMemo } from 'react';
import { Calendar, TrendingUp, Download, Settings, BarChart3, LineChart, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart as RechartsBarChart, Bar } from 'recharts';

// Define data types
interface HistoricalDataPoint {
  date: string;
  dateObj: Date;
  productId: string;
  productName: string;
  category: string;
  warehouse: string;
  actualDemand: number;
  revenue: number;
}

interface ChartDataPoint {
  date: string;
  actualDemand: number | null;
  forecastedDemand?: number | null;
  revenue: number | null;
}

// Generate mock historical data for multiple years
const generateHistoricalData = (): HistoricalDataPoint[] => {
  const products = [
    { id: 'LPT-001', name: 'Laptop Pro 15"', category: 'Electronics' },
    { id: 'WMS-001', name: 'Wireless Mouse', category: 'Accessories' },
    { id: 'USB-001', name: 'USB-C Cable', category: 'Accessories' },
    { id: 'MON-001', name: 'Monitor 27"', category: 'Electronics' },
    { id: 'KBD-001', name: 'Mechanical Keyboard', category: 'Accessories' },
  ];
  
  const warehouses = ['Main Warehouse', 'Branch Warehouse', 'Storage Facility A'];
  const data: HistoricalDataPoint[] = [];
  
  // Generate 2 years of monthly data
  const startDate = new Date(2022, 0, 1);
  const endDate = new Date(2024, 11, 31);
  
  for (let date = new Date(startDate); date <= endDate; date.setMonth(date.getMonth() + 1)) {
    products.forEach(product => {
      warehouses.forEach(warehouse => {
        // Generate seasonal demand with trends and randomness
        const month = date.getMonth();
        const year = date.getFullYear();
        
        // Base demand with seasonal variation
        let baseDemand = 50;
        if (product.category === 'Electronics') baseDemand = 30;
        if (product.category === 'Accessories') baseDemand = 80;
        
        // Seasonal multipliers (higher in Q4, lower in summer)
        const seasonalMultiplier = month >= 10 || month <= 1 ? 1.4 : 
                                 month >= 6 && month <= 8 ? 0.7 : 1.0;
        
        // Year-over-year growth
        const growthMultiplier = 1 + ((year - 2022) * 0.15);
        
        // Random variation
        const randomMultiplier = 0.7 + Math.random() * 0.6;
        
        const demand = Math.round(baseDemand * seasonalMultiplier * growthMultiplier * randomMultiplier);
        
        data.push({
          date: date.toISOString().slice(0, 7), // YYYY-MM format
          dateObj: new Date(date),
          productId: product.id,
          productName: product.name,
          category: product.category,
          warehouse: warehouse,
          actualDemand: demand,
          revenue: demand * (product.category === 'Electronics' ? 1500 : 25)
        });
      });
    });
  }
  
  return data;
};

// Simple forecasting algorithms
const generateForecast = (historicalData: HistoricalDataPoint[], modelType: string, periods: number): number[] => {
  const sortedData = [...historicalData].sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
  
  switch (modelType) {
    case 'moving-average':
      const windowSize = 3;
      const recentData = sortedData.slice(-windowSize);
      const average = recentData.reduce((sum, item) => sum + item.actualDemand, 0) / windowSize;
      return Array(periods).fill(0).map((_, i) => Math.round(average * (1 + (Math.random() - 0.5) * 0.1)));
      
    case 'trend':
      const trend = (sortedData[sortedData.length - 1].actualDemand - sortedData[0].actualDemand) / sortedData.length;
      const lastValue = sortedData[sortedData.length - 1].actualDemand;
      return Array(periods).fill(0).map((_, i) => Math.round(lastValue + trend * (i + 1)));
      
    case 'seasonal':
      const seasonalPattern = sortedData.slice(-12).map(item => item.actualDemand);
      return Array(periods).fill(0).map((_, i) => {
        const seasonalIndex = i % 12;
        const seasonalValue = seasonalPattern[seasonalIndex] || seasonalPattern[seasonalPattern.length - 1];
        return Math.round(seasonalValue * (1 + (Math.random() - 0.5) * 0.2));
      });
      
    default:
      return Array(periods).fill(50);
  }
};

const DemandForecasting = () => {
  const [selectedProduct, setSelectedProduct] = useState('LPT-001');
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [forecastModel, setForecastModel] = useState('moving-average');
  const [timeHorizon, setTimeHorizon] = useState('3');
  const [historicalPeriod, setHistoricalPeriod] = useState('12');
  
  const historicalData = useMemo(() => generateHistoricalData(), []);
  
  // Filter data based on selections
  const filteredData = useMemo(() => {
    return historicalData.filter(item => {
      if (selectedProduct !== 'all' && item.productId !== selectedProduct) return false;
      if (selectedWarehouse !== 'all' && item.warehouse !== selectedWarehouse) return false;
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      
      // Filter by historical period
      const cutoffDate = new Date();
      cutoffDate.setMonth(cutoffDate.getMonth() - parseInt(historicalPeriod));
      return item.dateObj >= cutoffDate;
    });
  }, [historicalData, selectedProduct, selectedWarehouse, selectedCategory, historicalPeriod]);
  
  // Aggregate data by month
  const chartData = useMemo(() => {
    const aggregated = filteredData.reduce((acc, item) => {
      const key = item.date;
      if (!acc[key]) {
        acc[key] = { date: key, actualDemand: 0, revenue: 0 };
      }
      acc[key].actualDemand += item.actualDemand;
      acc[key].revenue += item.revenue;
      return acc;
    }, {} as Record<string, ChartDataPoint>);
    
    const sorted: ChartDataPoint[] = Object.values(aggregated).sort((a, b) => a.date.localeCompare(b.date));
    
    // Generate forecast
    const forecastPeriods = parseInt(timeHorizon);
    const forecast = generateForecast(filteredData, forecastModel, forecastPeriods);
    
    // Add forecast data points
    const lastDate = new Date(sorted[sorted.length - 1]?.date || '2024-12');
    for (let i = 0; i < forecastPeriods; i++) {
      const forecastDate = new Date(lastDate);
      forecastDate.setMonth(forecastDate.getMonth() + i + 1);
      sorted.push({
        date: forecastDate.toISOString().slice(0, 7),
        actualDemand: null,
        forecastedDemand: forecast[i],
        revenue: null
      });
    }
    
    return sorted;
  }, [filteredData, forecastModel, timeHorizon]);
  
  // Calculate insights
  const insights = useMemo(() => {
    const currentStock = 45; // Mock current stock
    const leadTime = 14; // days
    const validHistoricalData = chartData.slice(-parseInt(historicalPeriod))
      .filter(item => item.actualDemand !== null);
    const avgDemand = validHistoricalData.length > 0 
      ? validHistoricalData.reduce((sum, item) => sum + (item.actualDemand || 0), 0) / validHistoricalData.length
      : 0;
    
    const validForecastData = chartData.filter(item => item.forecastedDemand !== null);
    const forecastedDemand = validForecastData.length > 0
      ? validForecastData.reduce((sum, item) => sum + (item.forecastedDemand || 0), 0)
      : 0;
    
    const suggestedReorderPoint = Math.round((avgDemand / 30) * leadTime * 1.5); // Safety stock
    const suggestedOrderQuantity = Math.round(forecastedDemand - currentStock + suggestedReorderPoint);
    
    return {
      avgDemand: Math.round(avgDemand),
      forecastedDemand: Math.round(forecastedDemand),
      suggestedReorderPoint,
      suggestedOrderQuantity: Math.max(0, suggestedOrderQuantity),
      currentStock
    };
  }, [chartData, historicalPeriod]);
  
  const products = [...new Set(historicalData.map(item => ({ id: item.productId, name: item.productName })))];
  const warehouses = [...new Set(historicalData.map(item => item.warehouse))];
  const categories = [...new Set(historicalData.map(item => item.category))];

  const handleExport = () => {
    const csvContent = chartData.map(item => 
      `${item.date},${item.actualDemand ?? ''},${item.forecastedDemand ?? ''}`
    ).join('\n');
    
    const blob = new Blob(['Date,Actual Demand,Forecasted Demand\n' + csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'demand-forecast.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Demand Forecasting</h1>
          <p className="text-secondary-text">Analyze historical data and predict future demand for strategic inventory planning</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Forecast
          </Button>
        </div>
      </div>

      {/* Configuration Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Forecast Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <Label htmlFor="product">Product</Label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  {products.map(product => (
                    <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="warehouse">Warehouse</Label>
              <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                <SelectTrigger>
                  <SelectValue placeholder="Select warehouse" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Warehouses</SelectItem>
                  {warehouses.map(warehouse => (
                    <SelectItem key={warehouse} value={warehouse}>{warehouse}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="model">Forecasting Model</Label>
              <Select value={forecastModel} onValueChange={setForecastModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="moving-average">Moving Average</SelectItem>
                  <SelectItem value="trend">Trend Analysis</SelectItem>
                  <SelectItem value="seasonal">Seasonal Pattern</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="horizon">Time Horizon</Label>
              <Select value={timeHorizon} onValueChange={setTimeHorizon}>
                <SelectTrigger>
                  <SelectValue placeholder="Select horizon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Month</SelectItem>
                  <SelectItem value="3">3 Months</SelectItem>
                  <SelectItem value="6">6 Months</SelectItem>
                  <SelectItem value="12">12 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="historical">Historical Period</Label>
              <Select value={historicalPeriod} onValueChange={setHistoricalPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 Months</SelectItem>
                  <SelectItem value="12">12 Months</SelectItem>
                  <SelectItem value="24">24 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Demand Forecast Visualization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RechartsLineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--foreground))"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="hsl(var(--foreground))"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="actualDemand" 
                    stroke="#14b8a6" 
                    strokeWidth={2}
                    name="Historical Demand"
                    connectNulls={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="forecastedDemand" 
                    stroke="#06b6d4" 
                    strokeWidth={2}
                    strokeDasharray="8 8"
                    name="Forecasted Demand"
                    connectNulls={false}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Insights Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Key Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-secondary-text">Avg Monthly Demand</span>
                <Badge variant="secondary">{insights.avgDemand} units</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-secondary-text">Forecasted Demand</span>
                <Badge variant="default">{insights.forecastedDemand} units</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-secondary-text">Current Stock</span>
                <Badge variant="outline">{insights.currentStock} units</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Actionable Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Suggested Reorder Point</h4>
                <div className="bg-accent/50 p-3 rounded-lg">
                  <span className="text-lg font-bold text-primary">{insights.suggestedReorderPoint}</span>
                  <span className="text-sm text-secondary-text ml-1">units</span>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Suggested Order Quantity</h4>
                <div className="bg-accent/50 p-3 rounded-lg">
                  <span className="text-lg font-bold text-primary">{insights.suggestedOrderQuantity}</span>
                  <span className="text-sm text-secondary-text ml-1">units</span>
                </div>
              </div>

              <div className="pt-2">
                <Button className="w-full" size="sm">
                  Generate Purchase Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Forecast Details Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Forecast Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Historical Demand</TableHead>
                <TableHead>Forecasted Demand</TableHead>
                <TableHead>Variance</TableHead>
                <TableHead>Confidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chartData.slice(-6).map((item, index) => {
                const variance = item.forecastedDemand && item.actualDemand 
                  ? ((item.forecastedDemand - item.actualDemand) / item.actualDemand * 100)
                  : null;
                
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.date}</TableCell>
                    <TableCell>{item.actualDemand ?? '-'}</TableCell>
                    <TableCell>{item.forecastedDemand ?? '-'}</TableCell>
                    <TableCell>
                      {variance !== null && (
                        <Badge variant={Math.abs(variance) < 10 ? 'default' : 'secondary'}>
                          {variance > 0 ? '+' : ''}{variance.toFixed(1)}%
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {item.forecastedDemand ? '85%' : '-'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemandForecasting;