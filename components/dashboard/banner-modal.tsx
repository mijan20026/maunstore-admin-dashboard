'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addBanner, updateBanner } from '@/lib/features/dataSlice';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Banner } from '@/types';
import { Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface BannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  banner?: Banner;
  isEditing?: boolean;
}

interface FormData {
  title: string;
  description: string;
  image: File[];
  isActive: boolean;
}

export function BannerModal({ isOpen, onClose, banner, isEditing = false }: BannerModalProps) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<FormData>({
    title: banner?.title || '',
    description: banner?.description || '',
    image: [],
    isActive: banner?.isActive || true,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(banner?.image || null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      isActive: checked,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        image: [file],
      });

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const now = new Date().toISOString();
      
      if (isEditing && banner) {
        // Update existing banner
        const updatedBanner: Banner = {
          ...banner,
          title: formData.title,
          description: formData.description,
          // Only update image if a new one was selected
          image: imagePreview || banner.image,
          isActive: formData.isActive,
          updatedAt: now,
        };
        
        dispatch(updateBanner(updatedBanner));
      } else {
        // Add new banner
        const newBanner: Banner = {
          id: `banner-${Date.now()}`,
          title: formData.title,
          description: formData.description,
          // Use placeholder if no image was selected
          image: imagePreview || '/placeholder-banner.jpg',
          isActive: formData.isActive,
          createdAt: now,
          updatedAt: now,
        };
        
        dispatch(addBanner(newBanner));
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving banner:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Banner' : 'Add New Banner'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update banner details' : 'Create a new banner for your website'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="bannerImage">Banner Image</Label>
              <div className="flex items-center gap-4">
                <div className="h-24 w-40 bg-muted rounded-md overflow-hidden relative">
                  {imagePreview ? (
                    <Image
                      src={imagePreview} 

                      alt="Banner preview" 
                      height={100}
                      width={100}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div>
                  <Input
                    id="bannerImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => document.getElementById('bannerImage')?.click()}
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter banner title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter banner description"
                rows={3}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : isEditing ? 'Update Banner' : 'Add Banner'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 