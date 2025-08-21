// lib/redux/apiSlice/productsApi.ts
import { api } from "../features/baseApi";
import { Product } from "@/app/dashboard/products/page";

export interface ProductsApiResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPage: number;
    };
    data: Product[];
  };
}

// API request payload for adding/updating products
export interface ProductPayload {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string; // Category ID as string
  gender?: string;
  modelNumber?: string;
  movement?: string;
  caseDiameter?: string;
  caseThickness?: string;
  images?: string[]; // Array of image URLs
}

// API response for single product operations
export interface SingleProductResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Product;
}

export const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET ALL PRODUCTS
    getProducts: builder.query<ProductsApiResponse, void>({
      query: () => ({
        url: "/products",
        method: "GET",
      }),
      providesTags: ["Products"],
    }),

    // ✅ GET SINGLE PRODUCT
    getProduct: builder.query<SingleProductResponse, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),

    // ✅ ADD PRODUCT
    addProduct: builder.mutation<SingleProductResponse, ProductPayload>({
      query: (data) => ({
        url: "/products",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Products"], // Refresh product list after adding
    }),

    // ✅ DELETE PRODUCT
    deleteProduct: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Products", id },
        "Products",
      ],
      transformResponse: (response: any) => {
        console.log("Delete Product Response:", response);
        return response;
      },
      transformErrorResponse: (response: any) => {
        console.error("Delete Product Error:", response);
        return response;
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useAddProductMutation,
  useDeleteProductMutation,
} = productsApi;
