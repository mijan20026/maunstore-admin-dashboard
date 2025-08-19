'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { addSize, deleteSize, addColor, deleteColor } from '@/lib/features/dataSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Size, Color } from '@/types';


export default function SizesColorsPage() {
  const dispatch = useDispatch();
  const sizes = useSelector((state: RootState) => state.data.sizes);
  const colors = useSelector((state: RootState) => state.data.colors);
  const [newSize, setNewSize] = useState({ name: '', value: '' });
  const [newColor, setNewColor] = useState({ name: '', value: '#000000' });

  const handleAddNewSize = () => {
    if (newSize.name && newSize.value) {
      dispatch(addSize({ ...newSize, id: Date.now().toString() }));
      setNewSize({ name: '', value: '' });
    }
  };

  const handleAddNewColor = () => {
    if (newColor.name && newColor.value) {
      dispatch(addColor({ ...newColor, id: Date.now().toString() }));
      setNewColor({ name: '', value: '#000000' });
    }
  };

  const removeSize = (id: string) => {
    dispatch(deleteSize(id));
  };

  const removeColor = (id: string) => {
    dispatch(deleteColor(id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Size & Color Management</h1>
        <p className="text-muted-foreground">
          Manage product sizes and colors for your inventory.
        </p>
      </div>

      <Tabs defaultValue="sizes" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sizes">Sizes</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
        </TabsList>

        <TabsContent value="sizes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Size</CardTitle>
              <CardDescription>
                Create a new size option for your products.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="size-name">Size Name</Label>
                  <Input
                    id="size-name"
                    value={newSize.name}
                    onChange={(e) => setNewSize({ ...newSize, name: e.target.value })}
                    placeholder="e.g., Small"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size-value">Size Value</Label>
                  <Input
                    id="size-value"
                    value={newSize.value}
                    onChange={(e) => setNewSize({ ...newSize, value: e.target.value })}
                    placeholder="e.g., S"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleAddNewSize}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Size
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Sizes</CardTitle>
              <CardDescription>
                Manage your existing size options.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {sizes.map((size) => (
                  <div key={size.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline">{size.value}</Badge>
                      <span className="font-medium">{size.name}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSize(size.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="colors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Color</CardTitle>
              <CardDescription>
                Create a new color option for your products.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="color-name">Color Name</Label>
                  <Input
                    id="color-name"
                    value={newColor.name}
                    onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                    placeholder="e.g., Red"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color-value">Color Value</Label>
                  <Input
                    id="color-value"
                    type="color"
                    value={newColor.value}
                    onChange={(e) => setNewColor({ ...newColor, value: e.target.value })}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleAddNewColor}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Color
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Colors</CardTitle>
              <CardDescription>
                Manage your existing color options.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {colors.map((color) => (
                  <div key={color.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-8 h-8 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: color.value }}
                      />
                      <span className="font-medium">{color.name}</span>
                      <Badge variant="outline">{color.value}</Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeColor(color.id)}
                      >
                        <Trash2 className="h-4 w-4" />
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