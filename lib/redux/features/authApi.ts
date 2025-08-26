// lib/redux/features/authApi.ts
import { api } from "./baseApi";
import { setCredentials } from "./authSlice"; // ✅ import authSlice

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
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        // ✅ added dispatch
        try {
          const { data } = await queryFulfilled;
          if (data?.data?.accessToken && data?.data?.user) {
            // Save token in localStorage
            localStorage.setItem("accessToken", data.data.accessToken);

            // ✅ Update Redux with logged-in user
            dispatch(
              setCredentials({
                user: data.data.user,
                token: data.data.accessToken,
              })
            );
          }
        } catch (err) {
          console.error("Login failed:", err);
        }
      },
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
  }),
});

export const {
  useOtpVerifyMutation,
  useResendOtpMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
