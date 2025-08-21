"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { addProduct, updateProduct } from "@/lib/redux/features/dataSlice";
import {
  useAddProductMutation,
  useUpdateProductMutation,
} from "@/lib/redux/apiSlice/productsApi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/dashboard/image-upload";
import { Product } from "@/app/dashboard/products/page";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  mode: "add" | "edit" | "view";
}

interface FormData {
  name: string;
  description: string;
  price: number;
  brandId: string;
  category: string;
  categoryId: string;
  stock: number;
  images: File[];
  // Specification fields
  gender: string;
  modelNumber: string;
  movement: string;
  caseDiameter: string;
  caseThickness: string;
}

export function ProductModal({
  isOpen,
  onClose,
  product,
  mode,
}: ProductModalProps) {
  const dispatch = useDispatch();
  const brands = useSelector((state: RootState) => state.data.brands);
  const categories = useSelector((state: RootState) => state.data.categories);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(product?.brandId || "");
  const [selectedCategory, setSelectedCategory] = useState(
    product?.category?._id || ""
  );

  // API mutations
  const [addProductMutation] = useAddProductMutation();
  // const [updateProductMutation] = useUpdateProductMutation();

  // Initialize existing images when product changes
  useEffect(() => {
    if (product?.images && product.images.length > 0) {
      setExistingImages(product.images);
    } else {
      setExistingImages([]);
    }
    // Reset image files when product changes
    setImageFiles([]);
    // Set selected brand and category
    setSelectedBrand(product?.brandId || "");
    setSelectedCategory(product?.category?._id || "");
  }, [product]);

  // Debug useEffect to check categories data
  useEffect(() => {
    console.log("Categories in ProductModal:", categories);
    console.log("Categories length:", categories?.length);
    console.log("Selected category:", selectedCategory);

    // Debug individual categories
    if (categories && categories.length > 0) {
      console.log("First category structure:", categories[0]);
      categories.forEach((cat, index) => {
        if (!cat._id && !cat.id) {
          console.warn(`Category at index ${index} is missing ID:`, cat);
        }
      });
    }
  }, [categories, selectedCategory]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      brandId: product?.brandId || "",
      categoryId: product?.category?._id || "",
      stock: product?.stock || 0,
      images: [],
      // Specification fields
      gender: product?.gender || "",
      modelNumber: product?.modelNumber || "",
      movement: product?.movement || "",
      caseDiameter: product?.caseDiameter || "",
      caseThickness: product?.caseThickness || "",
    },
  });

  // Watch form values for real-time updates
  const watchedCategory = watch("categoryId");
  const watchedGender = watch("gender");

  useEffect(() => {
    if (product) {
      setValue("name", product.name);
      setValue("description", product.description);
      setValue("price", product.price);
      setValue("stock", product.stock);
      setValue("brandId", product.brandId || "");
      setValue("categoryId", product.category?._id || "");
      setValue("gender", product.gender || "");
      setValue("modelNumber", product.modelNumber || "");
      setValue("movement", product.movement || "");
      setValue("caseDiameter", product.caseDiameter || "");
      setValue("caseThickness", product.caseThickness || "");
    }
  }, [product, setValue]);

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormData) => {
    if (mode === "view") return;

    setIsLoading(true);

    try {
      setIsLoading(true);

      // Prepare the product data for API
      const productPayload = {
        name: data.name?.trim(),
        description: data.description?.trim(),
        price: Number(data.price),
        stock: Number(data.stock),
        category: selectedCategory, // Send category ID as string
        gender: data.gender ? data.gender.toUpperCase() : undefined, // Convert to uppercase as per API requirement
        modelNumber: data.modelNumber?.trim() || undefined,
        movement: data.movement?.trim() || undefined,
        caseDiameter: data.caseDiameter?.trim() || undefined,
        caseThickness: data.caseThickness?.trim() || undefined,
        // Images handling might need to be implemented separately
      };

      console.log("Submitting product payload:", productPayload);
      console.log("Selected category:", selectedCategory);
      console.log("Form data:", data);

      // Validate required fields before submission
      const validationErrors: string[] = [];

      if (!productPayload.name)
        validationErrors.push("Product name is required");
      if (!productPayload.category)
        validationErrors.push("Category selection is required");
      if (!productPayload.description)
        validationErrors.push("Product description is required");
      if (!productPayload.price || productPayload.price <= 0)
        validationErrors.push("Price must be greater than 0");
      if (productPayload.stock < 0)
        validationErrors.push("Stock cannot be negative");

      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(", "));
      }

      let result;

      if (mode === "edit" && product) {
        // Update existing product
        result = await updateProductMutation({
          id: product._id,
          updates: productPayload,
        }).unwrap();
        console.log("Product updated successfully:", result);
        alert("✅ Product updated successfully!");
      } else {
        // Add new product
        result = await addProductMutation(productPayload).unwrap();
        console.log("Product added successfully:", result);
        alert("✅ Product added successfully!");
      }

      // Reset form and close modal
      reset();
      setImageFiles([]);
      setExistingImages([]);
      setSelectedBrand("");
      setSelectedCategory("");
      onClose();
    } catch (error: any) {
      console.error("Error saving product:", error);

      // Determine error message
      let errorMessage = "Failed to save product";

      // Handle RTK Query API errors
      if (error?.data?.message) {
        errorMessage = error.data.message;

        // Optionally handle detailed field errors
        if (Array.isArray(error.data.error) && error.data.error.length > 0) {
          const fieldErrors = error.data.error
            .map((e: any) => e.message)
            .join("\n");
          errorMessage += "\n" + fieldErrors;
        }
      } else if (error.message) {
        // JS validation errors
        errorMessage = error.message;
      } else if (error.status) {
        errorMessage = `API Error: ${error.status} - ${
          error.statusText || "Unknown error"
        }`;
      }

      alert(`❌ ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setImageFiles([]);
    setExistingImages([]);
    setSelectedBrand("");
    setSelectedCategory("");
    onClose();
  };

  const getTitle = () => {
    switch (mode) {
      case "add":
        return "Add New Product";
      case "edit":
        return "Edit Product";
      case "view":
        return "Product Details";
      default:
        return "Product";
    }
  };

  // Get brand name from brand ID
  const getBrandName = (brandId?: string) => {
    if (!brandId) return "N/A";
    const brand = brands.find((b) => b.id === brandId || b._id === brandId);
    return brand ? brand.name : "Unknown Brand";
  };

  // Render product details view
  const renderProductDetails = () => {
    if (!product) return null;

    return (
      <div className="space-y-6">
        {/* Product Images */}
        {product.images && product.images.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-4">Product Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        <Separator />

        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-medium mb-4">Basic Information</h3>
          <div className="border rounded-md overflow-hidden">
            <table className="w-full">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium bg-gray-50 w-1/3">
                    Product Name
                  </td>
                  <td className="py-2 px-4">{product.name}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium bg-gray-50 w-1/3">
                    Description
                  </td>
                  <td className="py-2 px-4">{product.description}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium bg-gray-50 w-1/3">
                    Price
                  </td>
                  <td className="py-2 px-4">${product.price}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium bg-gray-50 w-1/3">
                    Stock
                  </td>
                  <td className="py-2 px-4">{product.stock} units</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium bg-gray-50 w-1/3">
                    Brand
                  </td>
                  <td className="py-2 px-4">{getBrandName(product.brandId)}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium bg-gray-50 w-1/3">
                    Status
                  </td>
                  <td className="py-2 px-4">
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium bg-gray-50 w-1/3">
                    Created Date
                  </td>
                  <td className="py-2 px-4">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-medium bg-gray-50 w-1/3">
                    Last Updated
                  </td>
                  <td className="py-2 px-4">
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <Separator />

        {/* Specification Details */}
        <div>
          <h3 className="text-lg font-medium mb-4">Specifications</h3>
          <div className="border rounded-md overflow-hidden">
            <table className="w-full">
              <tbody>
                {product.gender && (
                  <tr className="border-b">
                    <td className="py-2 px-4 font-medium bg-gray-50 w-1/3">
                      Gender
                    </td>
                    <td className="py-2 px-4">{product.gender}</td>
                  </tr>
                )}
                {(product.modelNo || product.modelNumber) && (
                  <tr className="border-b">
                    <td className="py-2 px-4 font-medium bg-gray-50 w-1/3">
                      Model No
                    </td>
                    <td className="py-2 px-4">
                      {product.modelNo || product.modelNumber}
                    </td>
                  </tr>
                )}
                {product.movement && (
                  <tr className="border-b">
                    <td className="py-2 px-4 font-medium bg-gray-50 w-1/3">
                      Movement
                    </td>
                    <td className="py-2 px-4">{product.movement}</td>
                  </tr>
                )}
                {product.caseDiameter && (
                  <tr className="border-b">
                    <td className="py-2 px-4 font-medium bg-gray-50 w-1/3">
                      Case Diameter
                    </td>
                    <td className="py-2 px-4">{product.caseDiameter}</td>
                  </tr>
                )}
                {product.caseThickness && (
                  <tr className="border-b">
                    <td className="py-2 px-4 font-medium bg-gray-50 w-1/3">
                      Case Thickness
                    </td>
                    <td className="py-2 px-4">{product.caseThickness}</td>
                  </tr>
                )}
                {product.specifications &&
                  Object.entries(product.specifications).map(([key, value]) => (
                    <tr key={key} className="border-b">
                      <td className="py-2 px-4 font-medium bg-gray-50 w-1/3">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </td>
                      <td className="py-2 px-4">{value}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            {mode === "view"
              ? "View product details"
              : mode === "edit"
              ? "Update product information"
              : "Create a new product"}
          </DialogDescription>
        </DialogHeader>

        {mode === "view" ? (
          <>
            {renderProductDetails()}
            <div className="flex justify-end mt-6">
              <Button type="button" onClick={handleClose}>
                Close
              </Button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">
                  General Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      {...register("name", {
                        required: "Product name is required",
                      })}
                      placeholder="Enter product name"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      {...register("price", {
                        required: "Price is required",
                        min: { value: 0, message: "Price must be positive" },
                      })}
                      placeholder="Enter price"
                    />
                    {errors.price && (
                      <p className="text-sm text-red-500">
                        {errors.price.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      type="number"
                      {...register("stock", {
                        required: "Stock is required",
                        min: { value: 0, message: "Stock cannot be negative" },
                      })}
                      placeholder="Enter stock quantity"
                    />
                    {errors.stock && (
                      <p className="text-sm text-red-500">
                        {errors.stock.message}
                      </p>
                    )}
                  </div>

                  {/* Category Select */}
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    {categories && categories.length > 0 ? (
                      <Select
                        value={selectedCategory}
                        onValueChange={(value) => {
                          console.log("Selected category:", value);
                          // Only update if value is not empty
                          if (value && value !== "") {
                            setSelectedCategory(value);
                            setValue("categoryId", value);
                            setValue("category", value);
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {
                            categories
                              .filter(
                                (category) =>
                                  category && (category._id || category.id)
                              ) // Filter out invalid categories
                              .map((category, index) => {
                                const key =
                                  category._id ||
                                  category.id ||
                                  `category-${index}`;
                                const value = category._id || category.id || "";

                                // Skip if value is empty
                                if (!value || value === "") {
                                  console.warn(
                                    "Skipping category with empty value:",
                                    category
                                  );
                                  return null;
                                }

                                return (
                                  <SelectItem key={key} value={value}>
                                    {category.name || "Unnamed Category"}
                                  </SelectItem>
                                );
                              })
                              .filter(Boolean) // Remove null values
                          }
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-500">
                        {categories === undefined
                          ? "Loading categories..."
                          : "No categories available"}
                      </div>
                    )}
                    {!selectedCategory && (
                      <p className="text-sm text-amber-600">
                        Please select a category
                      </p>
                    )}
                    {/* Debug info - remove in production */}
                    <div className="text-xs text-gray-500">
                      Categories loaded: {categories ? categories.length : 0}
                      {selectedCategory && ` | Selected: ${selectedCategory}`}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...register("description", {
                      required: "Description is required",
                    })}
                    placeholder="Enter product description"
                    rows={3}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={watchedGender}
                      onValueChange={(value) => {
                        console.log("Selected gender:", value);
                        setValue("gender", value);
                      }}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="UNISEX">Unisex</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="modelNumber">Model Number</Label>
                    <Input
                      id="modelNumber"
                      {...register("modelNumber")}
                      placeholder="Enter model number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="movement">Movement</Label>
                    <Input
                      id="movement"
                      {...register("movement")}
                      placeholder="Enter movement type"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="caseDiameter">Case Diameter</Label>
                    <Input
                      id="caseDiameter"
                      {...register("caseDiameter")}
                      placeholder="Enter case diameter (e.g., 42mm)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="caseThickness">Case Thickness</Label>
                    <Input
                      id="caseThickness"
                      {...register("caseThickness")}
                      placeholder="Enter case thickness (e.g., 10mm)"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Images</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 mb-2">
                    Upload up to 5 product images. First image will be used as
                    the main product image.
                  </p>
                  <ImageUpload
                    value={imageFiles}
                    onChange={setImageFiles}
                    maxFiles={5}
                    accept="image/*"
                    existingImages={existingImages}
                    onRemoveExisting={handleRemoveExistingImage}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || !selectedCategory}>
                {isLoading
                  ? "Saving..."
                  : mode === "edit"
                  ? "Update"
                  : "Create"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
