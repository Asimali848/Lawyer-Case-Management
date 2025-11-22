import { api } from "./core";

export const calculationsApi = api.injectEndpoints({
  endpoints: (build) => ({
    createCalculation: build.mutation<CalculationResponse, CalculationRequest>({
      query: (data) => ({
        url: "/api/calc",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["calculations"],
    }),
    getCalculations: build.query<
      GetCalculationsResponse,
      { limit?: number; offset?: number }
    >({
      query: ({ limit = 50, offset = 0 } = {}) => ({
        url: `/api/calc/history?limit=${limit}&offset=${offset}`,
        method: "GET",
      }),
      providesTags: ["calculations"],
    }),
    getCalculation: build.query<CalculationDetailResponse, string>({
      query: (id) => ({
        url: `/api/calc/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "calculations", id }],
    }),
    updateCalculation: build.mutation<
      CalculationResponse,
      { id: string; data: CalculationRequest }
    >({
      query: ({ id, data }) => ({
        url: `/api/calc/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "calculations", id },
        "calculations",
      ],
    }),
    deleteCalculation: build.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/api/calc/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["calculations"],
    }),
  }),
});

export const {
  useCreateCalculationMutation,
  useGetCalculationsQuery,
  useGetCalculationQuery,
  useUpdateCalculationMutation,
  useDeleteCalculationMutation,
} = calculationsApi;
