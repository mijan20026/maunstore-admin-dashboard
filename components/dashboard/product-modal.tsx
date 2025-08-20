// "use client";
// import { useState } from "react";

// type Category = {
//   _id: string;
//   name: string;
//   description: string;
//   image: string;
//   brandId: string;
//   createdAt: string;
//   updatedAt: string;
// };

// type Product = {
//   _id?: string;
//   name: string;
//   price: number;
//   stock: number;
//   description: string;
//   images: string[];
//   category: Category;
//   gender: string;
//   modelNumber: string;
//   movement: string;
//   caseDiameter: string;
//   caseThickness: string;
// };

// export default function ProductModal() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [product, setProduct] = useState<Partial<Product>>({
//     category: { _id: "", name: "", description: "", image: "", brandId: "", createdAt: "", updatedAt: "" },
//     images: [],
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;

//     // For nested category fields
//     if (name.startsWith("category.")) {
//       const key = name.split(".")[1];
//       setProduct((prev) => ({
//         ...prev,
//         category: { ...prev.category, [key]: value } as Category,
//       }));
//     } else if (name === "images") {
//       setProduct((prev) => ({ ...prev, images: value.split(",") }));
//     } else if (name === "price" || name === "stock") {
//       setProduct((prev) => ({ ...prev, [name]: Number(value) }));
//     } else {
//       setProduct((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Product to submit:", product);
//     // Replace this with your API call:
//     // fetch("/api/products", { method: "POST", body: JSON.stringify(product) })
//     setIsOpen(false);
//   };

//   return (
//     <>
//       <button
//         className="bg-blue-600 text-white px-4 py-2 rounded"
//         onClick={() => setIsOpen(true)}
//       >
//         Create Product
//       </button>

//       {isOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white rounded-lg w-96 p-6 relative">
//             <button
//               className="absolute top-2 right-2 text-gray-500"
//               onClick={() => setIsOpen(false)}
//             >
//               ✕
//             </button>
//             <h2 className="text-xl font-bold mb-4">Create Product</h2>
//             <form onSubmit={handleSubmit} className="flex flex-col gap-3">
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Product Name"
//                 value={product.name || ""}
//                 onChange={handleChange}
//                 className="border p-2 rounded"
//               />
//               <input
//                 type="number"
//                 name="price"
//                 placeholder="Price"
//                 value={product.price || ""}
//                 onChange={handleChange}
//                 className="border p-2 rounded"
//               />
//               <input
//                 type="number"
//                 name="stock"
//                 placeholder="Stock"
//                 value={product.stock || ""}
//                 onChange={handleChange}
//                 className="border p-2 rounded"
//               />
//               <textarea
//                 name="description"
//                 placeholder="Description"
//                 value={product.description || ""}
//                 onChange={handleChange}
//                 className="border p-2 rounded"
//               />
//               <input
//                 type="text"
//                 name="gender"
//                 placeholder="Gender"
//                 value={product.gender || ""}
//                 onChange={handleChange}
//                 className="border p-2 rounded"
//               />
//               <input
//                 type="text"
//                 name="modelNumber"
//                 placeholder="Model Number"
//                 value={product.modelNumber || ""}
//                 onChange={handleChange}
//                 className="border p-2 rounded"
//               />
//               <input
//                 type="text"
//                 name="movement"
//                 placeholder="Movement"
//                 value={product.movement || ""}
//                 onChange={handleChange}
//                 className="border p-2 rounded"
//               />
//               <input
//                 type="text"
//                 name="caseDiameter"
//                 placeholder="Case Diameter"
//                 value={product.caseDiameter || ""}
//                 onChange={handleChange}
//                 className="border p-2 rounded"
//               />
//               <input
//                 type="text"
//                 name="caseThickness"
//                 placeholder="Case Thickness"
//                 value={product.caseThickness || ""}
//                 onChange={handleChange}
//                 className="border p-2 rounded"
//               />
//               <input
//                 type="text"
//                 name="images"
//                 placeholder="Images (comma separated URLs)"
//                 value={product.images?.join(",") || ""}
//                 onChange={handleChange}
//                 className="border p-2 rounded"
//               />

//               {/* Category Fields */}
//               <h3 className="font-semibold mt-2">Category</h3>
//               <input
//                 type="text"
//                 name="category.name"
//                 placeholder="Category Name"
//                 value={product.category?.name || ""}
//                 onChange={handleChange}
//                 className="border p-2 rounded"
//               />
//               <input
//                 type="text"
//                 name="category.description"
//                 placeholder="Category Description"
//                 value={product.category?.description || ""}
//                 onChange={handleChange}
//                 className="border p-2 rounded"
//               />

//               <button
//                 type="submit"
//                 className="bg-green-600 text-white p-2 rounded mt-3"
//               >
//                 Submit
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { addProduct, updateProduct } from "@/lib/redux/features/dataSlice";
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
import { Product } from "@/types";
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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(product?.brandId || "");

  // Initialize existing images when product changes
  useEffect(() => {
    if (product?.images && product.images.length > 0) {
      setExistingImages(product.images);
    } else {
      setExistingImages([]);
    }
    // Reset image files when product changes
    setImageFiles([]);
    // Set selected brand
    setSelectedBrand(product?.brandId || "");
  }, [product]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      brandId: product?.brandId || "",
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

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormData) => {
    if (mode === "view") return;

    setIsLoading(true);

    // Prepare new image URLs
    const newImageUrls = imageFiles.map((file) => URL.createObjectURL(file));

    // Combine existing and new image URLs
    const allImages = [...existingImages, ...newImageUrls];

    const productData: Product = {
      _id: product?._id || "new",
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      images: allImages,
      category: product?.category || {
        _id: "",
        name: "",
        description: "",
        image: "",
        brandId: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      createdAt: product?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      gender: data.gender,
      modelNumber: data.modelNumber,
      movement: data.movement,
      caseDiameter: data.caseDiameter,
      caseThickness: data.caseThickness,
    };

    if (mode === "edit" && product) {
      dispatch(updateProduct(productData));
    } else {
      dispatch(addProduct(productData));
    }

    setIsLoading(false);
    reset();
    setImageFiles([]);
    setExistingImages([]);
    onClose();
  };

  const handleClose = () => {
    reset();
    setImageFiles([]);
    setExistingImages([]);
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
    const brand = brands.find((b) => b.id === brandId);
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
                {product.modelNo && (
                  <tr className="border-b">
                    <td className="py-2 px-4 font-medium bg-gray-50 w-1/3">
                      Model No
                    </td>
                    <td className="py-2 px-4">{product.modelNo}</td>
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
                        {key}
                      </td>
                      <td className="py-2 px-4">{value}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sizes and Colors */}
        <Separator />

        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-4">Available Sizes</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size, index) => (
                  <div key={index} className="px-3 py-1 bg-gray-100 rounded-md text-sm">
                    {size}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {product.colors && product.colors.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-4">Available Colors</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color, index) => (
                  <div key={index} className="px-3 py-1 bg-gray-100 rounded-md text-sm">
                    {color}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div> */}
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
                      defaultValue={product?.name || ""}
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
                      {...register("price", { required: "Price is required" })}
                      placeholder="Enter price"
                      defaultValue={product?.price || ""}
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
                      {...register("stock", { required: "Stock is required" })}
                      placeholder="Enter stock quantity"
                      defaultValue={product?.stock || ""}
                    />
                    {errors.stock && (
                      <p className="text-sm text-red-500">
                        {errors.stock.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Brand</Label>
                    <Select
                      value={selectedBrand}
                      onValueChange={(value) => {
                        setSelectedBrand(value);
                        setValue("brandId", value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {!selectedBrand && mode === "add" && (
                      <p className="text-sm text-amber-600">
                        Please select a brand
                      </p>
                    )}
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
                    defaultValue={product?.description || ""}
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
                      {...register("gender")}
                      defaultValue={product?.gender || ""}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Unisex">Unisex</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="modelNo">Model No</Label>
                    <Input
                      id="modelNo"
                      {...register("modelNumber")}
                      placeholder="Enter model number"
                      defaultValue={product?.modelNo || ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="movement">Movement</Label>
                    <Input
                      id="movement"
                      {...register("movement")}
                      placeholder="Enter movement type"
                      defaultValue={product?.movement || ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="caseDiameter">Case Diameter</Label>
                    <Input
                      id="caseDiameter"
                      {...register("caseDiameter")}
                      placeholder="Enter case diameter"
                      defaultValue={product?.caseDiameter || ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="caseThickness">Case Thickness</Label>
                    <Input
                      id="caseThickness"
                      {...register("caseThickness")}
                      placeholder="Enter case thickness"
                      defaultValue={product?.caseThickness || ""}
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
              <Button
                type="submit"
                disabled={isLoading || (!selectedBrand && mode === "add")}
              >
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
