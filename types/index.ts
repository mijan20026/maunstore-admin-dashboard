export interface Brand {
  id: string;
  name: string;
  description: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubCategory {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  subCategoryId: string;
  brandId?: string;
  sizes: string[];
  colors: string[];
  images: string[];
  stock: number;
  createdAt: string;
  updatedAt: string;
  // Specification fields
  gender?: string;
  modelNo?: string;
  movement?: string;
  caseDiameter?: string;
  caseThickness?: string;
  specifications?: Record<string, string>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Size {
  id: string;
  name: string;
  value: string;
}

export interface Color {
  id: string;
  name: string;
  value: string;
}

export interface Banner {
  id: string;
  title: string;
  description: string;
  image: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface News {
  id: string;
  title: string;
  description: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}