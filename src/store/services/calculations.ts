import { api } from "./core";
import { getCurrentDate } from "@/lib/utils";

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
      { limit?: number; offset?: number; current_date?: string }
    >({
      query: ({ limit = 50, offset = 0, current_date } = {}) => {
        const date = current_date || getCurrentDate();
        return {
          url: `/api/calc/history?limit=${limit}&offset=${offset}&current_date=${date}`,
          method: "GET",
        };
      },
      providesTags: ["calculations"],
    }),
    getCalculation: build.query<
      CalculationDetailResponse,
      { id: string; current_date?: string }
    >({
      query: ({ id, current_date }) => {
        const date = current_date || getCurrentDate();
        return {
          url: `/api/calc/${id}?current_date=${date}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, { id }) => [{ type: "calculations", id }],
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
    addTransaction: build.mutation<
      { message: string; transaction_id: string; calculation_id: string },
      { calculationId: string; transaction: TransactionRequest }
    >({
      query: ({ calculationId, transaction }) => ({
        url: `/api/calc/${calculationId}/transactions`,
        method: "POST",
        body: transaction,
      }),
      invalidatesTags: (_result, _error, { calculationId }) => [
        { type: "calculations", id: calculationId },
        "calculations",
      ],
    }),
    updateTransaction: build.mutation<
      { message: string; transaction_id: string; calculation_id: string },
      {
        calculationId: string;
        transactionId: string;
        transaction: TransactionRequest;
      }
    >({
      query: ({ calculationId, transactionId, transaction }) => ({
        url: `/api/calc/${calculationId}/transactions/${transactionId}`,
        method: "PUT",
        body: transaction,
      }),
      invalidatesTags: (_result, _error, { calculationId }) => [
        { type: "calculations", id: calculationId },
        "calculations",
      ],
    }),
    deleteTransaction: build.mutation<
      { message: string; transaction_id: string; calculation_id: string },
      { calculationId: string; transactionId: string }
    >({
      query: ({ calculationId, transactionId }) => ({
        url: `/api/calc/${calculationId}/transactions/${transactionId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { calculationId }) => [
        { type: "calculations", id: calculationId },
        "calculations",
      ],
    }),
  }),
});

export const {
  useCreateCalculationMutation,
  useGetCalculationsQuery,
  useGetCalculationQuery,
  useUpdateCalculationMutation,
  useDeleteCalculationMutation,
  useAddTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} = calculationsApi;
