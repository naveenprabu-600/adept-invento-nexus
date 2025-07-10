import React, { useState } from 'react';
import { Search, Filter, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data for audit trail
const mockAuditLogs = [
  {
    id: 1,
    timestamp: '2024-01-15 14:30:25',
    user: 'John Doe',
    actionType: 'IN',
    referenceType: 'PURCHASE_ORDER',
    referenceId: 'PO-001',
    quantityChange: '+50',
    product: 'Laptop Pro 15"',
    description: 'Stock received from purchase order'
  },
  {
    id: 2,
    timestamp: '2024-01-15 16:45:12',
    user: 'Jane Smith',
    actionType: 'OUT',
    referenceType: 'SALES_ORDER',
    referenceId: 'SO-001',
    quantityChange: '-5',
    product: 'Wireless Mouse',
    description: 'Stock sold via sales order'
  },
  {
    id: 3,
    timestamp: '2024-01-14 09:15:33',
    user: 'Mike Johnson',
    actionType: 'ADJUSTMENT_ADD',
    referenceType: 'MANUAL_ADJUSTMENT',
    referenceId: 'ADJ-001',
    quantityChange: '+10',
    product: 'USB-C Cable',
    description: 'Manual stock adjustment - found additional inventory'
  },
  {
    id: 4,
    timestamp: '2024-01-14 11:22:45',
    user: 'Sarah Wilson',
    actionType: 'EXPIRED',
    referenceType: 'BATCH_EXPIRY',
    referenceId: 'EXP-001',
    quantityChange: '-3',
    product: 'Power Bank',
    description: 'Product batch expired and removed from inventory'
  },
  {
    id: 5,
    timestamp: '2024-01-13 13:30:00',
    user: 'John Doe',
    actionType: 'OUT',
    referenceType: 'SALES_ORDER',
    referenceId: 'SO-002',
    quantityChange: '-15',
    product: 'Laptop Pro 15"',
    description: 'Bulk order shipped to customer'
  }
];

const AuditTrail = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [transactionTypeFilter, setTransactionTypeFilter] = useState('all');
  const [referenceTypeFilter, setReferenceTypeFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [userFilter, setUserFilter] = useState('all');

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.referenceId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTransactionType = transactionTypeFilter === 'all' || log.actionType === transactionTypeFilter;
    const matchesReferenceType = referenceTypeFilter === 'all' || log.referenceType === referenceTypeFilter;
    const matchesUser = userFilter === 'all' || log.user === userFilter;
    
    return matchesSearch && matchesTransactionType && matchesReferenceType && matchesUser;
  });

  const getActionTypeColor = (actionType: string) => {
    switch (actionType) {
      case 'IN':
        return 'default';
      case 'OUT':
        return 'secondary';
      case 'ADJUSTMENT_ADD':
        return 'outline';
      case 'ADJUSTMENT_SUBTRACT':
        return 'destructive';
      case 'EXPIRED':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getReferenceTypeColor = (referenceType: string) => {
    switch (referenceType) {
      case 'PURCHASE_ORDER':
        return 'default';
      case 'SALES_ORDER':
        return 'secondary';
      case 'MANUAL_ADJUSTMENT':
        return 'outline';
      case 'BATCH_EXPIRY':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const handleReferenceClick = (referenceType: string, referenceId: string) => {
    console.log(`Navigate to ${referenceType}: ${referenceId}`);
    // Implementation for navigation to reference details
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Audit Trail</h1>
          <p className="text-secondary-text">Track all inventory transactions and system activities</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search and Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search user, product, reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div>
              <Select value={transactionTypeFilter} onValueChange={setTransactionTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Transaction Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="IN">IN</SelectItem>
                  <SelectItem value="OUT">OUT</SelectItem>
                  <SelectItem value="ADJUSTMENT_ADD">ADJUSTMENT ADD</SelectItem>
                  <SelectItem value="ADJUSTMENT_SUBTRACT">ADJUSTMENT SUBTRACT</SelectItem>
                  <SelectItem value="EXPIRED">EXPIRED</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={referenceTypeFilter} onValueChange={setReferenceTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Reference Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All References</SelectItem>
                  <SelectItem value="PURCHASE_ORDER">Purchase Order</SelectItem>
                  <SelectItem value="SALES_ORDER">Sales Order</SelectItem>
                  <SelectItem value="MANUAL_ADJUSTMENT">Manual Adjustment</SelectItem>
                  <SelectItem value="BATCH_EXPIRY">Batch Expiry</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="User" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="John Doe">John Doe</SelectItem>
                  <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                  <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                  <SelectItem value="Sarah Wilson">Sarah Wilson</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Input
                type="date"
                placeholder="Date From"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>

            <div>
              <Input
                type="date"
                placeholder="Date To"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action Type</TableHead>
                <TableHead>Reference Type</TableHead>
                <TableHead>Reference ID</TableHead>
                <TableHead>Quantity Change</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-secondary-text font-mono text-sm">
                    {log.timestamp}
                  </TableCell>
                  <TableCell className="font-medium">{log.user}</TableCell>
                  <TableCell>
                    <Badge variant={getActionTypeColor(log.actionType)}>
                      {log.actionType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getReferenceTypeColor(log.referenceType)}>
                      {log.referenceType.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      className="p-0 h-auto font-mono text-sm"
                      onClick={() => handleReferenceClick(log.referenceType, log.referenceId)}
                    >
                      {log.referenceId}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${
                      log.quantityChange.startsWith('+') ? 'text-accent' : 'text-destructive'
                    }`}>
                      {log.quantityChange}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{log.product}</TableCell>
                  <TableCell className="text-secondary-text max-w-xs truncate">
                    {log.description}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditTrail;