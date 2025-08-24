// lib/redux/apiSlice/newsApi.ts
import { api } from "../features/baseApi";
import { News } from "@/types";

export interface NewsApiResponse {
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
    data: News[];
  };
}

export const newsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNews: builder.query<NewsApiResponse, void>({
      query: () => ({
        url: "/news",
        method: "GET",
      }),
      providesTags: ["News"],
    }),

    createNews: builder.mutation<{ success: boolean; data: News }, FormData>({
      query: (formData) => ({
        url: "/news",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["News"],
    }),

    updateNews: builder.mutation<
      { success: boolean; data: News },
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/news/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["News"],
    }),

    deleteNews: builder.mutation<{ success: boolean }, { id: string }>({
      query: ({ id }) => ({
        url: `/news/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["News"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetNewsQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
} = newsApi;
