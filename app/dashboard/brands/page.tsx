"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { deleteCategory } from "@/lib/features/dataSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Eye, Search } from "lucide-react";
import { CategoryModal } from "@/components/dashboard/category-modal"; // TODO: Rename to BrandModal
import Image from "next/image";

export default function BrandsPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("brands");
  const dispatch = useDispatch();
  const brands = useSelector((state: RootState) => state.data.categories);
  const categories = useSelector((state: RootState) => state.data.categories); // Assuming same data source for now

  const handleAdd = () => {
    setEditingItem(null);
    setModalMode("add");
    setShowModal(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleView = (item: any) => {
    setEditingItem(item);
    setModalMode("view");
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    const itemType = activeTab === "brands" ? "brand" : "category";
    if (confirm(`Are you sure you want to delete this ${itemType}?`)) {
      dispatch(deleteCategory(id));
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const filteredBrands = brands.filter(
    (brand: any) =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCategories = categories.filter(
    (category: any) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentData = activeTab === "brands" ? filteredBrands : filteredCategories;
  const currentCount = activeTab === "brands" ? filteredBrands.length : filteredCategories.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {activeTab === "brands" ? "Brand" : "Category"} Management{" "}
            <span className="text-primary">({currentCount})</span>
          </h1>
          <p className="text-muted-foreground">
            Manage your {activeTab === "brands" ? "product brands and their details" : "product categories"}.
          </p>
        </div>
        <div className="flex items-center justify-between space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add {activeTab === "brands" ? "Brand" : "Category"}
          </Button>
        </div>
      </div>

      <CategoryModal
        isOpen={showModal}
        onClose={handleModalClose}
        category={editingItem}
        mode={modalMode}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="brands">Brands</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="brands" className="space-y-4">
          <Card>
            <CardContent>
              {filteredBrands.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📦</div>
                  <h3 className="text-lg font-medium mb-2">No brands found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm
                      ? "Try adjusting your search terms."
                      : "Get started by creating your first brand."}
                  </p>
                  {!searchTerm && (
                    <Button onClick={handleAdd}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Brand
                    </Button>
                  )}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Name</TableHead>
                      {/* <TableHead>Description</TableHead> */}
                      <TableHead>Products</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBrands.map((brand: any) => (
                      <TableRow key={brand.id}>
                        <TableCell>
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                            {brand.image ? (
                              <Image
                                src={brand.image}
                                alt={brand.name}
                                width={100}
                                height={100}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                📁
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{brand.name}</div>
                        </TableCell>
                        {/* <TableCell>
                          <div className="text-sm text-muted-foreground max-w-[300px] truncate">
                            {brand.description}
                          </div>
                        </TableCell> */}
                        <TableCell>
                          <Badge variant="outline">5 products</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(brand.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleView(brand)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(brand)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(brand.id)}
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
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardContent>
              {filteredCategories.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📂</div>
                  <h3 className="text-lg font-medium mb-2">No categories found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm
                      ? "Try adjusting your search terms."
                      : "Get started by creating your first category."}
                  </p>
                  {!searchTerm && (
                    <Button onClick={handleAdd}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Category
                    </Button>
                  )}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.map((category: any) => (
                      <TableRow key={category.id}>
                        <TableCell>
                          <div className="font-medium">{category.name}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">3 products</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(category.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleView(category)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(category)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(category.id)}
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
        </TabsContent>
      </Tabs>
    </div>
  );
}