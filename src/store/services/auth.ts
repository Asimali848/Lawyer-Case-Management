import { setToken, setUser } from "../slices/global";
import { api } from "./core";

export const endpoints = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, LoginRequest>({
      query: (data) => {
        const formData = new FormData();
        formData.append("username", data.email);
        formData.append("password", data.password);
        return {
          url: "/api/auth/login",
          method: "POST",
          body: formData,
        };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setToken(data.access_token));
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
    }),
    register: build.mutation<RegisterResponse, RegisterRequest>({
      query: (data) => ({
        url: "/api/auth/register",
        method: "POST",
        body: data,
      }),
    }),
    verifyEmail: build.mutation<VerifyEmailResponse, VerifyEmailRequest>({
      query: (data) => ({
        url: "/api/auth/verify-email",
        method: "POST",
        body: data,
      }),
    }),
    resendOtp: build.mutation<ResendOtpResponse, ResendOtpRequest>({
      query: (data) => ({
        url: "/api/auth/resend-otp",
        method: "POST",
        body: data,
      }),
    }),
    forgotPassword: build.mutation<
      ForgotPasswordResponse,
      ForgotPasswordRequest
    >({
      query: (data) => ({
        url: "/api/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    verifyOtp: build.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: (data) => ({
        url: "/api/auth/verify-otp",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: build.mutation<ResetPasswordResponse, ResetPasswordRequest>({
      query: (data) => ({
        url: "/api/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),
    getCurrentUser: build.query<UserResponse, void>({
      query: () => ({
        url: "/api/auth/me",
        method: "GET",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyEmailMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useGetCurrentUserQuery,
} = endpoints;
