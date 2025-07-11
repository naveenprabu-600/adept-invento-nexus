import React, { useState } from 'react';
import { Search, Plus, Eye, Edit, Package, Calendar, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  orderDate: string;
  expectedDate: string;
  totalAmount: number;
  status: 'DRAFT' | 'ORDERED' | 'RECEIVED' | 'CANCELLED';
  createdBy: string;
  items: PurchaseOrderItem[];
}

interface PurchaseOrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'PO-2024-001',
    supplierId: '1',
    supplierName: 'Apple Inc.',
    orderDate: '2024-01-15',
    expectedDate: '2024-01-25',
    totalAmount: 15000,
    status: 'ORDERED',
    createdBy: 'John Manager',
    items: [
      {
        id: '1',
        productName: 'iPhone 14 Pro',
        quantity: 15,
        unitCost: 800,
        totalCost: 12000
      },
      {
        id: '2',
        productName: 'iPad Air',
        quantity: 10,
        unitCost: 300,
        totalCost: 3000
      }
    ]
  },
  {
    id: 'PO-2024-002',
    supplierId: '2',
    supplierName: 'Samsung Electronics',
    orderDate: '2024-01-14',
    expectedDate: '2024-01-24',
    totalAmount: 8500,
    status: 'DRAFT',
    createdBy: 'Sarah Manager',
    items: [
      {
        id: '3',
        productName: 'Samsung Galaxy S23',
        quantity: 10,
        unitCost: 700,
        totalCost: 7000
      },
      {
        id: '4',
        productName: 'Galaxy Watch',
        quantity: 5,
        unitCost: 300,
        totalCost: 1500
      }
    ]
  },
  {
    id: 'PO-2024-003',
    supplierId: '3',
    supplierName: 'Fresh Farms Co.',
    orderDate: '2024-01-13',
    expectedDate: '2024-01-16',
    totalAmount: 1250,
    status: 'RECEIVED',
    createdBy: 'Mike Manager',
    items: [
      {
        id: '5',
        productName: 'Organic Bananas',
        quantity: 500,
        unitCost: 2.5,
        totalCost: 1250
      }
    ]
  }
];

const PurchaseOrders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [newPO, setNewPO] = useState({
    supplier: '',
    orderDate: new Date().toISOString().split('T')[0],
    expectedDate: '',
    warehouse: '',
    items: [] as any[]
  });
  const [newItem, setNewItem] = useState({
    product: '',
    quantity: '',
    unitCost: ''
  });

  const filteredPOs = mockPurchaseOrders.filter(po => {
    const matchesSearch = po.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         po.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSupplier = supplierFilter === 'all' || po.supplierName === supplierFilter;
    const matchesStatus = statusFilter === 'all' || po.status === statusFilter;
    
    return matchesSearch && matchesSupplier && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'secondary';
      case 'ORDERED':
        return 'default';
      case 'RECEIVED':
        return 'default';
      case 'CANCELLED':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'text-secondary-text';
      case 'ORDERED':
        return 'text-primary';
      case 'RECEIVED':
        return 'text-accent';
      case 'CANCELLED':
        return 'text-destructive';
      default:
        return 'text-secondary-text';
    }
  };

  const handleCreatePO = () => {
    console.log('Creating PO:', newPO);
    setIsCreateModalOpen(false);
    setNewPO({
      supplier: '',
      orderDate: new Date().toISOString().split('T')[0],
      expectedDate: '',
      warehouse: '',
      items: []
    });
  };

  const addItemToPO = () => {
    if (newItem.product && newItem.quantity && newItem.unitCost) {
      const totalCost = parseFloat(newItem.quantity) * parseFloat(newItem.unitCost);
      setNewPO({
        ...newPO,
        items: [...newPO.items, {
          product: newItem.product,
          quantity: parseFloat(newItem.quantity),
          unitCost: parseFloat(newItem.unitCost),
          totalCost
        }]
      });
      setNewItem({ product: '', quantity: '', unitCost: '' });
    }
  };

  const removeItemFromPO = (index: number) => {
    setNewPO({
      ...newPO,
      items: newPO.items.filter((_, i) => i !== index)
    });
  };

  const getTotalAmount = () => {
    return newPO.items.reduce((total, item) => total + item.totalCost, 0);
  };

  const handleReceiveStock = (poId: string) => {
    console.log('Receiving stock for PO:', poId);
    // In real app, this would update the PO status to RECEIVED and update inventory
  };

  const handleCancelPO = (poId: string) => {
    console.log('Cancelling PO:', poId);
    // In real app, this would update the PO status to CANCELLED
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Purchase Orders</h1>
          <p className="text-secondary-text">Create and manage purchase orders</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Create Purchase Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Purchase Order</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Supplier *</Label>
                  <Select value={newPO.supplier} onValueChange={(value) => setNewPO({...newPO, supplier: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      <SelectItem value="Apple Inc.">Apple Inc.</SelectItem>
                      <SelectItem value="Samsung Electronics">Samsung Electronics</SelectItem>
                      <SelectItem value="Fresh Farms Co.">Fresh Farms Co.</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Warehouse</Label>
                  <Select value={newPO.warehouse} onValueChange={(value) => setNewPO({...newPO, warehouse: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select warehouse" />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      <SelectItem value="main">Main Warehouse</SelectItem>
                      <SelectItem value="secondary">Secondary Warehouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Order Date</Label>
                  <Input
                    type="date"
                    value={newPO.orderDate}
                    onChange={(e) => setNewPO({...newPO, orderDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Expected Date</Label>
                  <Input
                    type="date"
                    value={newPO.expectedDate}
                    onChange={(e) => setNewPO({...newPO, expectedDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-lg font-medium text-foreground mb-4">Add Products</h4>
                
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label>Product</Label>
                    <Select value={newItem.product} onValueChange={(value) => setNewItem({...newItem, product: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent className="bg-background">
                        <SelectItem value="iPhone 14 Pro">iPhone 14 Pro</SelectItem>
                        <SelectItem value="Samsung Galaxy S23">Samsung Galaxy S23</SelectItem>
                        <SelectItem value="Organic Bananas">Organic Bananas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Unit Cost</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={newItem.unitCost}
                      onChange={(e) => setNewItem({...newItem, unitCost: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>&nbsp;</Label>
                    <Button onClick={addItemToPO} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                </div>

                {newPO.items.length > 0 && (
                  <div className="space-y-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Unit Cost</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {newPO.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.product}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>${item.unitCost.toFixed(2)}</TableCell>
                            <TableCell>${item.totalCost.toFixed(2)}</TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeItemFromPO(index)}
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
                        Total Amount: ${getTotalAmount().toFixed(2)}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePO}>
                  Create Purchase Order
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search Orders</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="search"
                placeholder="Search by PO ID or supplier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Supplier</Label>
            <Select value={supplierFilter} onValueChange={setSupplierFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Suppliers" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="all">All Suppliers</SelectItem>
                <SelectItem value="Apple Inc.">Apple Inc.</SelectItem>
                <SelectItem value="Samsung Electronics">Samsung Electronics</SelectItem>
                <SelectItem value="Fresh Farms Co.">Fresh Farms Co.</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="ORDERED">Ordered</SelectItem>
                <SelectItem value="RECEIVED">Received</SelectItem>
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
              <SelectContent className="bg-background">
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Purchase Orders Table */}
      <div className="bg-card rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-foreground">PO ID</TableHead>
              <TableHead className="text-foreground">Supplier</TableHead>
              <TableHead className="text-foreground">Order Date</TableHead>
              <TableHead className="text-foreground">Expected Date</TableHead>
              <TableHead className="text-foreground">Total Amount</TableHead>
              <TableHead className="text-foreground">Status</TableHead>
              <TableHead className="text-foreground">Created By</TableHead>
              <TableHead className="text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPOs.map((po) => (
              <TableRow key={po.id}>
                <TableCell className="font-medium text-foreground">{po.id}</TableCell>
                <TableCell className="text-secondary-text">{po.supplierName}</TableCell>
                <TableCell className="text-secondary-text">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{po.orderDate}</span>
                  </div>
                </TableCell>
                <TableCell className="text-secondary-text">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{po.expectedDate}</span>
                  </div>
                </TableCell>
                <TableCell className="text-secondary-text">${po.totalAmount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(po.status)} className={getStatusColor(po.status)}>
                    {po.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-secondary-text">{po.createdBy}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedPO(po);
                        setIsViewModalOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {po.status === 'ORDERED' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReceiveStock(po.id)}
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

      {/* View PO Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Purchase Order Details</DialogTitle>
          </DialogHeader>
          {selectedPO && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">PO ID</Label>
                    <p className="text-foreground font-medium">{selectedPO.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Supplier</Label>
                    <p className="text-foreground">{selectedPO.supplierName}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Created By</Label>
                    <p className="text-foreground">{selectedPO.createdBy}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Order Date</Label>
                    <p className="text-foreground">{selectedPO.orderDate}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Expected Date</Label>
                    <p className="text-foreground">{selectedPO.expectedDate}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Status</Label>
                    <Badge variant={getStatusBadgeVariant(selectedPO.status)}>
                      {selectedPO.status}
                    </Badge>
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
                      <TableHead>Unit Cost</TableHead>
                      <TableHead>Total Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedPO.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.productName}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>${item.unitCost.toFixed(2)}</TableCell>
                        <TableCell>${item.totalCost.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="flex justify-end mt-4">
                  <div className="text-lg font-medium text-foreground">
                    Total Amount: ${selectedPO.totalAmount.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                {selectedPO.status === 'ORDERED' && (
                  <>
                    <Button variant="outline" onClick={() => handleCancelPO(selectedPO.id)}>
                      Cancel PO
                    </Button>
                    <Button onClick={() => handleReceiveStock(selectedPO.id)}>
                      <Truck className="w-4 h-4 mr-2" />
                      Receive Stock
                    </Button>
                  </>
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

export default PurchaseOrders;