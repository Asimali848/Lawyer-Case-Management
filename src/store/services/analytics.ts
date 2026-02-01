import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Internal metrics base query
const metricsBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_API_URL as string,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("_sys_tk");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const metricsBaseQueryWithAuth: typeof metricsBaseQuery = async (
  args,
  api,
  extraOptions,
) => {
  const result = await metricsBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401 || result.error?.status === 403) {
    localStorage.removeItem("_sys_tk");
    localStorage.removeItem("_sys_lv");
    setTimeout(() => {
      window.location.replace("/analytics");
    }, 1000);
  }

  return result;
};

// Types
export interface AccessRequest {
  identifier: string;
  access_key: string;
}

export interface AccessResponse {
  access_token: string;
  token_type: string;
  sys_level: number;
}

export interface UserWithStats {
  id: string;
  name: string | null;
  email: string;
  phone_number: string | null;
  first_name: string | null;
  last_name: string | null;
  firm_name: string | null;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  subscription_type: "free" | "premium" | "admin";
  subscription_status: string;
  case_count: number;
}

export interface EntityListResponse {
  users: UserWithStats[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface OverviewResponse {
  total_users: number;
  total_cases: number;
  verified_users: number;
  unverified_users: number;
  users_by_subscription: Record<string, number>;
}

export interface TierUpdateRequest {
  subscription_type: "free" | "premium" | "admin";
}

export interface TierUpdateResponse {
  success: boolean;
  message: string;
  user_id: string;
  new_subscription_type: string;
}

export interface StatusUpdateResponse {
  success: boolean;
  message: string;
  user_id: string;
  is_active: boolean;
}

export interface EntityParams {
  page?: number;
  page_size?: number;
  search?: string;
}

// Analytics API
export const analyticsApi = createApi({
  reducerPath: "analyticsApi",
  baseQuery: metricsBaseQueryWithAuth,
  tagTypes: ["metrics"],
  endpoints: (build) => ({
    // Access
    requestAccess: build.mutation<AccessResponse, AccessRequest>({
      query: (data) => ({
        url: "/api/sys-metrics/access",
        method: "POST",
        body: data,
      }),
    }),

    // Overview
    getOverview: build.query<OverviewResponse, void>({
      query: () => ({
        url: "/api/sys-metrics/overview",
        method: "GET",
      }),
      providesTags: ["metrics"],
    }),

    // Entities
    getEntities: build.query<EntityListResponse, EntityParams>({
      query: ({ page = 1, page_size = 20, search = "" }) => ({
        url: `/api/sys-metrics/entities`,
        method: "GET",
        params: { page, page_size, search: search || undefined },
      }),
      providesTags: ["metrics"],
    }),

    // Entity Details
    getEntityDetail: build.query<UserWithStats, string>({
      query: (entityId) => ({
        url: `/api/sys-metrics/entities/${entityId}`,
        method: "GET",
      }),
      providesTags: ["metrics"],
    }),

    // Update Tier
    updateTier: build.mutation<
      TierUpdateResponse,
      { userId: string; subscription_type: "free" | "premium" | "admin" }
    >({
      query: ({ userId, subscription_type }) => ({
        url: `/api/sys-metrics/entities/${userId}/tier`,
        method: "PUT",
        body: { subscription_type },
      }),
      invalidatesTags: ["metrics"],
    }),

    // Update Active Status
    updateStatus: build.mutation<
      StatusUpdateResponse,
      { userId: string; is_active: boolean }
    >({
      query: ({ userId, is_active }) => ({
        url: `/api/sys-metrics/entities/${userId}/status`,
        method: "PUT",
        body: { is_active },
      }),
      invalidatesTags: ["metrics"],
    }),

    // Verify
    verifyAccess: build.query<{ valid: boolean; level: number }, void>({
      query: () => ({
        url: "/api/sys-metrics/verify",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useRequestAccessMutation,
  useGetOverviewQuery,
  useGetEntitiesQuery,
  useGetEntityDetailQuery,
  useUpdateTierMutation,
  useUpdateStatusMutation,
  useVerifyAccessQuery,
} = analyticsApi;
