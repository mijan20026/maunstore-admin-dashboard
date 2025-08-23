import { api } from "../features/baseApi";
import { Brand } from "@/types";

export interface BrandsApiResponse {
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
    data: Brand[];
  };
}

export const brandsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query<BrandsApiResponse, void>({
      query: () => ({
        url: "/brands",
        method: "GET",
      }),
      providesTags: ["Brand"],
    }),

    addBrand: builder.mutation<
      Brand,
      { name: string; description: string; imageFile: File }
    >({
      query: ({ name, description, imageFile }) => {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("image", imageFile);

        return {
          url: "/brands",
          method: "POST",
          body: formData, // ✅ multipart/form-data
        };
      },
      invalidatesTags: ["Brand"],
    }),

    updateBrand: builder.mutation<
      Brand,
      { _id: string; name?: string; description?: string; imageFile?: File }
    >({
      query: ({ _id, name, description, imageFile }) => {
        const formData = new FormData();
        if (name) formData.append("name", name);
        if (description) formData.append("description", description);
        if (imageFile) formData.append("image", imageFile);

        return {
          url: `/brands/${_id}`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["Brand"],
    }),

    deleteBrand: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/brands/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Brand"],
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useAddBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandsApi;
