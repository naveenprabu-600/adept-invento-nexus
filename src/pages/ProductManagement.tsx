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

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  unitOfMeasure: string;
  costPrice: number;
  sellingPrice: number;
  supplier: string;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  isPerishable: boolean;
  shelfLifeDays?: number;
  description?: string;
  barcode?: string;
  imageUrl?: string;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 14 Pro',
    sku: 'APL-IP14P-128',
    category: 'Electronics',
    unitOfMeasure: 'Unit',
    costPrice: 800,
    sellingPrice: 999,
    supplier: 'Apple Inc.',
    stockStatus: 'In Stock',
    isPerishable: false
  },
  {
    id: '2',
    name: 'Samsung Galaxy S23',
    sku: 'SAM-GS23-256',
    category: 'Electronics',
    unitOfMeasure: 'Unit',
    costPrice: 700,
    sellingPrice: 899,
    supplier: 'Samsung Electronics',
    stockStatus: 'Low Stock',
    isPerishable: false
  },
  {
    id: '3',
    name: 'Organic Bananas',
    sku: 'FRT-BAN-ORG',
    category: 'Food',
    unitOfMeasure: 'Kg',
    costPrice: 2.5,
    sellingPrice: 4.99,
    supplier: 'Fresh Farms Co.',
    stockStatus: 'In Stock',
    isPerishable: true,
    shelfLifeDays: 7
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
    barcode: '',
    category: '',
    unitOfMeasure: '',
    costPrice: '',
    sellingPrice: '',
    imageUrl: '',
    isPerishable: false,
    shelfLifeDays: '',
    supplier: '',
    warehouse: '',
    quantityOnHand: '',
    reorderPoint: '',
    minimumStock: ''
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
      barcode: '',
      category: '',
      unitOfMeasure: '',
      costPrice: '',
      sellingPrice: '',
      imageUrl: '',
      isPerishable: false,
      shelfLifeDays: '',
      supplier: '',
      warehouse: '',
      quantityOnHand: '',
      reorderPoint: '',
      minimumStock: ''
    });
  };

  const handleNewProductChange = (field: string, value: string | boolean) => {
    setNewProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditProductChange = (field: string, value: string | boolean | number) => {
    if (selectedProduct) {
      setSelectedProduct(prev => ({
        ...prev!,
        [field]: value
      }));
    }
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
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            value={product.name}
            onChange={(e) => isEdit ? 
              handleEditProductChange('name', e.target.value) :
              handleNewProductChange('name', e.target.value)
            }
            placeholder="Enter product name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sku">SKU *</Label>
          <Input
            id="sku"
            value={product.sku}
            onChange={(e) => isEdit ? 
              handleEditProductChange('sku', e.target.value) :
              handleNewProductChange('sku', e.target.value)
            }
            placeholder="Enter SKU"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={product.description}
          onChange={(e) => isEdit ? 
            handleEditProductChange('description', e.target.value) :
            handleNewProductChange('description', e.target.value)
          }
          placeholder="Enter product description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="barcode">Barcode</Label>
          <Input
            id="barcode"
            value={product.barcode}
            onChange={(e) => isEdit ? 
              handleEditProductChange('barcode', e.target.value) :
              handleNewProductChange('barcode', e.target.value)
            }
            placeholder="Enter barcode"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            value={product.category}
            onValueChange={(value) => isEdit ? 
              handleEditProductChange('category', value) :
              handleNewProductChange('category', value)
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
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="unitOfMeasure">Unit of Measure *</Label>
          <Select
            value={product.unitOfMeasure}
            onValueChange={(value) => isEdit ? 
              handleEditProductChange('unitOfMeasure', value) :
              handleNewProductChange('unitOfMeasure', value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              <SelectItem value="Unit">Unit</SelectItem>
              <SelectItem value="Kg">Kg</SelectItem>
              <SelectItem value="Liter">Liter</SelectItem>
              <SelectItem value="Meter">Meter</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="costPrice">Cost Price *</Label>
          <Input
            id="costPrice"
            type="number"
            value={product.costPrice}
            onChange={(e) => isEdit ? 
              handleEditProductChange('costPrice', parseFloat(e.target.value) || 0) :
              handleNewProductChange('costPrice', e.target.value)
            }
            placeholder="0.00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sellingPrice">Selling Price *</Label>
          <Input
            id="sellingPrice"
            type="number"
            value={product.sellingPrice}
            onChange={(e) => isEdit ? 
              handleEditProductChange('sellingPrice', parseFloat(e.target.value) || 0) :
              handleNewProductChange('sellingPrice', e.target.value)
            }
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          value={product.imageUrl}
          onChange={(e) => isEdit ? 
            handleEditProductChange('imageUrl', e.target.value) :
            handleNewProductChange('imageUrl', e.target.value)
          }
          placeholder="Enter image URL"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="supplier">Supplier *</Label>
        <Select
          value={product.supplier}
          onValueChange={(value) => isEdit ? 
            handleEditProductChange('supplier', value) :
            handleNewProductChange('supplier', value)
          }
        >
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

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isPerishable"
          checked={product.isPerishable}
          onCheckedChange={(checked) => isEdit ? 
            handleEditProductChange('isPerishable', checked as boolean) :
            handleNewProductChange('isPerishable', checked as boolean)
          }
        />
        <Label htmlFor="isPerishable">Is Perishable</Label>
      </div>

      {product.isPerishable && (
        <div className="space-y-2">
          <Label htmlFor="shelfLifeDays">Shelf Life (Days)</Label>
          <Input
            id="shelfLifeDays"
            type="number"
            value={product.shelfLifeDays}
            onChange={(e) => isEdit ? 
              handleEditProductChange('shelfLifeDays', parseInt(e.target.value) || 0) :
              handleNewProductChange('shelfLifeDays', e.target.value)
            }
            placeholder="Enter shelf life in days"
          />
        </div>
      )}

      {!isEdit && (
        <>
          <div className="border-t pt-4">
            <h4 className="text-lg font-medium text-foreground mb-4">Initial Inventory Details</h4>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="warehouse">Warehouse *</Label>
                <Select
                  value={product.warehouse}
                  onValueChange={(value) => handleNewProductChange('warehouse', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select warehouse" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="main">Main Warehouse</SelectItem>
                    <SelectItem value="secondary">Secondary Warehouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantityOnHand">Quantity on Hand</Label>
                  <Input
                    id="quantityOnHand"
                    type="number"
                    value={product.quantityOnHand}
                    onChange={(e) => handleNewProductChange('quantityOnHand', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reorderPoint">Reorder Point</Label>
                  <Input
                    id="reorderPoint"
                    type="number"
                    value={product.reorderPoint}
                    onChange={(e) => handleNewProductChange('reorderPoint', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minimumStock">Minimum Stock</Label>
                  <Input
                    id="minimumStock"
                    type="number"
                    value={product.minimumStock}
                    onChange={(e) => handleNewProductChange('minimumStock', e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => isEdit ? setIsEditModalOpen(false) : setIsAddModalOpen(false)}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>
          {isEdit ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </div>
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
              <TableHead className="text-foreground">Product Name</TableHead>
              <TableHead className="text-foreground">SKU</TableHead>
              <TableHead className="text-foreground">Category</TableHead>
              <TableHead className="text-foreground">Unit</TableHead>
              <TableHead className="text-foreground">Cost Price</TableHead>
              <TableHead className="text-foreground">Selling Price</TableHead>
              <TableHead className="text-foreground">Supplier</TableHead>
              <TableHead className="text-foreground">Status</TableHead>
              <TableHead className="text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium text-foreground">
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-accent" />
                    <span>{product.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-secondary-text">{product.sku}</TableCell>
                <TableCell className="text-secondary-text">{product.category}</TableCell>
                <TableCell className="text-secondary-text">{product.unitOfMeasure}</TableCell>
                <TableCell className="text-secondary-text">${product.costPrice.toFixed(2)}</TableCell>
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