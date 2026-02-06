import { api } from "./core";

export interface SubscriptionStatus {
  id: string;
  user_id: string;
  subscription_type: "free" | "premium" | "admin";
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  trial_end: string | null;
  created_at: string;
  updated_at: string;
}

// Trial period configuration (30 days)
export const FREE_TRIAL_DAYS = 30;

// Helper function to check if user is within trial period
export const isUserInTrialPeriod = (
  subscriptionCreatedAt: string | null,
): boolean => {
  if (!subscriptionCreatedAt) return false;
  const createdAt = new Date(subscriptionCreatedAt);
  const trialEnd = new Date(createdAt);
  trialEnd.setDate(trialEnd.getDate() + FREE_TRIAL_DAYS);
  return new Date() < trialEnd;
};

// Helper function to get trial days remaining
export const getTrialDaysRemaining = (
  subscriptionCreatedAt: string | null,
): number => {
  if (!subscriptionCreatedAt) return 0;
  const createdAt = new Date(subscriptionCreatedAt);
  const trialEnd = new Date(createdAt);
  trialEnd.setDate(trialEnd.getDate() + FREE_TRIAL_DAYS);
  const remaining = Math.ceil(
    (trialEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  return Math.max(0, remaining);
};

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
