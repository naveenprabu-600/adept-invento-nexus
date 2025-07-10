import React, { useState } from 'react';
import { Download, Filter, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// Mock data for different reports
const mockStockReport = [
  { product: 'Laptop Pro 15"', sku: 'LPT-001', warehouse: 'Main Warehouse', currentStock: 25, reorderPoint: 10, status: 'In Stock' },
  { product: 'Wireless Mouse', sku: 'WMS-001', warehouse: 'Branch Warehouse', currentStock: 5, reorderPoint: 15, status: 'Low Stock' },
  { product: 'USB-C Cable', sku: 'USB-001', warehouse: 'Main Warehouse', currentStock: 0, reorderPoint: 20, status: 'Out of Stock' },
];

const mockSalesReport = [
  { period: '2024-01', product: 'Laptop Pro 15"', unitsSold: 45, revenue: 67500, customer: 'TechCorp Inc.' },
  { period: '2024-01', product: 'Wireless Mouse', unitsSold: 120, revenue: 3600, customer: 'Office Solutions' },
  { period: '2024-01', product: 'USB-C Cable', unitsSold: 200, revenue: 4000, customer: 'Various' },
];

const mockPurchaseReport = [
  { poId: 'PO-001', supplier: 'TechSupply Co.', orderDate: '2024-01-15', status: 'Received', totalAmount: 25000 },
  { poId: 'PO-002', supplier: 'ElectroDistrib', orderDate: '2024-01-18', status: 'Ordered', totalAmount: 15000 },
  { poId: 'PO-003', supplier: 'ComponentWorld', orderDate: '2024-01-20', status: 'Draft', totalAmount: 8500 },
];

const Reports = () => {
  const [selectedReportType, setSelectedReportType] = useState('stock');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('all');
  const [productFilter, setProductFilter] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('all');

  const handleExport = (format: 'csv' | 'pdf') => {
    console.log(`Exporting ${selectedReportType} report as ${format}`);
    // Implementation for export functionality
  };

  const StockReportTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Warehouse</TableHead>
          <TableHead>Current Stock</TableHead>
          <TableHead>Reorder Point</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mockStockReport.map((item, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{item.product}</TableCell>
            <TableCell>{item.sku}</TableCell>
            <TableCell>{item.warehouse}</TableCell>
            <TableCell>{item.currentStock}</TableCell>
            <TableCell>{item.reorderPoint}</TableCell>
            <TableCell>
              <Badge variant={
                item.status === 'In Stock' ? 'default' : 
                item.status === 'Low Stock' ? 'secondary' : 'destructive'
              }>
                {item.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const SalesReportTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Period</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Units Sold</TableHead>
          <TableHead>Revenue</TableHead>
          <TableHead>Top Customer</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mockSalesReport.map((item, index) => (
          <TableRow key={index}>
            <TableCell>{item.period}</TableCell>
            <TableCell className="font-medium">{item.product}</TableCell>
            <TableCell>{item.unitsSold}</TableCell>
            <TableCell>${item.revenue.toLocaleString()}</TableCell>
            <TableCell>{item.customer}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const PurchaseReportTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>PO ID</TableHead>
          <TableHead>Supplier</TableHead>
          <TableHead>Order Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Total Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mockPurchaseReport.map((item, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{item.poId}</TableCell>
            <TableCell>{item.supplier}</TableCell>
            <TableCell>{item.orderDate}</TableCell>
            <TableCell>
              <Badge variant={
                item.status === 'Received' ? 'default' : 
                item.status === 'Ordered' ? 'secondary' : 'outline'
              }>
                {item.status}
              </Badge>
            </TableCell>
            <TableCell>${item.totalAmount.toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-secondary-text">Generate and export various business reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport('csv')}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <Label htmlFor="dateFrom">Date From</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="dateTo">Date To</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="warehouse">Warehouse</Label>
              <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All warehouses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Warehouses</SelectItem>
                  <SelectItem value="main">Main Warehouse</SelectItem>
                  <SelectItem value="branch">Branch Warehouse</SelectItem>
                  <SelectItem value="storage">Storage Facility A</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="product">Product</Label>
              <Input
                id="product"
                placeholder="Filter by product..."
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="supplier">Supplier</Label>
              <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All suppliers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Suppliers</SelectItem>
                  <SelectItem value="techsupply">TechSupply Co.</SelectItem>
                  <SelectItem value="electrodistrib">ElectroDistrib</SelectItem>
                  <SelectItem value="componentworld">ComponentWorld</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button className="w-full">
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Tabs value={selectedReportType} onValueChange={setSelectedReportType}>
            <div className="p-6 pb-0">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="stock">Stock Report</TabsTrigger>
                <TabsTrigger value="sales">Sales Report</TabsTrigger>
                <TabsTrigger value="purchase">Purchase Report</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="stock" className="p-6 pt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Current Inventory Levels</h3>
                <StockReportTable />
              </div>
            </TabsContent>
            
            <TabsContent value="sales" className="p-6 pt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Sales Performance</h3>
                <SalesReportTable />
              </div>
            </TabsContent>
            
            <TabsContent value="purchase" className="p-6 pt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Purchase Order Status</h3>
                <PurchaseReportTable />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;