'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Eye, Mail, PhoneCall } from 'lucide-react';

interface Subscriber {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subscriptionPlan: string;
  status: 'active' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  avatar?: string;
}

const mockSubscribers: Subscriber[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    subscriptionPlan: 'Premium Plan',
    status: 'active',
    startDate: '2024-01-15T10:30:00Z',
    endDate: '2024-02-15T10:30:00Z',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    phone: '+1 (555) 987-6543',
    subscriptionPlan: 'Basic Plan',
    status: 'active',
    startDate: '2024-01-10T08:15:00Z',
    endDate: '2024-02-10T08:15:00Z',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    subscriptionPlan: 'Enterprise Plan',
    status: 'expired',
    startDate: '2023-12-01T14:22:00Z',
    endDate: '2024-01-01T14:22:00Z',
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@example.com',
    phone: '+1 (555) 555-0123',
    subscriptionPlan: 'Premium Plan',
    status: 'cancelled',
    startDate: '2024-01-05T09:00:00Z',
    endDate: '2024-01-20T09:00:00Z',
  },
];

export default function SubscribersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [subscribers] = useState<Subscriber[]>(mockSubscribers);

  const filteredSubscribers = subscribers.filter((subscriber: Subscriber) =>
    subscriber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscriber.subscriptionPlan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscriber Management</h1>
          <p className="text-muted-foreground">
            Manage and view all your subscription users.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">Export</Button>
          <Button variant="outline">Import</Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search subscribers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredSubscribers.length === 0 ? (
          <Card className="col-span-full p-8 text-center">
            <div className="space-y-4">
              <div className="text-4xl">👥</div>
              <h3 className="text-lg font-medium">No subscribers found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms.' : 'No subscribers have signed up yet.'}
              </p>
            </div>
          </Card>
        ) : (
          filteredSubscribers.map((subscriber: Subscriber) => (
            <Card key={subscriber.id} className="group hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge className={getStatusColor(subscriber.status)}>
                    {subscriber.status}
                  </Badge>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm">
                      <Mail className="h-4 w-4" />
                    </Button>
                    {subscriber.phone && (
                      <Button variant="ghost" size="sm">
                        <PhoneCall className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={subscriber.avatar} alt={subscriber.name} />
                    <AvatarFallback>
                      {subscriber.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{subscriber.name}</CardTitle>
                    <CardDescription>{subscriber.email}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Plan:</span>
                    <Badge variant="outline">{subscriber.subscriptionPlan}</Badge>
                  </div>
                  
                  {subscriber.phone && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Phone:</span>
                      <span>{subscriber.phone}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Start Date:</span>
                    <span>{new Date(subscriber.startDate).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">End Date:</span>
                    <span>{new Date(subscriber.endDate).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge className={getStatusColor(subscriber.status)}>
                      {subscriber.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-1 h-3 w-3" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}