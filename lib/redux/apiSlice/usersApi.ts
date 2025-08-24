// usersApi.ts
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
    // ✅ Get all users
    getUsers: builder.query<UsersApiResponse, void>({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
      providesTags: ["Users"],
    }),

    // ✅ Update user status (active/inactive toggle)
    updateUserStatus: builder.mutation<
      { success: boolean; message: string; data: User },
      { id: string; status: "active" | "inactive" }
    >({
      query: ({ id, status }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Users"],
    }),

    // ✅ Update user (role, name, email, etc.)
    updateUser: builder.mutation<
      { success: boolean; message: string; data: User },
      { id: string; data: Partial<User> }
    >({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    // ✅ Create new user
    createUser: builder.mutation<
      { success: boolean; message: string; data: User },
      Partial<User>
    >({
      query: (data) => ({
        url: "/users",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    // ✅ Delete user
    deleteUser: builder.mutation<
      { success: boolean; message: string },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"], // refresh list after delete
    }),
  }),
  overrideExisting: false,
});

// ✅ Export hooks
export const {
  useGetUsersQuery,
  useUpdateUserStatusMutation,
  useUpdateUserMutation,
  useCreateUserMutation,
  useDeleteUserMutation, // 👈 new hook
} = usersApi;
