// lib/redux/features/authApi.ts
import { api } from "./baseApi";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    otpVerify: builder.mutation({
      query: (data) => ({
        method: "POST",
        url: "/auth/verify-email",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data) {
            localStorage.setItem("resetToken", data.data);
          }
        } catch (err) {
          console.error("OTP verify failed:", err);
        }
      },
    }),

    resendOtp: builder.mutation({
      query: (data) => ({
        method: "POST",
        url: "/auth/resend-otp",
        body: data,
      }),
    }),

    login: builder.mutation({
      query: (data) => ({
        method: "POST",
        url: "/auth/login",
        body: data,
      }),
    }),

    forgotPassword: builder.mutation({
      query: (data: { email: string }) => ({
        method: "POST",
        url: "/auth/forget-password",
        body: data,
      }),
    }),

    resetPassword: builder.mutation({
      query: (data) => {
        const token = localStorage.getItem("resetToken");
        return {
          method: "POST",
          url: "/auth/reset-password",
          body: data,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    // ✅ New endpoints for profile update and change password
    updateProfile: builder.mutation({
      query: (data) => {
        const token = localStorage.getItem("token");
        return {
          method: "PUT",
          url: "/auth/update-profile",
          body: data,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    changePassword: builder.mutation({
      query: (data) => {
        const token = localStorage.getItem("token");
        return {
          method: "POST",
          url: "/auth/reset-password",
          body: data,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),
  }),
});

export const {
  useOtpVerifyMutation,
  useResendOtpMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = authApi;
