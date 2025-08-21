"use client";

import React, { useState } from "react";
import { Modal, Button, Input, Select } from "antd";

import { useAddProductMutation } from "@/lib/redux/apiSlice/productsApi";

const { Option } = Select;

interface ProductForm {
  name: string;
  price: string;
  stock: string;
  description: string;
  images: string;
  category: string;
  gender: "MALE" | "FEMALE" | "UNISEX";
  modelNumber: string;
  movement: string;
  caseDiameter: string;
  caseThickness: string;
}

const NewProductModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    price: "",
    stock: "",
    description: "",
    images: "",
    category: "",
    gender: "MALE",
    modelNumber: "",
    movement: "",
    caseDiameter: "",
    caseThickness: "",
  });
  const [message, setMessage] = useState("");

  // RTK Query mutation
  const [addProduct] = useAddProductMutation();

  const handleChange = (field: keyof ProductForm, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Frontend validation
    const requiredFields: (keyof ProductForm)[] = [
      "name",
      "price",
      "stock",
      "description",
      "category",
      "gender",
      "modelNumber",
      "movement",
      "caseDiameter",
      "caseThickness",
    ];

    const missingFields = requiredFields.filter(
      (field) => !formData[field] || formData[field].toString().trim() === ""
    );

    if (missingFields.length > 0) {
      setMessage(
        `Please fill in the required fields: ${missingFields.join(", ")}`
      );
      return;
    }

    try {
      // Prepare cleaned data
      const cleanedData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        images: formData.images
          ? formData.images.split(",").map((img) => img.trim())
          : [],
        name: formData.name.trim(),
        description: formData.description.trim(),
        modelNumber: formData.modelNumber.trim(),
        movement: formData.movement.trim(),
        caseDiameter: formData.caseDiameter.trim(),
        caseThickness: formData.caseThickness.trim(),
        category: formData.category.trim(),
      };

      // Use FormData for consistency
      const payload = new FormData();
      payload.append("data", JSON.stringify(cleanedData));

      // If you want to support an image file, you can append here
      // Example:
      // if (selectedImage) payload.append("image", selectedImage);

      console.log("Submitting product:", cleanedData);

      // Submit via RTK Query
      const result = await addProduct(payload as any).unwrap();

      if (result.success) {
        setMessage("Product created successfully!");
        setFormData({
          name: "",
          price: "",
          stock: "",
          description: "",
          images: "",
          category: "",
          gender: "MALE",
          modelNumber: "",
          movement: "",
          caseDiameter: "",
          caseThickness: "",
        });
        setIsOpen(false);
      } else {
        setMessage("Failed to create product.");
      }
    } catch (err: any) {
      if (err?.data?.error && Array.isArray(err.data.error)) {
        const messages = err.data.error.map((e: any) => e.message).join("\n");
        console.error("Validation Errors:", messages);
        setMessage(messages);
      } else if (err?.data?.message) {
        console.error("API Error:", err.data.message);
        setMessage(err.data.message);
      } else if (err instanceof Error) {
        console.error("Error:", err.message);
        setMessage(err.message);
      } else {
        console.error("Unknown error:", err);
        setMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <>
      {/* Button to open modal */}
      <Button type="primary" onClick={() => setIsOpen(true)}>
        Add New Product
      </Button>

      <Modal
        title="Add New Product"
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            Add Product
          </Button>,
        ]}
      >
        {message && (
          <p style={{ color: "red", whiteSpace: "pre-line" }}>{message}</p>
        )}

        <Input
          placeholder="Name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          style={{ marginBottom: 8 }}
          required
        />

        <Input
          placeholder="Price"
          type="number"
          value={formData.price}
          onChange={(e) => handleChange("price", e.target.value)}
          style={{ marginBottom: 8 }}
          required
        />

        <Input
          placeholder="Stock"
          type="number"
          value={formData.stock}
          onChange={(e) => handleChange("stock", e.target.value)}
          style={{ marginBottom: 8 }}
          required
        />

        <Input.TextArea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          style={{ marginBottom: 8 }}
          required
        />

        <Input
          placeholder="Images (comma separated URLs)"
          value={formData.images}
          onChange={(e) => handleChange("images", e.target.value)}
          style={{ marginBottom: 8 }}
          required
        />

        <Input
          placeholder="Category ID"
          value={formData.category}
          onChange={(e) => handleChange("category", e.target.value)}
          style={{ marginBottom: 8 }}
          required
        />

        <Select
          value={formData.gender}
          onChange={(value) => handleChange("gender", value)}
          style={{ width: "100%", marginBottom: 8 }}
        >
          <Option value="MALE">Male</Option>
          <Option value="FEMALE">Female</Option>
          <Option value="UNISEX">Unisex</Option>
        </Select>

        <Input
          placeholder="Model Number"
          value={formData.modelNumber}
          onChange={(e) => handleChange("modelNumber", e.target.value)}
          style={{ marginBottom: 8 }}
          required
        />

        <Input
          placeholder="Movement"
          value={formData.movement}
          onChange={(e) => handleChange("movement", e.target.value)}
          style={{ marginBottom: 8 }}
          required
        />

        <Input
          placeholder="Case Diameter"
          value={formData.caseDiameter}
          onChange={(e) => handleChange("caseDiameter", e.target.value)}
          style={{ marginBottom: 8 }}
          required
        />

        <Input
          placeholder="Case Thickness"
          value={formData.caseThickness}
          onChange={(e) => handleChange("caseThickness", e.target.value)}
        />
      </Modal>
    </>
  );
};

export default NewProductModal;
