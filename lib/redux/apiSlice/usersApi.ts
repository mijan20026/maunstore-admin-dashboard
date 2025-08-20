import { api } from "../features/baseApi";
import { User } from "@/types";

export interface UsersApiResponse {
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
    data: User[];
  };
}

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Corrected endpoint name
    getUsers: builder.query<UsersApiResponse, void>({
      query: () => ({
        url: "/users", // backend endpoint path
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

// ✅ Export the correct hook
export const { useGetUsersQuery } = usersApi;
