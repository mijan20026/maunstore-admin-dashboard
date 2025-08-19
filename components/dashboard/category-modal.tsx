'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { addCategory, updateCategory } from '@/lib/features/dataSlice';
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
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/dashboard/image-upload';
import { Category } from '@/types';
import Image from 'next/image';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
  mode: 'add' | 'edit' | 'view';
}

interface FormData {
  name: string;
  description: string;
  image: File[];
}

export function CategoryModal({ isOpen, onClose, category, mode }: CategoryModalProps) {
  const dispatch = useDispatch();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      description: '',
      image: [],
    },
  });

  // Set form values when category changes or modal opens
  useEffect(() => {
    if (category && (mode === 'edit' || mode === 'view')) {
      setValue('name', category.name);
      setValue('description', category.description);
    } else if (mode === 'add') {
      setValue('name', '');
      setValue('description', '');
    }
  }, [category, mode, setValue]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset();
      setImageFiles([]);
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: FormData) => {
    if (mode === 'view') return;
    
    setIsLoading(true);
    
    const categoryData: Category = {
      id: category?.id || Date.now().toString(),
      name: data.name,
      description: data.description,
      image: imageFiles.length > 0 ? URL.createObjectURL(imageFiles[0]) : category?.image,
      createdAt: category?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (mode === 'edit' && category) {
      dispatch(updateCategory(categoryData));
    } else {
      dispatch(addCategory(categoryData));
    }

    setIsLoading(false);
    reset();
    setImageFiles([]);
    onClose();
  };

  const handleClose = () => {
    reset();
    setImageFiles([]);
    onClose();
  };

  const getTitle = () => {
    switch (mode) {
      case 'add':
        return 'Add New Brands';
      case 'edit':
        return 'Edit Brands';
      case 'view':
        return 'View Brands';
      default:
        return 'Brands';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'add':
        return 'Create a new brands for your products';
      case 'edit':
        return 'Update brands information';
      case 'view':
        return 'View brands details';
      default:
        return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Brands Name</Label>
              <Input
                id="name"
                {...register('name', { required: mode !== 'view' ? 'Category name is required' : false })}
                placeholder="Enter category name"
                disabled={mode === 'view'}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description', { required: mode !== 'view' ? 'Description is required' : false })}
              placeholder="Enter category description"
              rows={3}
              disabled={mode === 'view'}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div> */}

          {mode !== 'view' && (
            <div className="space-y-2">
              <Label>Category Image</Label>
              <ImageUpload
                value={imageFiles}
                onChange={setImageFiles}
                maxFiles={1}
                accept="image/*"
              />
            </div>
          )}

          {mode === 'view' && category?.image && (
            <div className="space-y-2">
              <Label>Category Image</Label>
              <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
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