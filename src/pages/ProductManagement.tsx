import React, { useState } from 'react';
import { Search, Plus, Package, Edit, Eye, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  primaryUoM: string;
  alternateUoM?: string;
  conversionFactor?: number;
  costPrice: number;
  sellingPrice: number;
  supplier: string;
  supplierSKU?: string;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  isPerishable: boolean;
  shelfLifeDays?: number;
  description?: string;
  countryOfOrigin?: string;
  imageUrl?: string;
  packagingType?: string;
  customAttributes?: Record<string, any>;
  costCurrency?: string;
  priceCurrency?: string;
  paymentTerms?: string;
  leadTimeDays?: number;
  minimumStock?: number;
  reorderPoint?: number;
  restockQuantity?: number;
  maximumStock?: number;
  defaultWarehouse?: string;
  defaultZone?: string;
  defaultBin?: string;
  isActive: boolean;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 14 Pro',
    sku: 'APL-IP14P-128',
    category: 'Electronics',
    primaryUoM: 'Unit',
    costPrice: 800,
    sellingPrice: 999,
    supplier: 'Apple Inc.',
    supplierSKU: 'APPL-14PRO-128',
    stockStatus: 'In Stock',
    isPerishable: false,
    costCurrency: 'USD',
    priceCurrency: 'USD',
    paymentTerms: 'Net 30',
    leadTimeDays: 14,
    minimumStock: 10,
    reorderPoint: 15,
    restockQuantity: 50,
    maximumStock: 100,
    defaultWarehouse: 'Main Warehouse',
    isActive: true,
    countryOfOrigin: 'China',
    packagingType: 'Box'
  },
  {
    id: '2',
    name: 'Samsung Galaxy S23',
    sku: 'SAM-GS23-256',
    category: 'Electronics',
    primaryUoM: 'Unit',
    costPrice: 700,
    sellingPrice: 899,
    supplier: 'Samsung Electronics',
    supplierSKU: 'SAM-S23-256G',
    stockStatus: 'Low Stock',
    isPerishable: false,
    costCurrency: 'USD',
    priceCurrency: 'USD',
    paymentTerms: 'Net 45',
    leadTimeDays: 21,
    minimumStock: 5,
    reorderPoint: 10,
    restockQuantity: 30,
    maximumStock: 75,
    defaultWarehouse: 'Main Warehouse',
    isActive: true,
    countryOfOrigin: 'South Korea',
    packagingType: 'Box'
  },
  {
    id: '3',
    name: 'Organic Bananas',
    sku: 'FRT-BAN-ORG',
    category: 'Food',
    primaryUoM: 'Kg',
    alternateUoM: 'Box',
    conversionFactor: 5,
    costPrice: 2.5,
    sellingPrice: 4.99,
    supplier: 'Fresh Farms Co.',
    supplierSKU: 'FF-BANANA-ORG',
    stockStatus: 'In Stock',
    isPerishable: true,
    shelfLifeDays: 7,
    costCurrency: 'USD',
    priceCurrency: 'USD',
    paymentTerms: 'Due on receipt',
    leadTimeDays: 3,
    minimumStock: 20,
    reorderPoint: 30,
    restockQuantity: 100,
    maximumStock: 200,
    defaultWarehouse: 'Cold Storage',
    isActive: true,
    countryOfOrigin: 'Ecuador',
    packagingType: 'Carton'
  }
];

const ProductManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [stockStatusFilter, setStockStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    sku: '',
    category: '',
    primaryUoM: '',
    alternateUoM: '',
    conversionFactor: '',
    countryOfOrigin: '',
    imageUrl: '',
    isPerishable: false,
    shelfLifeDays: '',
    packagingType: '',
    customAttributes: {},
    costPrice: '',
    costCurrency: 'USD',
    sellingPrice: '',
    priceCurrency: 'USD',
    supplier: '',
    supplierSKU: '',
    paymentTerms: '',
    leadTimeDays: '',
    minimumStock: '',
    reorderPoint: '',
    restockQuantity: '',
    maximumStock: '',
    defaultWarehouse: '',
    defaultZone: '',
    defaultBin: '',
    isActive: true
  });

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesSupplier = supplierFilter === 'all' || product.supplier === supplierFilter;
    const matchesStockStatus = stockStatusFilter === 'all' || product.stockStatus === stockStatusFilter;
    
    return matchesSearch && matchesCategory && matchesSupplier && matchesStockStatus;
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

  const handleAddProduct = () => {
    console.log('Adding product:', newProduct);
    setIsAddModalOpen(false);
    setNewProduct({
      name: '',
      description: '',
      sku: '',
      category: '',
      primaryUoM: '',
      alternateUoM: '',
      conversionFactor: '',
      countryOfOrigin: '',
      imageUrl: '',
      isPerishable: false,
      shelfLifeDays: '',
      packagingType: '',
      customAttributes: {},
      costPrice: '',
      costCurrency: 'USD',
      sellingPrice: '',
      priceCurrency: 'USD',
      supplier: '',
      supplierSKU: '',
      paymentTerms: '',
      leadTimeDays: '',
      minimumStock: '',
      reorderPoint: '',
      restockQuantity: '',
      maximumStock: '',
      defaultWarehouse: '',
      defaultZone: '',
      defaultBin: '',
      isActive: true
    });
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const ProductForm = ({ product, onSubmit, isEdit = false }: {
    product: any;
    onSubmit: () => void;
    isEdit?: boolean;
  }) => (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="general">General Information</TabsTrigger>
        <TabsTrigger value="pricing">Pricing Information</TabsTrigger>
        <TabsTrigger value="supplier">Supplier Information</TabsTrigger>
        <TabsTrigger value="inventory">Default Inventory</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sku">SKU *</Label>
            <Input
              id="sku"
              value={product.sku}
              onChange={(e) => isEdit ? 
                setSelectedProduct({...selectedProduct!, sku: e.target.value}) :
                setNewProduct({...product, sku: e.target.value})
              }
              placeholder="Enter SKU"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={product.name}
              onChange={(e) => isEdit ? 
                setSelectedProduct({...selectedProduct!, name: e.target.value}) :
                setNewProduct({...product, name: e.target.value})
              }
              placeholder="Enter product name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={product.description}
            onChange={(e) => isEdit ? 
              setSelectedProduct({...selectedProduct!, description: e.target.value}) :
              setNewProduct({...product, description: e.target.value})
            }
            placeholder="Enter product description"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            value={product.category}
            onValueChange={(value) => isEdit ? 
              setSelectedProduct({...selectedProduct!, category: value}) :
              setNewProduct({...product, category: value})
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Food">Food</SelectItem>
              <SelectItem value="Clothing">Clothing</SelectItem>
              <SelectItem value="Books">Books</SelectItem>
              <SelectItem value="Hardware">Hardware</SelectItem>
              <SelectItem value="Beauty">Beauty</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primaryUoM">Primary UoM *</Label>
            <Select
              value={product.primaryUoM}
              onValueChange={(value) => isEdit ? 
                setSelectedProduct({...selectedProduct!, primaryUoM: value}) :
                setNewProduct({...product, primaryUoM: value})
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="Unit">Unit</SelectItem>
                <SelectItem value="Bottle">Bottle</SelectItem>
                <SelectItem value="Kilogram">Kilogram</SelectItem>
                <SelectItem value="Liter">Liter</SelectItem>
                <SelectItem value="Meter">Meter</SelectItem>
                <SelectItem value="Piece">Piece</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="alternateUoM">Alternate UoM</Label>
            <Select
              value={product.alternateUoM}
              onValueChange={(value) => isEdit ? 
                setSelectedProduct({...selectedProduct!, alternateUoM: value}) :
                setNewProduct({...product, alternateUoM: value})
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select alternate unit" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="Box">Box</SelectItem>
                <SelectItem value="Case">Case</SelectItem>
                <SelectItem value="Pallet">Pallet</SelectItem>
                <SelectItem value="Carton">Carton</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {product.alternateUoM && (
            <div className="space-y-2">
              <Label htmlFor="conversionFactor">Conversion Factor *</Label>
              <Input
                id="conversionFactor"
                type="number"
                value={product.conversionFactor}
                onChange={(e) => isEdit ? 
                  setSelectedProduct({...selectedProduct!, conversionFactor: parseFloat(e.target.value)}) :
                  setNewProduct({...product, conversionFactor: e.target.value})
                }
                placeholder="e.g., 6 (1 Box = 6 Bottles)"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="countryOfOrigin">Country of Origin</Label>
            <Input
              id="countryOfOrigin"
              value={product.countryOfOrigin}
              onChange={(e) => isEdit ? 
                setSelectedProduct({...selectedProduct!, countryOfOrigin: e.target.value}) :
                setNewProduct({...product, countryOfOrigin: e.target.value})
              }
              placeholder="Enter country of origin"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="packagingType">Packaging Type</Label>
            <Select
              value={product.packagingType}
              onValueChange={(value) => isEdit ? 
                setSelectedProduct({...selectedProduct!, packagingType: value}) :
                setNewProduct({...product, packagingType: value})
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select packaging" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="Carton">Carton</SelectItem>
                <SelectItem value="Pallet">Pallet</SelectItem>
                <SelectItem value="Box">Box</SelectItem>
                <SelectItem value="Bag">Bag</SelectItem>
                <SelectItem value="Bottle">Bottle</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            value={product.imageUrl}
            onChange={(e) => isEdit ? 
              setSelectedProduct({...selectedProduct!, imageUrl: e.target.value}) :
              setNewProduct({...product, imageUrl: e.target.value})
            }
            placeholder="Enter image URL"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isPerishable"
            checked={product.isPerishable}
            onCheckedChange={(checked) => isEdit ? 
              setSelectedProduct({...selectedProduct!, isPerishable: checked as boolean}) :
              setNewProduct({...product, isPerishable: checked as boolean})
            }
          />
          <Label htmlFor="isPerishable">Is Perishable</Label>
        </div>

        {product.isPerishable && (
          <div className="space-y-2">
            <Label htmlFor="shelfLifeDays">Shelf Life (Days) *</Label>
            <Input
              id="shelfLifeDays"
              type="number"
              value={product.shelfLifeDays}
              onChange={(e) => isEdit ? 
                setSelectedProduct({...selectedProduct!, shelfLifeDays: parseInt(e.target.value)}) :
                setNewProduct({...product, shelfLifeDays: e.target.value})
              }
              placeholder="Enter shelf life in days"
            />
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            checked={product.isActive}
            onCheckedChange={(checked) => isEdit ? 
              setSelectedProduct({...selectedProduct!, isActive: checked}) :
              setNewProduct({...product, isActive: checked})
            }
          />
          <Label htmlFor="isActive">Product Status (Active)</Label>
        </div>
      </TabsContent>

      <TabsContent value="pricing" className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="costPrice">Unit Cost *</Label>
            <Input
              id="costPrice"
              type="number"
              step="0.01"
              value={product.costPrice}
              onChange={(e) => isEdit ? 
                setSelectedProduct({...selectedProduct!, costPrice: parseFloat(e.target.value)}) :
                setNewProduct({...product, costPrice: e.target.value})
              }
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="costCurrency">Cost Currency</Label>
            <Select
              value={product.costCurrency}
              onValueChange={(value) => isEdit ? 
                setSelectedProduct({...selectedProduct!, costCurrency: value}) :
                setNewProduct({...product, costCurrency: value})
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="INR">INR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sellingPrice">Unit Price *</Label>
            <Input
              id="sellingPrice"
              type="number"
              step="0.01"
              value={product.sellingPrice}
              onChange={(e) => isEdit ? 
                setSelectedProduct({...selectedProduct!, sellingPrice: parseFloat(e.target.value)}) :
                setNewProduct({...product, sellingPrice: e.target.value})
              }
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priceCurrency">Price Currency</Label>
            <Select
              value={product.priceCurrency}
              onValueChange={(value) => isEdit ? 
                setSelectedProduct({...selectedProduct!, priceCurrency: value}) :
                setNewProduct({...product, priceCurrency: value})
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="INR">INR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="supplier" className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="supplier">Supplier *</Label>
          <Select
            value={product.supplier}
            onValueChange={(value) => isEdit ? 
              setSelectedProduct({...selectedProduct!, supplier: value}) :
              setNewProduct({...product, supplier: value})
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select supplier" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              <SelectItem value="Apple Inc.">Apple Inc.</SelectItem>
              <SelectItem value="Samsung Electronics">Samsung Electronics</SelectItem>
              <SelectItem value="Fresh Farms Co.">Fresh Farms Co.</SelectItem>
              <SelectItem value="Tech Solutions Ltd.">Tech Solutions Ltd.</SelectItem>
              <SelectItem value="Global Trading Corp.">Global Trading Corp.</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="supplierSKU">Supplier SKU</Label>
          <Input
            id="supplierSKU"
            value={product.supplierSKU}
            onChange={(e) => isEdit ? 
              setSelectedProduct({...selectedProduct!, supplierSKU: e.target.value}) :
              setNewProduct({...product, supplierSKU: e.target.value})
            }
            placeholder="Enter supplier's SKU"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="paymentTerms">Payment Terms</Label>
            <Select
              value={product.paymentTerms}
              onValueChange={(value) => isEdit ? 
                setSelectedProduct({...selectedProduct!, paymentTerms: value}) :
                setNewProduct({...product, paymentTerms: value})
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment terms" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="Net 30">Net 30</SelectItem>
                <SelectItem value="Net 45">Net 45</SelectItem>
                <SelectItem value="Net 60">Net 60</SelectItem>
                <SelectItem value="Due on receipt">Due on receipt</SelectItem>
                <SelectItem value="Cash on delivery">Cash on delivery</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="leadTimeDays">Lead Time (Days)</Label>
            <Input
              id="leadTimeDays"
              type="number"
              value={product.leadTimeDays}
              onChange={(e) => isEdit ? 
                setSelectedProduct({...selectedProduct!, leadTimeDays: parseInt(e.target.value)}) :
                setNewProduct({...product, leadTimeDays: e.target.value})
              }
              placeholder="Enter lead time in days"
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="inventory" className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="minimumStock">Minimum Stock</Label>
            <Input
              id="minimumStock"
              type="number"
              value={product.minimumStock}
              onChange={(e) => isEdit ? 
                setSelectedProduct({...selectedProduct!, minimumStock: parseInt(e.target.value)}) :
                setNewProduct({...product, minimumStock: e.target.value})
              }
              placeholder="Enter minimum stock level"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reorderPoint">Reorder Point</Label>
            <Input
              id="reorderPoint"
              type="number"
              value={product.reorderPoint}
              onChange={(e) => isEdit ? 
                setSelectedProduct({...selectedProduct!, reorderPoint: parseInt(e.target.value)}) :
                setNewProduct({...product, reorderPoint: e.target.value})
              }
              placeholder="Enter reorder point"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="restockQuantity">Restock Quantity</Label>
            <Input
              id="restockQuantity"
              type="number"
              value={product.restockQuantity}
              onChange={(e) => isEdit ? 
                setSelectedProduct({...selectedProduct!, restockQuantity: parseInt(e.target.value)}) :
                setNewProduct({...product, restockQuantity: e.target.value})
              }
              placeholder="Enter restock quantity"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maximumStock">Maximum Stock</Label>
            <Input
              id="maximumStock"
              type="number"
              value={product.maximumStock}
              onChange={(e) => isEdit ? 
                setSelectedProduct({...selectedProduct!, maximumStock: parseInt(e.target.value)}) :
                setNewProduct({...product, maximumStock: e.target.value})
              }
              placeholder="Enter maximum stock level"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="defaultWarehouse">Default Warehouse</Label>
          <Select
            value={product.defaultWarehouse}
            onValueChange={(value) => isEdit ? 
              setSelectedProduct({...selectedProduct!, defaultWarehouse: value}) :
              setNewProduct({...product, defaultWarehouse: value})
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select default warehouse" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              <SelectItem value="Main Warehouse">Main Warehouse</SelectItem>
              <SelectItem value="Secondary Warehouse">Secondary Warehouse</SelectItem>
              <SelectItem value="Cold Storage">Cold Storage</SelectItem>
              <SelectItem value="Distribution Center">Distribution Center</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="defaultZone">Default Zone</Label>
            <Select
              value={product.defaultZone}
              onValueChange={(value) => isEdit ? 
                setSelectedProduct({...selectedProduct!, defaultZone: value}) :
                setNewProduct({...product, defaultZone: value})
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select default zone" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="Zone A">Zone A</SelectItem>
                <SelectItem value="Zone B">Zone B</SelectItem>
                <SelectItem value="Zone C">Zone C</SelectItem>
                <SelectItem value="Receiving Zone">Receiving Zone</SelectItem>
                <SelectItem value="Shipping Zone">Shipping Zone</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="defaultBin">Default Bin</Label>
            <Select
              value={product.defaultBin}
              onValueChange={(value) => isEdit ? 
                setSelectedProduct({...selectedProduct!, defaultBin: value}) :
                setNewProduct({...product, defaultBin: value})
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select default bin" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="Bin-A01">Bin-A01</SelectItem>
                <SelectItem value="Bin-A02">Bin-A02</SelectItem>
                <SelectItem value="Bin-B01">Bin-B01</SelectItem>
                <SelectItem value="Bin-B02">Bin-B02</SelectItem>
                <SelectItem value="Bin-C01">Bin-C01</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </TabsContent>

      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="outline" onClick={() => isEdit ? setIsEditModalOpen(false) : setIsAddModalOpen(false)}>
          Cancel
        </Button>
        <Button onClick={onSubmit} className="bg-primary hover:bg-primary-hover">
          {isEdit ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </Tabs>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Product Management</h1>
          <p className="text-secondary-text">Manage products, suppliers, and categories</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <ProductForm product={newProduct} onSubmit={handleAddProduct} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search Products</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="search"
                placeholder="Search by name or SKU..."
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
              <SelectContent className="bg-background">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Clothing">Clothing</SelectItem>
                <SelectItem value="Books">Books</SelectItem>
              </SelectContent>
            </Select>
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

      {/* Products Table */}
      <div className="bg-card rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-foreground">SKU</TableHead>
              <TableHead className="text-foreground">Name</TableHead>
              <TableHead className="text-foreground">Category</TableHead>
              <TableHead className="text-foreground">Primary UoM</TableHead>
              <TableHead className="text-foreground">Selling Price</TableHead>
              <TableHead className="text-foreground">Supplier</TableHead>
              <TableHead className="text-foreground">Status</TableHead>
              <TableHead className="text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium text-foreground">{product.sku}</TableCell>
                <TableCell className="text-foreground">
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-accent" />
                    <span>{product.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-secondary-text">{product.category}</TableCell>
                <TableCell className="text-secondary-text">{product.primaryUoM}</TableCell>
                <TableCell className="text-secondary-text">${product.sellingPrice.toFixed(2)}</TableCell>
                <TableCell className="text-secondary-text">{product.supplier}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(product.stockStatus)}>
                    {product.stockStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-background">
                      <DropdownMenuItem onClick={() => console.log('View', product.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(product)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Product
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Product Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <ProductForm 
              product={selectedProduct} 
              onSubmit={() => {
                console.log('Updating product:', selectedProduct);
                setIsEditModalOpen(false);
              }}
              isEdit={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement;