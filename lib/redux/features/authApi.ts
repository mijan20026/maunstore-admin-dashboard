import { api } from "./baseApi";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    otpVerify: builder.mutation({
      query: (data) => ({
        method: "POST",
        url: "/auth/otp-verify",
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
      query: (data) => ({
        method: "POST",
        url: "/auth/forgot-password",
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
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
