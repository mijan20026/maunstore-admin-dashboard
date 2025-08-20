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

export const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET ALL
    getProducts: builder.query<ProductsApiResponse, void>({
      query: () => ({
        url: "/products",
        method: "GET",
      }),
      providesTags: ["Products"],
    }),

    // ✅ ADD PRODUCT
    addProduct: builder.mutation<
      { success: boolean; message: string; data: Product },
      Partial<Product>
    >({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products"],
    }),

    // ✅ UPDATE PRODUCT
    updateProduct: builder.mutation<
      { success: boolean; message: string; data: Product },
      { id: string; updates: Partial<Product> }
    >({
      query: ({ id, updates }) => ({
        url: `/products/${id}`,
        method: "PUT", // or PATCH if your backend uses patch
        body: updates,
      }),
      invalidatesTags: ["Products"],
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
      invalidatesTags: ["Products"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
