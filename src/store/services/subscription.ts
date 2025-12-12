import { api } from "./core";

export interface SubscriptionStatus {
  id: string;
  user_id: string;
  subscription_type: "free" | "premium";
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  trial_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface StripeConfig {
  publishable_key: string;
  test_mode: boolean;
}

export interface StripePlan {
  price_id: string;
  amount: number;
  currency: string;
  interval: string;
  product_name: string;
}

export interface AvailablePlans {
  success: boolean;
  plans: {
    monthly: StripePlan | null;
    yearly: StripePlan | null;
  };
}

export interface CheckoutSessionRequest {
  price_id?: string;
  success_url?: string;
  cancel_url?: string;
  coupon_id?: string;
}

export interface CheckoutSessionResponse {
  session_id: string;
  url: string;
}

export interface PortalSessionRequest {
  return_url?: string;
}

export interface PortalSessionResponse {
  url: string;
}

export const subscriptionApi = api.injectEndpoints({
  endpoints: (build) => ({
    // Get Stripe configuration (publishable key, test mode)
    getStripeConfig: build.query<StripeConfig, void>({
      query: () => ({
        url: "/api/subscription/config",
        method: "GET",
      }),
    }),

    // Get available plans with real pricing from Stripe
    getAvailablePlans: build.query<AvailablePlans, void>({
      query: () => ({
        url: "/api/subscription/plans",
        method: "GET",
      }),
    }),

    // Get current subscription status
    getSubscriptionStatus: build.query<SubscriptionStatus, void>({
      query: () => ({
        url: "/api/subscription/status",
        method: "GET",
      }),
      providesTags: ["subscription"],
    }),

    // Create checkout session for upgrading to premium
    createCheckoutSession: build.mutation<
      CheckoutSessionResponse,
      CheckoutSessionRequest
    >({
      query: (data) => ({
        url: "/api/subscription/create-checkout-session",
        method: "POST",
        body: data,
      }),
    }),

    // Create customer portal session for managing subscription
    createPortalSession: build.mutation<
      PortalSessionResponse,
      PortalSessionRequest
    >({
      query: (data) => ({
        url: "/api/subscription/create-portal-session",
        method: "POST",
        body: data,
      }),
    }),

    // Cancel subscription
    cancelSubscription: build.mutation<SubscriptionStatus, void>({
      query: () => ({
        url: "/api/subscription/cancel",
        method: "POST",
      }),
      invalidatesTags: ["subscription"],
    }),
  }),
});

export const {
  useGetStripeConfigQuery,
  useGetAvailablePlansQuery,
  useGetSubscriptionStatusQuery,
  useCreateCheckoutSessionMutation,
  useCreatePortalSessionMutation,
  useCancelSubscriptionMutation,
} = subscriptionApi;
