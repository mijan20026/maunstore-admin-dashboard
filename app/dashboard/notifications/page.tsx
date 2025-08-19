'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Send, Users, User, Clock, CheckCircle } from 'lucide-react';

interface PushNotification {
  id: string;
  title: string;
  message: string;
  targetAudience: 'all' | 'subscribers' | 'specific';
  status: 'sent' | 'scheduled' | 'draft';
  sentAt?: string;
  scheduledAt?: string;
  recipients: number;
}

const mockNotifications: PushNotification[] = [
  {
    id: '1',
    title: 'New Product Launch',
    message: 'Check out our latest collection of summer wear!',
    targetAudience: 'all',
    status: 'sent',
    sentAt: '2024-01-15T10:30:00Z',
    recipients: 1250,
  },
  {
    id: '2',
    title: 'Flash Sale Alert',
    message: 'Limited time offer: 50% off on selected items',
    targetAudience: 'subscribers',
    status: 'scheduled',
    scheduledAt: '2024-01-16T09:00:00Z',
    recipients: 850,
  },
  {
    id: '3',
    title: 'Order Update',
    message: 'Your order has been shipped and is on its way!',
    targetAudience: 'specific',
    status: 'draft',
    recipients: 1,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<PushNotification[]>(mockNotifications);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    targetAudience: 'all',
    scheduledAt: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newNotification: PushNotification = {
      id: Date.now().toString(),
      title: formData.title,
      message: formData.message,
      targetAudience: formData.targetAudience as 'all' | 'subscribers' | 'specific',
      status: formData.scheduledAt ? 'scheduled' : 'sent',
      sentAt: formData.scheduledAt ? undefined : new Date().toISOString(),
      scheduledAt: formData.scheduledAt || undefined,
      recipients: formData.targetAudience === 'all' ? 1250 : formData.targetAudience === 'subscribers' ? 850 : 1,
    };

    setNotifications([newNotification, ...notifications]);
    setFormData({
      title: '',
      message: '',
      targetAudience: 'all',
      scheduledAt: '',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'scheduled':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'draft':
        return <Bell className="h-4 w-4 text-gray-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getAudienceIcon = (audience: string) => {
    switch (audience) {
      case 'all':
        return <Users className="h-4 w-4" />;
      case 'subscribers':
        return <Users className="h-4 w-4" />;
      case 'specific':
        return <User className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Push Notifications</h1>
        <p className="text-muted-foreground">
          Send notifications to your users and manage notification history.
        </p>
      </div>

      <Tabs defaultValue="send" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="send">Send Notification</TabsTrigger>
          <TabsTrigger value="history">Notification History</TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Notification</CardTitle>
              <CardDescription>
                Send a push notification to your users instantly or schedule it for later.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Notification Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter notification title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="audience">Target Audience</Label>
                    <Select
                      value={formData.targetAudience}
                      onValueChange={(value) => setFormData({ ...formData, targetAudience: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="subscribers">Subscribers Only</SelectItem>
                        <SelectItem value="specific">Specific Users</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Enter notification message"
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schedule">Schedule (Optional)</Label>
                  <Input
                    id="schedule"
                    type="datetime-local"
                    value={formData.scheduledAt}
                    onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                  />
                  <p className="text-sm text-gray-500">
                    Leave empty to send immediately
                  </p>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline">
                    Save Draft
                  </Button>
                  <Button type="submit">
                    <Send className="mr-2 h-4 w-4" />
                    {formData.scheduledAt ? 'Schedule' : 'Send Now'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification History</CardTitle>
              <CardDescription>
                View all sent, scheduled, and draft notifications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(notification.status)}
                        <Badge variant="outline">
                          {notification.status}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{notification.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1">
                            {getAudienceIcon(notification.targetAudience)}
                            <span className="text-xs text-gray-500 capitalize">
                              {notification.targetAudience}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {notification.recipients} recipients
                          </span>
                          <span className="text-xs text-gray-500">
                            {notification.sentAt
                              ? `Sent ${new Date(notification.sentAt).toLocaleString()}`
                              : notification.scheduledAt
                              ? `Scheduled for ${new Date(notification.scheduledAt).toLocaleString()}`
                              : 'Draft'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm">
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}