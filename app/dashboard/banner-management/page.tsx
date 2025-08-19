'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { deleteBanner, updateBanner } from '@/lib/redux/features/dataSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Image as ImageIcon, Search } from 'lucide-react';
import { BannerModal } from '@/components/dashboard/banner-modal';
import { Banner } from '@/types';
import Image from 'next/image';

export default function BannerManagementPage() {
  const dispatch = useDispatch();
  const banners = useSelector((state: RootState) => state.data.banners);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBanner, setCurrentBanner] = useState<Banner | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);

  const handleAddBanner = () => {
    setCurrentBanner(undefined);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditBanner = (banner: Banner) => {
    setCurrentBanner(banner);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDeleteBanner = (id: string) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      dispatch(deleteBanner(id));
    }
  };

  const handleToggleActive = (banner: Banner) => {
    dispatch(updateBanner({
      ...banner,
      isActive: !banner.isActive,
      updatedAt: new Date().toISOString(),
    }));
  };

  const filteredBanners = banners.filter((banner) =>
    banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    banner.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-start items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Banner Management <span className="text-primary">({filteredBanners.length})</span></h1>
          <p className="text-muted-foreground">
            Manage your website banners, images, titles and descriptions.
          </p>
        </div>
       
      </div>

      <div className="flex items-center justify-between py-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search banners..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={handleAddBanner}>
          <Plus className="mr-2 h-4 w-4" /> Add Banner
        </Button>
      </div>

      <Card>
        {/* <CardHeader>
          <CardTitle>All Banners</CardTitle>
          <CardDescription>
            View and manage all website banners
          </CardDescription>
        </CardHeader> */}
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBanners.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No banners found. Create your first banner!
                  </TableCell>
                </TableRow>
              ) : (
                filteredBanners.map((banner) => (
                  <TableRow key={banner.id}>
                    <TableCell>
                      <div className="h-12 w-24 bg-muted rounded-md overflow-hidden relative">
                        {banner.image ? (
                          <Image 
                            src={banner.image} 
                            alt={banner.title}
                            width={100}
                            height={100}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{banner.title}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs truncate">
                      {banner.description}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={banner.isActive}
                          onCheckedChange={() => handleToggleActive(banner)}
                        />
                        <span className={banner.isActive ? "text-green-600" : "text-gray-400"}>
                          {banner.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon" onClick={() => handleEditBanner(banner)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDeleteBanner(banner.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <BannerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        banner={currentBanner}
        isEditing={isEditing}
      />
    </div>
  );
} 