import { api } from "../features/baseApi";

export interface UserProfile {
  _id: string;
  name: string;
  role: string;
  email: string;
  profileImage: string;
  status: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  countryCode?: string;
  enterprise?: string;
}

export interface UserProfileResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: UserProfile;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  profileImage?: File | null;
  countryCode?: string;
  enterprise?: string;
}

export const settingsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<UserProfileResponse, void>({
      query: () => ({ url: "/users/profile", method: "GET" }),
      providesTags: ["Profile"],
    }),
    updateProfile: builder.mutation<UserProfileResponse, UpdateProfilePayload>({
      query: (payload) => {
        const formData = new FormData();
        const { profileImage, ...rest } = payload;

        Object.entries(rest).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, String(value)); // safer
          }
        });

        if (profileImage) {
          formData.append("profileImage", profileImage, profileImage.name);
        }

        return {
          url: "/users/profile",
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["Profile"], // will only work if declared in baseApi
    }),
  }),
  overrideExisting: false,
});

export const { useGetProfileQuery, useUpdateProfileMutation } = settingsApi;
