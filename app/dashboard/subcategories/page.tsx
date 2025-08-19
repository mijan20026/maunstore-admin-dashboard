'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { deleteSubCategory } from '@/lib/features/dataSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { SubCategory } from '@/types';
import Image from 'next/image';

export default function SubCategoriesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);
  const dispatch = useDispatch();
  const subCategories = useSelector((state: RootState) => state.data.subCategories);

  const handleEdit = (subCategory: SubCategory) => {
    setEditingSubCategory(subCategory);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this sub-category?')) {
      dispatch(deleteSubCategory(id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sub Category Management</h1>
          <p className="text-muted-foreground">
            Manage your product sub-categories and organize your inventory.
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Sub Category
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {subCategories.length === 0 ? (
          <Card className="col-span-full p-8 text-center">
            <div className="space-y-4">
              <div className="text-4xl">📂</div>
              <h3 className="text-lg font-medium">No sub-categories found</h3>
              <p className="text-muted-foreground">
                Get started by creating your first sub-category.
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Sub Category
              </Button>
            </div>
          </Card>
        ) : (
          subCategories.map((subCategory: SubCategory) => (
            <Card key={subCategory.id} className="group hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{subCategory.id}</Badge>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(subCategory)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(subCategory.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-lg">{subCategory.name}</CardTitle>
                <CardDescription>{subCategory.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {subCategory.image && (
                  <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
                    <Image
                      src={subCategory.image}
                      alt={subCategory.name}
                      height={200}
                      width={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Created: {new Date(subCategory.createdAt).toLocaleDateString()}</span>
                  <Button variant="outline" size="sm">
                    <Eye className="mr-1 h-3 w-3" />
                    View Details
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