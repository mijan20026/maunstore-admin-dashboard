'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { deleteSubscription, updateSubscription } from '@/lib/features/dataSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Eye, Search, DollarSign } from 'lucide-react';
import { Subscription } from '@/types';

export default function SubscriptionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const subscriptions = useSelector((state: RootState) => state.data.subscriptions);

  const handleEdit = (subscription: Subscription) => {
    console.log('Edit subscription:', subscription);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this subscription plan?')) {
      dispatch(deleteSubscription(id));
    }
  };

  const toggleActive = (id: string) => {
    const subscription = subscriptions.find(s => s.id === id);
    if (subscription) {
      dispatch(updateSubscription({
        ...subscription,
        isActive: !subscription.isActive,
        updatedAt: new Date().toISOString(),
      }));
    }
  };

  const filteredSubscriptions = subscriptions.filter((subscription: Subscription) =>
    subscription.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscription Packages</h1>
          <p className="text-muted-foreground">
            Manage your subscription plans and pricing.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Package
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search subscriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Plans ({filteredSubscriptions.length})</CardTitle>
          <CardDescription>
            A list of all subscription packages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredSubscriptions.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-lg font-medium mb-2">No subscription plans found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first subscription plan.'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Features</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscriptions.map((subscription: Subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell>
                      <div className="font-medium">{subscription.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-medium">{subscription.price}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{subscription.duration}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground max-w-[200px]">
                        {subscription.features.slice(0, 2).join(', ')}
                        {subscription.features.length > 2 && '...'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={subscription.isActive ? 'default' : 'secondary'}>
                        {subscription.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={subscription.isActive}
                        onCheckedChange={() => toggleActive(subscription.id)}
                      />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(subscription.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(subscription)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(subscription.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}