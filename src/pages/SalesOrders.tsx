import React, { useState } from 'react';
import { Search, Eye, Plus, Truck, Calendar, User, Package, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

interface SalesOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  totalAmount: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdBy: string;
  shippingAddress: string;
  items: SalesOrderItem[];
}

interface SalesOrderItem {
  id: string;
  productName: string;
  productId: string;
  quantity: number;
  priceAtSale: number;
  totalCost: number;
  availableStock: number;
}

interface Product {
  id: string;
  name: string;
  sellingPrice: number;
  quantityOnHand: number;
  reorderPoint: number;
}

const mockSalesOrders: SalesOrder[] = [
  {
    id: 'SO-2024-001',
    customerName: 'John Customer',
    customerEmail: 'john@customer.com',
    orderDate: '2024-01-15',
    totalAmount: 2997,
    status: 'SHIPPED',
    createdBy: 'Sales Rep 1',
    shippingAddress: '123 Main St, New York, NY 10001',
    items: [
      {
        id: '1',
        productName: 'iPhone 14 Pro',
        productId: 'prod-1',
        quantity: 3,
        priceAtSale: 999,
        totalCost: 2997,
        availableStock: 15
      }
    ]
  },
  {
    id: 'SO-2024-002',
    customerName: 'Sarah Business',
    customerEmail: 'sarah@business.com',
    orderDate: '2024-01-14',
    totalAmount: 1798,
    status: 'PROCESSING',
    createdBy: 'Sales Rep 1',
    shippingAddress: '456 Corporate Blvd, Los Angeles, CA 90210',
    items: [
      {
        id: '2',
        productName: 'Samsung Galaxy S23',
        productId: 'prod-2',
        quantity: 2,
        priceAtSale: 899,
        totalCost: 1798,
        availableStock: 8
      }
    ]
  }
];

const mockProducts: Product[] = [
  { id: 'prod-1', name: 'iPhone 14 Pro', sellingPrice: 999, quantityOnHand: 15, reorderPoint: 5 },
  { id: 'prod-2', name: 'Samsung Galaxy S23', sellingPrice: 899, quantityOnHand: 8, reorderPoint: 3 },
  { id: 'prod-3', name: 'MacBook Air', sellingPrice: 1299, quantityOnHand: 2, reorderPoint: 2 },
];

const SalesOrders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSO, setSelectedSO] = useState<SalesOrder | null>(null);
  
  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<SalesOrderItem[]>([]);

  const filteredSOs = mockSalesOrders.filter(so => {
    const matchesSearch = so.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         so.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         so.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || so.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'secondary';
      case 'PROCESSING':
        return 'default';
      case 'SHIPPED':
        return 'default';
      case 'DELIVERED':
        return 'default';
      case 'CANCELLED':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'text-secondary-text';
      case 'PROCESSING':
        return 'text-primary';
      case 'SHIPPED':
        return 'text-accent';
      case 'DELIVERED':
        return 'text-success';
      case 'CANCELLED':
        return 'text-destructive';
      default:
        return 'text-secondary-text';
    }
  };

  const getStockStatus = (quantity: number, reorderPoint: number) => {
    if (quantity === 0) return { text: 'Out of Stock', color: 'text-destructive' };
    if (quantity <= reorderPoint) return { text: 'Low Stock', color: 'text-warning' };
    return { text: 'Available', color: 'text-success' };
  };

  const handleStatusUpdate = (soId: string, newStatus: string) => {
    console.log('Updating status for SO:', soId, 'to:', newStatus);
    // In real app, this would update the sales order status
  };

  const addProductToOrder = (product: Product) => {
    const existingItem = selectedProducts.find(item => item.productId === product.id);
    if (existingItem) {
      setSelectedProducts(prev => prev.map(item => 
        item.productId === product.id 
          ? { ...item, quantity: item.quantity + 1, totalCost: (item.quantity + 1) * item.priceAtSale }
          : item
      ));
    } else {
      const newItem: SalesOrderItem = {
        id: Date.now().toString(),
        productName: product.name,
        productId: product.id,
        quantity: 1,
        priceAtSale: product.sellingPrice,
        totalCost: product.sellingPrice,
        availableStock: product.quantityOnHand
      };
      setSelectedProducts(prev => [...prev, newItem]);
    }
  };

  const updateProductQuantity = (productId: string, quantity: number) => {
    setSelectedProducts(prev => prev.map(item => 
      item.productId === productId 
        ? { ...item, quantity, totalCost: quantity * item.priceAtSale }
        : item
    ));
  };

  const removeProductFromOrder = (productId: string) => {
    setSelectedProducts(prev => prev.filter(item => item.productId !== productId));
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((total, item) => total + item.totalCost, 0);
  };

  const resetForm = () => {
    setCustomerName('');
    setCustomerEmail('');
    setShippingAddress('');
    setSelectedProducts([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sales Orders</h1>
          <p className="text-secondary-text">Create and manage sales orders</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Sales Order
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search Orders</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="search"
                placeholder="Search by SO ID, customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="SHIPPED">Shipped</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Date Range</Label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue placeholder="All Dates" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Sales Orders Table */}
      <div className="bg-card rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-foreground">SO ID</TableHead>
              <TableHead className="text-foreground">Customer</TableHead>
              <TableHead className="text-foreground">Order Date</TableHead>
              <TableHead className="text-foreground">Total Amount</TableHead>
              <TableHead className="text-foreground">Status</TableHead>
              <TableHead className="text-foreground">Shipping Address</TableHead>
              <TableHead className="text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSOs.map((so) => (
              <TableRow key={so.id}>
                <TableCell className="font-medium text-foreground">{so.id}</TableCell>
                <TableCell className="text-secondary-text">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{so.customerName}</div>
                      <div className="text-sm text-muted-foreground">{so.customerEmail}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-secondary-text">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{so.orderDate}</span>
                  </div>
                </TableCell>
                <TableCell className="text-secondary-text">${so.totalAmount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(so.status)} className={getStatusColor(so.status)}>
                    {so.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-secondary-text max-w-xs truncate" title={so.shippingAddress}>
                  {so.shippingAddress}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedSO(so);
                        setIsViewModalOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {so.status === 'PROCESSING' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(so.id, 'SHIPPED')}
                      >
                        <Truck className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create Sales Order Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={(open) => {
        setIsCreateModalOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Sales Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Customer Name</Label>
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                />
              </div>
              <div className="space-y-2">
                <Label>Customer Email</Label>
                <Input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Enter customer email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Shipping Address</Label>
              <Textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Enter shipping address"
                rows={3}
              />
            </div>

            {/* Add Products */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-foreground">Add Products</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockProducts.map((product) => {
                  const stockStatus = getStockStatus(product.quantityOnHand, product.reorderPoint);
                  const isInOrder = selectedProducts.some(item => item.productId === product.id);
                  
                  return (
                    <div key={product.id} className="border border-border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-foreground">{product.name}</h5>
                        <Package className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-secondary-text">${product.sellingPrice.toFixed(2)}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">Stock:</span>
                        <span className={`text-sm ${stockStatus.color}`}>
                          {product.quantityOnHand} {stockStatus.text}
                        </span>
                        {product.quantityOnHand <= product.reorderPoint && (
                          <AlertTriangle className="w-4 h-4 text-warning" />
                        )}
                      </div>
                      <Button
                        variant={isInOrder ? "secondary" : "outline"}
                        size="sm"
                        className="w-full"
                        onClick={() => addProductToOrder(product)}
                        disabled={product.quantityOnHand === 0}
                      >
                        {isInOrder ? "Added" : "Add to Order"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Products */}
            {selectedProducts.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-foreground">Order Items</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Available Stock</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedProducts.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.productName}</TableCell>
                        <TableCell>${item.priceAtSale.toFixed(2)}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateProductQuantity(item.productId, parseInt(e.target.value) || 0)}
                            min="1"
                            max={item.availableStock}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <span className={item.availableStock <= 5 ? 'text-warning' : 'text-success'}>
                            {item.availableStock}
                          </span>
                        </TableCell>
                        <TableCell>${item.totalCost.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeProductFromOrder(item.productId)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="flex justify-end">
                  <div className="text-lg font-medium text-foreground">
                    Total Amount: ${calculateTotal().toFixed(2)}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  console.log('Creating sales order:', {
                    customerName,
                    customerEmail,
                    shippingAddress,
                    items: selectedProducts,
                    total: calculateTotal()
                  });
                  setIsCreateModalOpen(false);
                  resetForm();
                }}
                disabled={!customerName || !customerEmail || selectedProducts.length === 0}
              >
                Create Order
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View SO Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Sales Order Details</DialogTitle>
          </DialogHeader>
          {selectedSO && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">SO ID</Label>
                    <p className="text-foreground font-medium">{selectedSO.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Customer Name</Label>
                    <p className="text-foreground">{selectedSO.customerName}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Customer Email</Label>
                    <p className="text-foreground">{selectedSO.customerEmail}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Created By</Label>
                    <p className="text-foreground">{selectedSO.createdBy}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Order Date</Label>
                    <p className="text-foreground">{selectedSO.orderDate}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Status</Label>
                    <Badge variant={getStatusBadgeVariant(selectedSO.status)}>
                      {selectedSO.status}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Shipping Address</Label>
                    <p className="text-foreground">{selectedSO.shippingAddress}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-foreground mb-4">Order Items</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price at Sale</TableHead>
                      <TableHead>Total Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedSO.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.productName}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>${item.priceAtSale.toFixed(2)}</TableCell>
                        <TableCell>${item.totalCost.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="flex justify-end mt-4">
                  <div className="text-lg font-medium text-foreground">
                    Total Amount: ${selectedSO.totalAmount.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                {selectedSO.status === 'PENDING' && (
                  <Button onClick={() => handleStatusUpdate(selectedSO.id, 'PROCESSING')}>
                    Start Processing
                  </Button>
                )}
                {selectedSO.status === 'PROCESSING' && (
                  <Button onClick={() => handleStatusUpdate(selectedSO.id, 'SHIPPED')}>
                    <Truck className="w-4 h-4 mr-2" />
                    Mark as Shipped
                  </Button>
                )}
                {selectedSO.status === 'SHIPPED' && (
                  <Button onClick={() => handleStatusUpdate(selectedSO.id, 'DELIVERED')}>
                    Mark as Delivered
                  </Button>
                )}
                <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalesOrders;