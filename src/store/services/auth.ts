import { setToken } from "../slices/global";
import { api } from "./core";

export const endpoints = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (data: PostLogin) => ({
        url: "/api/auth/login",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = (await queryFulfilled) as { data: PostLoginResponse };
        dispatch(setToken(data.data.access_token));
      },
    }),
  }),
});

export const { useLoginMutation } = endpoints;
