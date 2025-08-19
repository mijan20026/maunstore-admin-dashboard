// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// // Define your API base URL
// const BASE_URL = "http://10.10.7.111:5003/api/v1";

// export const apiSlice = createApi({
//   reducerPath: "api",
//   baseQuery: fetchBaseQuery({
//     baseUrl: BASE_URL,
//     prepareHeaders: (headers, { getState }) => {
//       // Attach token if available
//       const token =
//         (getState() as any).auth?.token || localStorage.getItem("token");
//       if (token) {
//         headers.set("Authorization", `Bearer ${token}`);
//       }
//       return headers;
//     },
//   }),
//   tagTypes: [
//     "Category",
//     "SubCategory",
//     "Product",
//     "User",
//     "Subscription",
//     "Notification",
//   ],
//   endpoints: (builder) => ({
//     // --- LOGIN ---
//     login: builder.mutation<
//       { token: string; user: any },
//       { email: string; password: string }
//     >({
//       query: (credentials) => ({
//         url: "/auth/login",
//         method: "POST",
//         body: credentials,
//       }),
//     }),

//     // --- REGISTER ---
//     register: builder.mutation<
//       { token: string; user: any },
//       { name: string; email: string; password: string }
//     >({
//       query: (credentials) => ({
//         url: "/auth/register",
//         method: "POST",
//         body: credentials,
//       }),
//     }),

//     // --- Example Category Query ---
//     getCategories: builder.query<any[], void>({
//       query: () => "/categories",
//       providesTags: ["Category"],
//     }),
//   }),
// });

// export const { useLoginMutation, useRegisterMutation, useGetCategoriesQuery } =
//   apiSlice;

// // import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// // export const apiSlice = createApi({
// //   reducerPath: "api",
// //   baseQuery: fetchBaseQuery({
// //     baseUrl: "/api",
// //     prepareHeaders: (headers, { getState }) => {
// //       // Add auth token if available
// //       const token = (getState() as any).auth?.token;
// //       if (token) {
// //         headers.set("authorization", `Bearer ${token}`);
// //       }
// //       return headers;
// //     },
// //   }),
// //   tagTypes: [
// //     "Category",
// //     "SubCategory",
// //     "Product",
// //     "User",
// //     "Subscription",
// //     "Notification",
// //   ],
// //   endpoints: (builder) => ({
// //     // --- LOGIN ---
// //     // login: builder.mutation<
// //     //   { token: string; user: any },
// //     //   { email: string; password: string }
// //     // >({
// //     //   query: (credentials) => ({
// //     //     url: "/auth/login",
// //     //     method: "POST",
// //     //     body: credentials,
// //     //   }),
// //     // }),

// //     login: builder.mutation({
// //       query: (credentials) => ({
// //         url: "/auth/login",
// //         method: "POST",
// //         body: credentials,
// //       }),
// //     }),

// //     // --- Categories ---
// //     getCategories: builder.query({
// //       query: () => "/categories",
// //       providesTags: ["Category"],
// //     }),
// //     addCategory: builder.mutation({
// //       query: (formData) => ({
// //         url: "/categories",
// //         method: "POST",
// //         body: formData,
// //       }),
// //       invalidatesTags: ["Category"],
// //     }),
// //     updateCategory: builder.mutation({
// //       query: ({ id, formData }) => ({
// //         url: `/categories/${id}`,
// //         method: "PUT",
// //         body: formData,
// //       }),
// //       invalidatesTags: ["Category"],
// //     }),
// //     deleteCategory: builder.mutation({
// //       query: (id) => ({
// //         url: `/categories/${id}`,
// //         method: "DELETE",
// //       }),
// //       invalidatesTags: ["Category"],
// //     }),

// //     // --- SubCategories ---
// //     getSubCategories: builder.query({
// //       query: () => "/subcategories",
// //       providesTags: ["SubCategory"],
// //     }),
// //     addSubCategory: builder.mutation({
// //       query: (formData) => ({
// //         url: "/subcategories",
// //         method: "POST",
// //         body: formData,
// //       }),
// //       invalidatesTags: ["SubCategory"],
// //     }),
// //     updateSubCategory: builder.mutation({
// //       query: ({ id, formData }) => ({
// //         url: `/subcategories/${id}`,
// //         method: "PUT",
// //         body: formData,
// //       }),
// //       invalidatesTags: ["SubCategory"],
// //     }),
// //     deleteSubCategory: builder.mutation({
// //       query: (id) => ({
// //         url: `/subcategories/${id}`,
// //         method: "DELETE",
// //       }),
// //       invalidatesTags: ["SubCategory"],
// //     }),

// //     // --- Products ---
// //     getProducts: builder.query({
// //       query: () => "/products",
// //       providesTags: ["Product"],
// //     }),
// //     addProduct: builder.mutation({
// //       query: (formData) => ({
// //         url: "/products",
// //         method: "POST",
// //         body: formData,
// //       }),
// //       invalidatesTags: ["Product"],
// //     }),
// //     updateProduct: builder.mutation({
// //       query: ({ id, formData }) => ({
// //         url: `/products/${id}`,
// //         method: "PUT",
// //         body: formData,
// //       }),
// //       invalidatesTags: ["Product"],
// //     }),
// //     deleteProduct: builder.mutation({
// //       query: (id) => ({
// //         url: `/products/${id}`,
// //         method: "DELETE",
// //       }),
// //       invalidatesTags: ["Product"],
// //     }),

// //     // --- Users ---
// //     getUsers: builder.query({
// //       query: () => "/users",
// //       providesTags: ["User"],
// //     }),

// //     // --- Subscriptions ---
// //     getSubscriptions: builder.query({
// //       query: () => "/subscriptions",
// //       providesTags: ["Subscription"],
// //     }),

// //     // --- Notifications ---
// //     getNotifications: builder.query({
// //       query: () => "/notifications",
// //       providesTags: ["Notification"],
// //     }),
// //   }),
// // });

// // export const {
// //   useLoginMutation,
// //   useGetCategoriesQuery,
// //   useAddCategoryMutation,
// //   useUpdateCategoryMutation,
// //   useDeleteCategoryMutation,
// //   useGetSubCategoriesQuery,
// //   useAddSubCategoryMutation,
// //   useUpdateSubCategoryMutation,
// //   useDeleteSubCategoryMutation,
// //   useGetProductsQuery,
// //   useAddProductMutation,
// //   useUpdateProductMutation,
// //   useDeleteProductMutation,
// //   useGetUsersQuery,
// //   useGetSubscriptionsQuery,
// //   useGetNotificationsQuery,
// // } = apiSlice;

// // import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// // export const apiSlice = createApi({
// //   reducerPath: "api",
// //   baseQuery: fetchBaseQuery({
// //     baseUrl: "/api",
// //     prepareHeaders: (headers, { getState }) => {
// //       // Add auth token if available
// //       const token = (getState() as any).auth.token;
// //       if (token) {
// //         headers.set("authorization", `Bearer ${token}`);
// //       }
// //       return headers;
// //     },
// //   }),
// //   tagTypes: [
// //     "Category",
// //     "SubCategory",
// //     "Product",
// //     "User",
// //     "Subscription",
// //     "Notification",
// //   ],
// //   endpoints: (builder) => ({
// //     // Categories
// //     getCategories: builder.query({
// //       query: () => "/categories",
// //       providesTags: ["Category"],
// //     }),
// //     addCategory: builder.mutation({
// //       query: (formData) => ({
// //         url: "/categories",
// //         method: "POST",
// //         body: formData,
// //       }),
// //       invalidatesTags: ["Category"],
// //     }),
// //     updateCategory: builder.mutation({
// //       query: ({ id, formData }) => ({
// //         url: `/categories/${id}`,
// //         method: "PUT",
// //         body: formData,
// //       }),
// //       invalidatesTags: ["Category"],
// //     }),
// //     deleteCategory: builder.mutation({
// //       query: (id) => ({
// //         url: `/categories/${id}`,
// //         method: "DELETE",
// //       }),
// //       invalidatesTags: ["Category"],
// //     }),
// //     // Sub Categories
// //     getSubCategories: builder.query({
// //       query: () => "/subcategories",
// //       providesTags: ["SubCategory"],
// //     }),
// //     addSubCategory: builder.mutation({
// //       query: (formData) => ({
// //         url: "/subcategories",
// //         method: "POST",
// //         body: formData,
// //       }),
// //       invalidatesTags: ["SubCategory"],
// //     }),
// //     updateSubCategory: builder.mutation({
// //       query: ({ id, formData }) => ({
// //         url: `/subcategories/${id}`,
// //         method: "PUT",
// //         body: formData,
// //       }),
// //       invalidatesTags: ["SubCategory"],
// //     }),
// //     deleteSubCategory: builder.mutation({
// //       query: (id) => ({
// //         url: `/subcategories/${id}`,
// //         method: "DELETE",
// //       }),
// //       invalidatesTags: ["SubCategory"],
// //     }),
// //     // Products
// //     getProducts: builder.query({
// //       query: () => "/products",
// //       providesTags: ["Product"],
// //     }),
// //     addProduct: builder.mutation({
// //       query: (formData) => ({
// //         url: "/products",
// //         method: "POST",
// //         body: formData,
// //       }),
// //       invalidatesTags: ["Product"],
// //     }),
// //     updateProduct: builder.mutation({
// //       query: ({ id, formData }) => ({
// //         url: `/products/${id}`,
// //         method: "PUT",
// //         body: formData,
// //       }),
// //       invalidatesTags: ["Product"],
// //     }),
// //     deleteProduct: builder.mutation({
// //       query: (id) => ({
// //         url: `/products/${id}`,
// //         method: "DELETE",
// //       }),
// //       invalidatesTags: ["Product"],
// //     }),
// //     // Users
// //     getUsers: builder.query({
// //       query: () => "/users",
// //       providesTags: ["User"],
// //     }),
// //     // Subscriptions
// //     getSubscriptions: builder.query({
// //       query: () => "/subscriptions",
// //       providesTags: ["Subscription"],
// //     }),
// //     // Notifications
// //     getNotifications: builder.query({
// //       query: () => "/notifications",
// //       providesTags: ["Notification"],
// //     }),
// //   }),
// // });

// // export const {
// //   useGetCategoriesQuery,
// //   useAddCategoryMutation,
// //   useUpdateCategoryMutation,
// //   useDeleteCategoryMutation,
// //   useGetSubCategoriesQuery,
// //   useAddSubCategoryMutation,
// //   useUpdateSubCategoryMutation,
// //   useDeleteSubCategoryMutation,
// //   useGetProductsQuery,
// //   useAddProductMutation,
// //   useUpdateProductMutation,
// //   useDeleteProductMutation,
// //   useGetUsersQuery,
// //   useGetSubscriptionsQuery,
// //   useGetNotificationsQuery,
// // } = apiSlice;
