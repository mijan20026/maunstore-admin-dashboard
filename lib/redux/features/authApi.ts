import { api } from "./baseApi";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    otpVerify: builder.mutation({
      query: (data) => ({
        method: "POST",
        url: "/auth/verify-email",
        body: data,
      }),
    }),
    resendOtp: builder.mutation({
      query: (data) => ({
        method: "POST",
        url: "/auth/resend-otp",
        body: data, // typically { email: string }
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
      query: (data) => ({
        method: "POST",
        url: "/auth/reset-password",
        body: data,
      }),
    }),
  }),
});

export const {
  useOtpVerifyMutation,
  useResendOtpMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
