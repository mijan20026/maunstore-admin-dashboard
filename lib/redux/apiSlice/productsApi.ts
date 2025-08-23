import { api } from "../features/baseApi";
import { Product } from "@/app/dashboard/products/page";

// Generic API response wrapper
interface ApiResponse<T> {
  success: boolean;
  message: string;
  statusCode: number;
  data: T;
}

// API response for multiple products
export interface ProductsApiResponse {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: Product[];
}

// API payload for creating/updating product
export interface ProductPayload {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  brandId?: string;
  gender?: "MALE" | "FEMALE" | "UNISEX";
  modelNumber: string;
  movement: string;
  caseDiameter: string;
  caseThickness: string;
  images?: File[];
}

export const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET all products
    getProducts: builder.query<ApiResponse<ProductsApiResponse>, void>({
      query: () => ({ url: "/products", method: "GET" }),
      providesTags: ["Products"],
    }),

    // GET single product
    getProduct: builder.query<ApiResponse<Product>, string>({
      query: (id) => ({ url: `/products/${id}`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),

    // DELETE product
    deleteProduct: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/products/${id}`, method: "DELETE" }),
      invalidatesTags: (result, error, id) => [
        { type: "Products", id },
        "Products",
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useDeleteProductMutation,
} = productsApi;
