import React, { useState } from 'react';
import { Search, Eye, Package, AlertTriangle, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  category: string;
  sellingPrice: number;
  quantityOnHand: number;
  reorderPoint: number;
  minimumStock: number;
  imageUrl?: string;
  isPerishable: boolean;
  unitOfMeasure: string;
  supplier: string;
  warehouses: ProductWarehouse[];
}

interface ProductWarehouse {
  warehouseName: string;
  quantityOnHand: number;
  reorderPoint: number;
  minimumStock: number;
}

const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'iPhone 14 Pro',
    description: 'Latest Apple iPhone with advanced camera system and A16 Bionic chip',
    sku: 'APPLE-IP14P-128',
    category: 'Electronics',
    sellingPrice: 999,
    quantityOnHand: 15,
    reorderPoint: 5,
    minimumStock: 2,
    isPerishable: false,
    unitOfMeasure: 'Unit',
    supplier: 'Apple Inc.',
    warehouses: [
      { warehouseName: 'Main Warehouse', quantityOnHand: 10, reorderPoint: 3, minimumStock: 1 },
      { warehouseName: 'North Warehouse', quantityOnHand: 5, reorderPoint: 2, minimumStock: 1 }
    ]
  },
  {
    id: 'prod-2',
    name: 'Samsung Galaxy S23',
    description: 'Premium Android smartphone with excellent display and camera',
    sku: 'SAMSUNG-GS23-256',
    category: 'Electronics',
    sellingPrice: 899,
    quantityOnHand: 8,
    reorderPoint: 3,
    minimumStock: 1,
    isPerishable: false,
    unitOfMeasure: 'Unit',
    supplier: 'Samsung Electronics',
    warehouses: [
      { warehouseName: 'Main Warehouse', quantityOnHand: 5, reorderPoint: 2, minimumStock: 1 },
      { warehouseName: 'North Warehouse', quantityOnHand: 3, reorderPoint: 1, minimumStock: 0 }
    ]
  },
  {
    id: 'prod-3',
    name: 'MacBook Air',
    description: 'Lightweight laptop with M2 chip and all-day battery life',
    sku: 'APPLE-MBA-M2-256',
    category: 'Computers',
    sellingPrice: 1299,
    quantityOnHand: 2,
    reorderPoint: 2,
    minimumStock: 1,
    isPerishable: false,
    unitOfMeasure: 'Unit',
    supplier: 'Apple Inc.',
    warehouses: [
      { warehouseName: 'Main Warehouse', quantityOnHand: 2, reorderPoint: 2, minimumStock: 1 },
      { warehouseName: 'North Warehouse', quantityOnHand: 0, reorderPoint: 0, minimumStock: 0 }
    ]
  },
  {
    id: 'prod-4',
    name: 'Organic Bananas',
    description: 'Fresh organic bananas from local farms',
    sku: 'PRODUCE-BANANA-ORG',
    category: 'Produce',
    sellingPrice: 4.99,
    quantityOnHand: 50,
    reorderPoint: 10,
    minimumStock: 5,
    isPerishable: true,
    unitOfMeasure: 'Bunch',
    supplier: 'Fresh Farms Co.',
    warehouses: [
      { warehouseName: 'Main Warehouse', quantityOnHand: 30, reorderPoint: 6, minimumStock: 3 },
      { warehouseName: 'North Warehouse', quantityOnHand: 20, reorderPoint: 4, minimumStock: 2 }
    ]
  }
];

const categories = ['All', 'Electronics', 'Computers', 'Produce', 'Clothing', 'Home & Garden'];

const ProductCatalog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (quantityOnHand: number, reorderPoint: number, minimumStock: number) => {
    if (quantityOnHand === 0) {
      return { text: 'Out of Stock', color: 'text-destructive', icon: AlertTriangle };
    }
    if (quantityOnHand <= minimumStock) {
      return { text: 'Critical', color: 'text-destructive', icon: AlertTriangle };
    }
    if (quantityOnHand <= reorderPoint) {
      return { text: 'Low Stock', color: 'text-warning', icon: AlertTriangle };
    }
    return { text: 'In Stock', color: 'text-success', icon: CheckCircle };
  };

  const getTotalStock = (warehouses: ProductWarehouse[]) => {
    return warehouses.reduce((total, warehouse) => total + warehouse.quantityOnHand, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Product Catalog</h1>
          <p className="text-secondary-text">Browse available products and check stock details</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search Products</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="search"
                placeholder="Search by name, SKU, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-card rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-foreground">Product</TableHead>
              <TableHead className="text-foreground">SKU</TableHead>
              <TableHead className="text-foreground">Category</TableHead>
              <TableHead className="text-foreground">Selling Price</TableHead>
              <TableHead className="text-foreground">Stock Status</TableHead>
              <TableHead className="text-foreground">Total Quantity</TableHead>
              <TableHead className="text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => {
              const totalStock = getTotalStock(product.warehouses);
              const stockStatus = getStockStatus(totalStock, product.reorderPoint, product.minimumStock);
              const StatusIcon = stockStatus.icon;
              
              return (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Package className="w-8 h-8 text-muted-foreground" />
                      <div>
                        <div className="font-medium text-foreground">{product.name}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-secondary-text">{product.sku}</TableCell>
                  <TableCell className="text-secondary-text">
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell className="text-secondary-text font-medium">
                    ${product.sellingPrice.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <StatusIcon className={`w-4 h-4 ${stockStatus.color}`} />
                      <span className={`text-sm ${stockStatus.color}`}>
                        {stockStatus.text}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-secondary-text">
                    <span className={totalStock <= product.reorderPoint ? 'font-medium text-warning' : ''}>
                      {totalStock} {product.unitOfMeasure}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsViewModalOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Product Detail Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-6">
              {/* Basic Product Info */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Product Name</Label>
                    <p className="text-foreground font-medium text-lg">{selectedProduct.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Description</Label>
                    <p className="text-foreground">{selectedProduct.description}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">SKU</Label>
                    <p className="text-foreground font-mono">{selectedProduct.sku}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Category</Label>
                    <Badge variant="outline">{selectedProduct.category}</Badge>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Selling Price</Label>
                    <p className="text-foreground font-medium text-lg">
                      ${selectedProduct.sellingPrice.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Unit of Measure</Label>
                    <p className="text-foreground">{selectedProduct.unitOfMeasure}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Supplier</Label>
                    <p className="text-foreground">{selectedProduct.supplier}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Product Type</Label>
                    <Badge variant={selectedProduct.isPerishable ? "destructive" : "secondary"}>
                      {selectedProduct.isPerishable ? "Perishable" : "Non-Perishable"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Stock Information by Warehouse */}
              <div>
                <h4 className="text-lg font-medium text-foreground mb-4">Stock Information by Warehouse</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Warehouse</TableHead>
                      <TableHead>Quantity on Hand</TableHead>
                      <TableHead>Reorder Point</TableHead>
                      <TableHead>Minimum Stock</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedProduct.warehouses.map((warehouse, index) => {
                      const stockStatus = getStockStatus(
                        warehouse.quantityOnHand, 
                        warehouse.reorderPoint, 
                        warehouse.minimumStock
                      );
                      const StatusIcon = stockStatus.icon;
                      
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{warehouse.warehouseName}</TableCell>
                          <TableCell>
                            <span className={warehouse.quantityOnHand <= warehouse.reorderPoint ? 'font-medium text-warning' : ''}>
                              {warehouse.quantityOnHand}
                            </span>
                          </TableCell>
                          <TableCell>{warehouse.reorderPoint}</TableCell>
                          <TableCell>{warehouse.minimumStock}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <StatusIcon className={`w-4 h-4 ${stockStatus.color}`} />
                              <span className={`text-sm ${stockStatus.color}`}>
                                {stockStatus.text}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Stock Across All Warehouses:</span>
                    <span className="font-medium text-foreground">
                      {getTotalStock(selectedProduct.warehouses)} {selectedProduct.unitOfMeasure}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
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

export default ProductCatalog;