"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import BrandCategoryModal from "@/components/dashboard/BrandCategoryModal";
import Image from "next/image";
import {
  useGetBrandsQuery,
  useDeleteBrandMutation,
} from "@/lib/redux/apiSlice/brandsApi";
import {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
} from "@/lib/redux/apiSlice/categoriesApi";
import { getImageUrl } from "@/components/dashboard/imageUrl";

export default function BrandsPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"brands" | "categories">("brands");

  const { data: brandsData, isLoading: brandsLoading } = useGetBrandsQuery();
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetCategoriesQuery();

  const [deleteBrand] = useDeleteBrandMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const brands = brandsData?.data?.data || [];
  const categories = categoriesData?.data || [];

  if (brandsLoading || categoriesLoading) return <p>Loading...</p>;

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
    const type = activeTab === "brands" ? "brand" : "category";
    if (confirm(`Are you sure you want to delete this ${type}?`)) {
      if (type === "brand") {
        await deleteBrand(id);
      } else {
        await deleteCategory(id);
      }
    }
  };

  const filteredBrands = brands.filter(
    (brand: any) =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCategories = categories.filter((category: any) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentData =
    activeTab === "brands" ? filteredBrands : filteredCategories;

  // console.log(filteredBrands[0].image);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {activeTab === "brands" ? "Brand" : "Category"} Management{" "}
            <span className="text-primary">({currentData.length})</span>
          </h1>
        </div>
        <div className="flex items-center space-x-2">
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

      <BrandCategoryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        item={editingItem}
        mode={modalMode}
        type={activeTab === "brands" ? "brand" : "category"}
      />

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="brands">Brands</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        {/* Brands Tab */}
        <TabsContent value="brands">
          <Card>
            <CardContent>
              {filteredBrands.length === 0 ? (
                <p>No brands found.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Categories</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBrands.map((brand: any) => (
                      <TableRow key={brand._id}>
                        <TableCell>
                          {brand.image ? (
                            <Image
                              src={getImageUrl(brand.image)}
                              alt={brand.name}
                              width={40}
                              height={40}
                              className="rounded"
                            />
                          ) : (
                            "📁"
                          )}
                        </TableCell>
                        <TableCell>{brand.name}</TableCell>
                        <TableCell>
                          <Badge>{brand.totalCategories} categories</Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(brand.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
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
                            onClick={() => handleDelete(brand._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <Card>
            <CardContent>
              {filteredCategories.length === 0 ? (
                <p>No categories found.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category Name</TableHead>
                      <TableHead>Brand Name</TableHead>
                      <TableHead>Brand Image</TableHead>
                      {/* <TableHead>Products</TableHead> */}
                      {/* <TableHead>Created</TableHead> */}
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.map((category: any) => (
                      <TableRow key={category._id}>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>{category.brandId?.name}</TableCell>
                        <TableCell>
                          {category.image ? (
                            <Image
                              src={getImageUrl(category.image)}
                              alt={category.name}
                              width={40}
                              height={40}
                              className="rounded"
                            />
                          ) : (
                            "📁"
                          )}
                        </TableCell>
                        {/* <TableCell>
                          <Badge>3 products</Badge>
                        </TableCell> */}
                        {/* <TableCell>
                          {new Date(category.createdAt).toLocaleDateString()}
                        </TableCell> */}
                        <TableCell className="text-right space-x-2">
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
                            onClick={() => handleDelete(category._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
