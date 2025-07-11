import React, { useState } from 'react';
import { Search, Package, Edit, Plus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

interface InventoryItem {
  id: string;
  productName: string;
  warehouse: string;
  quantityOnHand: number;
  reorderPoint: number;
  minimumStock: number;
  lastUpdated: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

interface ProductBatch {
  id: string;
  productName: string;
  batchNumber: string;
  quantity: number;
  expiryDate: string;
  warehouse: string;
  isExpired: boolean;
}

const mockInventory: InventoryItem[] = [
  {
    id: '1',
    productName: 'iPhone 14 Pro',
    warehouse: 'Main Warehouse',
    quantityOnHand: 45,
    reorderPoint: 20,
    minimumStock: 10,
    lastUpdated: '2024-01-15 10:30',
    status: 'In Stock'
  },
  {
    id: '2',
    productName: 'Samsung Galaxy S23',
    warehouse: 'Main Warehouse',
    quantityOnHand: 15,
    reorderPoint: 20,
    minimumStock: 10,
    lastUpdated: '2024-01-14 14:20',
    status: 'Low Stock'
  },
  {
    id: '3',
    productName: 'Organic Bananas',
    warehouse: 'Secondary Warehouse',
    quantityOnHand: 0,
    reorderPoint: 50,
    minimumStock: 20,
    lastUpdated: '2024-01-13 09:15',
    status: 'Out of Stock'
  }
];

const mockBatches: ProductBatch[] = [
  {
    id: '1',
    productName: 'Organic Bananas',
    batchNumber: 'BAN-2024-001',
    quantity: 100,
    expiryDate: '2024-01-25',
    warehouse: 'Secondary Warehouse',
    isExpired: false
  },
  {
    id: '2',
    productName: 'Fresh Milk',
    batchNumber: 'MLK-2024-002',
    quantity: 50,
    expiryDate: '2024-01-20',
    warehouse: 'Main Warehouse',
    isExpired: false
  },
  {
    id: '3',
    productName: 'Bread Loaves',
    batchNumber: 'BRD-2024-003',
    quantity: 25,
    expiryDate: '2024-01-10',
    warehouse: 'Main Warehouse',
    isExpired: true
  }
];

const InventoryManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('all');
  const [stockStatusFilter, setStockStatusFilter] = useState('all');
  const [batchSearchTerm, setBatchSearchTerm] = useState('');
  const [batchWarehouseFilter, setBatchWarehouseFilter] = useState('all');
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [adjustmentData, setAdjustmentData] = useState({
    transactionType: '',
    quantityChange: '',
    reason: ''
  });

  const filteredInventory = mockInventory.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWarehouse = warehouseFilter === 'all' || item.warehouse === warehouseFilter;
    const matchesStatus = stockStatusFilter === 'all' || item.status === stockStatusFilter;
    
    return matchesSearch && matchesWarehouse && matchesStatus;
  });

  const filteredBatches = mockBatches.filter(batch => {
    const matchesSearch = batch.productName.toLowerCase().includes(batchSearchTerm.toLowerCase()) ||
                         batch.batchNumber.toLowerCase().includes(batchSearchTerm.toLowerCase());
    const matchesWarehouse = batchWarehouseFilter === 'all' || batch.warehouse === batchWarehouseFilter;
    
    return matchesSearch && matchesWarehouse;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'default';
      case 'Low Stock':
        return 'secondary';
      case 'Out of Stock':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const handleStockAdjustment = () => {
    console.log('Stock adjustment:', {
      item: selectedItem,
      adjustment: adjustmentData
    });
    setIsAdjustmentModalOpen(false);
    setAdjustmentData({
      transactionType: '',
      quantityChange: '',
      reason: ''
    });
    setSelectedItem(null);
  };

  const openAdjustmentModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsAdjustmentModalOpen(true);
  };

  const markBatchExpired = (batchId: string) => {
    console.log('Marking batch as expired:', batchId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-secondary-text">Manage stock levels and product batches</p>
        </div>
      </div>

      <Tabs defaultValue="inventory" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="inventory">Inventory Levels</TabsTrigger>
          <TabsTrigger value="batches">Product Batches</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-6">
          {/* Search and Filters */}
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search Products</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Search by product name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Warehouse</Label>
                <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Warehouses" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="all">All Warehouses</SelectItem>
                    <SelectItem value="Main Warehouse">Main Warehouse</SelectItem>
                    <SelectItem value="Secondary Warehouse">Secondary Warehouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Stock Status</Label>
                <Select value={stockStatusFilter} onValueChange={setStockStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="In Stock">In Stock</SelectItem>
                    <SelectItem value="Low Stock">Low Stock</SelectItem>
                    <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="bg-card rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-foreground">Product</TableHead>
                  <TableHead className="text-foreground">Warehouse</TableHead>
                  <TableHead className="text-foreground">Quantity on Hand</TableHead>
                  <TableHead className="text-foreground">Reorder Point</TableHead>
                  <TableHead className="text-foreground">Minimum Stock</TableHead>
                  <TableHead className="text-foreground">Last Updated</TableHead>
                  <TableHead className="text-foreground">Status</TableHead>
                  <TableHead className="text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-foreground">
                      <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4 text-accent" />
                        <span>{item.productName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-secondary-text">{item.warehouse}</TableCell>
                    <TableCell className="text-secondary-text">{item.quantityOnHand}</TableCell>
                    <TableCell className="text-secondary-text">{item.reorderPoint}</TableCell>
                    <TableCell className="text-secondary-text">{item.minimumStock}</TableCell>
                    <TableCell className="text-secondary-text">{item.lastUpdated}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openAdjustmentModal(item)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Adjust Stock
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="batches" className="space-y-6">
          {/* Batch Search and Filters */}
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="batchSearch">Search Batches</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="batchSearch"
                    placeholder="Search by product or batch number..."
                    value={batchSearchTerm}
                    onChange={(e) => setBatchSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Warehouse</Label>
                <Select value={batchWarehouseFilter} onValueChange={setBatchWarehouseFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Warehouses" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="all">All Warehouses</SelectItem>
                    <SelectItem value="Main Warehouse">Main Warehouse</SelectItem>
                    <SelectItem value="Secondary Warehouse">Secondary Warehouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Batches Table */}
          <div className="bg-card rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-foreground">Product</TableHead>
                  <TableHead className="text-foreground">Batch Number</TableHead>
                  <TableHead className="text-foreground">Quantity</TableHead>
                  <TableHead className="text-foreground">Expiry Date</TableHead>
                  <TableHead className="text-foreground">Warehouse</TableHead>
                  <TableHead className="text-foreground">Status</TableHead>
                  <TableHead className="text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBatches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell className="font-medium text-foreground">
                      <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4 text-accent" />
                        <span>{batch.productName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-secondary-text">{batch.batchNumber}</TableCell>
                    <TableCell className="text-secondary-text">{batch.quantity}</TableCell>
                    <TableCell className="text-secondary-text">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{batch.expiryDate}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-secondary-text">{batch.warehouse}</TableCell>
                    <TableCell>
                      <Badge variant={batch.isExpired ? 'destructive' : 'default'}>
                        {batch.isExpired ? 'Expired' : 'Active'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {!batch.isExpired && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markBatchExpired(batch.id)}
                        >
                          Mark Expired
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Stock Adjustment Modal */}
      <Dialog open={isAdjustmentModalOpen} onOpenChange={setIsAdjustmentModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Stock Adjustment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedItem && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium text-foreground">{selectedItem.productName}</h4>
                <p className="text-sm text-secondary-text">{selectedItem.warehouse}</p>
                <p className="text-sm text-secondary-text">Current Stock: {selectedItem.quantityOnHand}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label>Transaction Type</Label>
              <Select
                value={adjustmentData.transactionType}
                onValueChange={(value) => setAdjustmentData({...adjustmentData, transactionType: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select transaction type" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <SelectItem value="ADJUSTMENT_ADD">Adjustment Add</SelectItem>
                  <SelectItem value="ADJUSTMENT_SUBTRACT">Adjustment Subtract</SelectItem>
                  <SelectItem value="RETURN">Return</SelectItem>
                  <SelectItem value="EXPIRED">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quantity Change</Label>
              <Input
                type="number"
                placeholder="Enter quantity"
                value={adjustmentData.quantityChange}
                onChange={(e) => setAdjustmentData({...adjustmentData, quantityChange: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Reason</Label>
              <Textarea
                placeholder="Enter reason for adjustment"
                value={adjustmentData.reason}
                onChange={(e) => setAdjustmentData({...adjustmentData, reason: e.target.value})}
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAdjustmentModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleStockAdjustment}>
                Submit Adjustment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryManagement;