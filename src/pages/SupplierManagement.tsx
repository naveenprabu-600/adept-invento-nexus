import React, { useState } from 'react';
import { Search, Plus, Edit, Eye, MoreHorizontal, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Apple Inc.',
    contactPerson: 'Tim Cook',
    phone: '+1-408-996-1010',
    email: 'contact@apple.com',
    address: 'One Apple Park Way',
    city: 'Cupertino, CA',
    status: 'Active',
    createdAt: '2023-01-15'
  },
  {
    id: '2',
    name: 'Samsung Electronics',
    contactPerson: 'Jay Y. Lee',
    phone: '+82-2-2255-0114',
    email: 'contact@samsung.com',
    address: '129 Samsung-ro, Yeongtong-gu',
    city: 'Suwon-si, South Korea',
    status: 'Active',
    createdAt: '2023-02-20'
  },
  {
    id: '3',
    name: 'Fresh Farms Co.',
    contactPerson: 'John Farmer',
    phone: '+1-555-0123',
    email: 'orders@freshfarms.com',
    address: '456 Farm Road',
    city: 'Sacramento, CA',
    status: 'Active',
    createdAt: '2023-03-10'
  },
  {
    id: '4',
    name: 'Tech Solutions Ltd.',
    contactPerson: 'Sarah Tech',
    phone: '+1-555-0456',
    email: 'info@techsolutions.com',
    address: '789 Innovation Ave',
    city: 'Austin, TX',
    status: 'Inactive',
    createdAt: '2023-04-05'
  }
];

const SupplierManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    status: 'Active' as 'Active' | 'Inactive'
  });

  const filteredSuppliers = mockSuppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || supplier.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    return status === 'Active' ? 'default' : 'secondary';
  };

  const handleAddSupplier = () => {
    console.log('Adding supplier:', newSupplier);
    setIsAddModalOpen(false);
    setNewSupplier({
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      status: 'Active'
    });
  };

  const handleEditSupplier = () => {
    console.log('Updating supplier:', selectedSupplier);
    setIsEditModalOpen(false);
    setSelectedSupplier(null);
  };

  const openEditModal = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsEditModalOpen(true);
  };

  const openViewModal = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsViewModalOpen(true);
  };

  const SupplierForm = ({ supplier, onSubmit, isEdit = false }: {
    supplier: any;
    onSubmit: () => void;
    isEdit?: boolean;
  }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Company Name *</Label>
          <Input
            id="name"
            value={supplier.name}
            onChange={(e) => isEdit ? 
              setSelectedSupplier({...selectedSupplier!, name: e.target.value}) :
              setNewSupplier({...supplier, name: e.target.value})
            }
            placeholder="Enter company name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactPerson">Contact Person *</Label>
          <Input
            id="contactPerson"
            value={supplier.contactPerson}
            onChange={(e) => isEdit ? 
              setSelectedSupplier({...selectedSupplier!, contactPerson: e.target.value}) :
              setNewSupplier({...supplier, contactPerson: e.target.value})
            }
            placeholder="Enter contact person name"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            value={supplier.phone}
            onChange={(e) => isEdit ? 
              setSelectedSupplier({...selectedSupplier!, phone: e.target.value}) :
              setNewSupplier({...supplier, phone: e.target.value})
            }
            placeholder="Enter phone number"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={supplier.email}
            onChange={(e) => isEdit ? 
              setSelectedSupplier({...selectedSupplier!, email: e.target.value}) :
              setNewSupplier({...supplier, email: e.target.value})
            }
            placeholder="Enter email address"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address *</Label>
        <Input
          id="address"
          value={supplier.address}
          onChange={(e) => isEdit ? 
            setSelectedSupplier({...selectedSupplier!, address: e.target.value}) :
            setNewSupplier({...supplier, address: e.target.value})
          }
          placeholder="Enter street address"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={supplier.city}
            onChange={(e) => isEdit ? 
              setSelectedSupplier({...selectedSupplier!, city: e.target.value}) :
              setNewSupplier({...supplier, city: e.target.value})
            }
            placeholder="Enter city"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={supplier.status}
            onValueChange={(value: 'Active' | 'Inactive') => isEdit ? 
              setSelectedSupplier({...selectedSupplier!, status: value}) :
              setNewSupplier({...supplier, status: value})
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background">
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => {
          if (isEdit) {
            setIsEditModalOpen(false);
            setSelectedSupplier(null);
          } else {
            setIsAddModalOpen(false);
          }
        }}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>
          {isEdit ? 'Update Supplier' : 'Add Supplier'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Supplier Management</h1>
          <p className="text-secondary-text">Manage supplier information and contacts</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
            </DialogHeader>
            <SupplierForm supplier={newSupplier} onSubmit={handleAddSupplier} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search Suppliers</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="search"
                placeholder="Search by name, contact, or email..."
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
              <SelectContent className="bg-background">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="bg-card rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-foreground">Company Name</TableHead>
              <TableHead className="text-foreground">Contact Person</TableHead>
              <TableHead className="text-foreground">Phone</TableHead>
              <TableHead className="text-foreground">Email</TableHead>
              <TableHead className="text-foreground">Address</TableHead>
              <TableHead className="text-foreground">Status</TableHead>
              <TableHead className="text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSuppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell className="font-medium text-foreground">
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-accent" />
                    <span>{supplier.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-secondary-text">{supplier.contactPerson}</TableCell>
                <TableCell className="text-secondary-text">{supplier.phone}</TableCell>
                <TableCell className="text-secondary-text">{supplier.email}</TableCell>
                <TableCell className="text-secondary-text max-w-xs truncate" title={`${supplier.address}, ${supplier.city}`}>
                  {supplier.address}, {supplier.city}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(supplier.status)}>
                    {supplier.status}
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
                      <DropdownMenuItem onClick={() => openViewModal(supplier)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditModal(supplier)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Supplier
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* View Supplier Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Supplier Details</DialogTitle>
          </DialogHeader>
          {selectedSupplier && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Company Name</Label>
                    <p className="text-foreground font-medium">{selectedSupplier.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Contact Person</Label>
                    <p className="text-foreground">{selectedSupplier.contactPerson}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Phone</Label>
                    <p className="text-foreground">{selectedSupplier.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Email</Label>
                    <p className="text-foreground">{selectedSupplier.email}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Address</Label>
                    <p className="text-foreground">{selectedSupplier.address}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">City</Label>
                    <p className="text-foreground">{selectedSupplier.city}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Status</Label>
                    <Badge variant={getStatusBadgeVariant(selectedSupplier.status)}>
                      {selectedSupplier.status}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Created At</Label>
                    <p className="text-foreground">{selectedSupplier.createdAt}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setIsViewModalOpen(false);
                  openEditModal(selectedSupplier);
                }}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Supplier
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Supplier Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
          </DialogHeader>
          {selectedSupplier && (
            <SupplierForm 
              supplier={selectedSupplier} 
              onSubmit={handleEditSupplier}
              isEdit={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupplierManagement;