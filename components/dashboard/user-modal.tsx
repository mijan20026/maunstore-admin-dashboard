'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { addUser, updateUser } from '@/lib/features/dataSlice';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/types';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
  mode: 'add' | 'edit' | 'view';
}

interface FormData {
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export function UserModal({ isOpen, onClose, user, mode }: UserModalProps) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || 'user',
    },
  });

  const onSubmit = async (data: FormData) => {
    if (mode === 'view') return;
    
    setIsLoading(true);
    
    const userData: User = {
      id: user?.id || Date.now().toString(),
      name: data.name,
      email: data.email,
      role: data.role,
      avatar: user?.avatar,
      createdAt: user?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (mode === 'edit' && user) {
      dispatch(updateUser(userData));
    } else {
      dispatch(addUser(userData));
    }

    setIsLoading(false);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const getTitle = () => {
    switch (mode) {
      case 'add':
        return 'Add New User';
      case 'edit':
        return 'Edit User';
      case 'view':
        return 'View User';
      default:
        return 'User';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            {mode === 'view' ? 'View user details' : mode === 'edit' ? 'Update user information' : 'Create a new user account'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {mode === 'view' && user && (
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-medium">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-sm text-gray-500">Role: {user.role}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                {...register('name', { required: mode !== 'view' ? 'Name is required' : false })}
                placeholder="Enter full name"
                disabled={mode === 'view'}
                defaultValue={user?.name || ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                {...register('email', { 
                  required: mode !== 'view' ? 'Email is required' : false,
                  pattern: mode !== 'view' ? {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address'
                  } : undefined
                })}
                placeholder="Enter email address"
                disabled={mode === 'view'}
                defaultValue={user?.email || ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <Select
              value={user?.role || 'user'}
              onValueChange={(value: 'admin' | 'user') => setValue('role', value)}
              disabled={mode === 'view'}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {mode === 'view' && user && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-gray-500">Created At</Label>
                <p>{new Date(user.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-gray-500">Updated At</Label>
                <p>{new Date(user.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              {mode === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {mode !== 'view' && (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : mode === 'edit' ? 'Update' : 'Create'}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}