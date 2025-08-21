import { api } from "../features/baseApi";
import { Category } from "@/types"; // Make sure you have a Category type defined

export interface CategoriesApiResponse {
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
    data: Category[];
  };
}

export const categoriesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<CategoriesApiResponse, void>({
      query: () => ({
        url: "/categories", // backend endpoint path
        method: "GET",
      }),
    }),
  }),
//   overrideExisting: false,
});

export const { useGetCategoriesQuery } = categoriesApi;
