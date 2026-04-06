import { api } from "./core";

export const sharingApi = api.injectEndpoints({
  endpoints: (build) => ({
    // --- Share Links ---
    generateShareLink: build.mutation<GenerateShareLinkResponse, string>({
      query: (calculationId) => ({
        url: `/api/share/link/${calculationId}`,
        method: "POST",
      }),
      invalidatesTags: ["sharing"],
    }),
    getShareLinks: build.query<ShareLinksResponse, string>({
      query: (calculationId) => ({
        url: `/api/share/link/${calculationId}`,
        method: "GET",
      }),
      providesTags: ["sharing"],
    }),
    deactivateShareLink: build.mutation<{ message: string }, string>({
      query: (linkId) => ({
        url: `/api/share/link/${linkId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["sharing"],
    }),

    // --- Access ---
    validateShareToken: build.query<AccessStatusResponse, string>({
      query: (token) => ({
        url: `/api/share/access/${token}`,
        method: "GET",
      }),
    }),

    // --- Request Management ---
    getAccessRequests: build.query<AccessRequestsResponse, void>({
      query: () => ({
        url: "/api/share/requests",
        method: "GET",
      }),
      providesTags: ["notifications"],
    }),
    approveAccess: build.mutation<
      { message: string },
      { calculationId: string; userId: string }
    >({
      query: ({ calculationId, userId }) => ({
        url: `/api/share/approve/${calculationId}/${userId}`,
        method: "POST",
      }),
      invalidatesTags: ["notifications", "sharing"],
    }),
    rejectAccess: build.mutation<
      { message: string },
      { calculationId: string; userId: string }
    >({
      query: ({ calculationId, userId }) => ({
        url: `/api/share/reject/${calculationId}/${userId}`,
        method: "POST",
      }),
      invalidatesTags: ["notifications", "sharing"],
    }),
    revokeAccess: build.mutation<
      { message: string },
      { calculationId: string; userId: string }
    >({
      query: ({ calculationId, userId }) => ({
        url: `/api/share/revoke/${calculationId}/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["notifications", "sharing"],
    }),

    // --- Shared With Me ---
    getSharedWithMe: build.query<SharedCasesResponse, void>({
      query: () => ({
        url: "/api/share/shared-with-me",
        method: "GET",
      }),
      providesTags: ["sharing"],
    }),

    // --- Notifications ---
    getNotifications: build.query<NotificationsResponse, void>({
      query: () => ({
        url: "/api/share/notifications",
        method: "GET",
      }),
      providesTags: ["notifications"],
    }),
    markNotificationsRead: build.mutation<
      { message: string },
      { notification_ids?: string[]; mark_all?: boolean; notification_type?: string }
    >({
      query: (data) => ({
        url: "/api/share/notifications/read",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["notifications"],
    }),
    getUnreadCount: build.query<NotificationCountResponse, void>({
      query: () => ({
        url: "/api/share/notifications/count",
        method: "GET",
      }),
      providesTags: ["notifications"],
    }),
  }),
});

export const {
  useGenerateShareLinkMutation,
  useGetShareLinksQuery,
  useDeactivateShareLinkMutation,
  useValidateShareTokenQuery,
  useGetAccessRequestsQuery,
  useApproveAccessMutation,
  useRejectAccessMutation,
  useRevokeAccessMutation,
  useGetSharedWithMeQuery,
  useGetNotificationsQuery,
  useMarkNotificationsReadMutation,
  useGetUnreadCountQuery,
} = sharingApi;
