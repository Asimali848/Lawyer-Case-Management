import { api } from "./core";

export const sharingApi = api.injectEndpoints({
  endpoints: (build) => ({
    // Generate or retrieve share link (authenticated, owner-only)
    generateShareLink: build.mutation<GenerateShareLinkResponse, string>({
      query: (calculationId) => ({
        url: `/api/share/link/${calculationId}`,
        method: "POST",
      }),
      invalidatesTags: ["sharing"],
    }),

    // Deactivate share link (authenticated, owner-only)
    deactivateShareLink: build.mutation<{ message: string }, string>({
      query: (linkId) => ({
        url: `/api/share/link/${linkId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["sharing"],
    }),

    // Public: get shared case data (NO auth required)
    getPublicSharedCase: build.query<PublicSharedCaseResponse, string>({
      query: (token) => ({
        url: `/api/share/public/${token}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGenerateShareLinkMutation,
  useDeactivateShareLinkMutation,
  useGetPublicSharedCaseQuery,
} = sharingApi;
