// import { api } from "../features/baseApi";
// import { Category } from "@/types"; // Make sure you have a Category type defined

// export interface CategoriesApiResponse {
//   success: boolean;
//   message: string;
//   statusCode: number;
//   data: {
//     meta: {
//       page: number;
//       limit: number;
//       total: number;
//       totalPage: number;
//     };
//     data: Category[];
//   };
// }

// export const categoriesApi = api.injectEndpoints({
//   endpoints: (builder) => ({
//     getCategories: builder.query<CategoriesApiResponse, void>({
//       query: () => ({
//         url: "/categories", // backend endpoint path
//         method: "GET",
//       }),
//     }),
//   }),
// //   overrideExisting: false,
// });

// export const { useGetCategoriesQuery } = categoriesApi;

import { api } from "../features/baseApi";
import { Category } from "@/types";

export interface CategoriesApiResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Category[];
}

export const categoriesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<CategoriesApiResponse, void>({
      query: () => ({
        url: "/categories",
        method: "GET",
      }),
      providesTags: ["Category"],
    }),

    addCategory: builder.mutation<
      Category,
      { name: string; description: string; imageFile: File; brandId: string }
    >({
      query: ({ name, description, imageFile, brandId }) => {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("image", imageFile);
        formData.append("brandId", brandId);

        return {
          url: "/categories",
          method: "POST",
          body: formData, // multipart/form-data
        };
      },
      invalidatesTags: ["Category"],
    }),

    updateCategory: builder.mutation<
      Category,
      {
        _id: string;
        name?: string;
        description?: string;
        imageFile?: File;
        brandId?: string;
      }
    >({
      query: ({ _id, name, description, imageFile, brandId }) => {
        const formData = new FormData();
        if (name) formData.append("name", name);
        if (description) formData.append("description", description);
        if (imageFile) formData.append("image", imageFile);
        if (brandId) formData.append("brandId", brandId);

        return {
          url: `/categories/${_id}`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["Category"],
    }),

    deleteCategory: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
