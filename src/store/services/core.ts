import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/types/global";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_API_URL as string,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).global.token;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  },
});

const baseQueryWith401Handling: typeof baseQuery = async (
  args,
  api,
  extraOptions,
) => {
  const result = await baseQuery(args, api, extraOptions);

  if ((result.error?.status === 401 || result.error?.status === 403) && typeof args === 'object' && (args as any)?.url !== "/api/auth/login") {
    localStorage.clear();
    setTimeout(() => {
      window.location.replace("/");
    }, 1000);
  }

  return result;
};

export const api = createApi({
  baseQuery: baseQueryWith401Handling,
  keepUnusedDataFor: 5,
  tagTypes: [
    "employees",
    "companies",
    "policies",
    "calculations",
    "subscription",
    "user",
    "sharing",
  ],
  endpoints: (build) => ({
    healthCheck: build.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
      transformResponse: (response: { status: string; message: string }) =>
        response,
    }),
  }),
});
