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
        url: "/brands", // backend endpoint path
        method: "GET",
      }),
    }),
  }),
  // overrideExisting: false,
});

export const { useGetBrandsQuery } = brandsApi;
