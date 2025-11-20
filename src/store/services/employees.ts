import { api } from "./core";

export const employees = api.injectEndpoints({
  endpoints: (build) => ({
    getEmployees: build.query({
      query: (id) => ({
        url: `/employees/company/${id}`,
        method: "GET",
      }),
      providesTags: ["employees"],
      transformResponse: (response: EmployeeResponse[]) => response,
    }),
    postEmployee: build.mutation({
      query: ({ id, data }: { id: string; data: Employees }) => ({
        url: `/employees/company/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["employees"],
      transformResponse: (response: EmployeeResponse) => response,
    }),
    updateEmployee: build.mutation({
      query: ({ id, data, company_id }: { id: string; data: Employees; company_id: string }) => ({
        url: `/employees/company/${company_id}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["employees"],
      transformResponse: (response: EmployeeResponse) => response,
    }),
    getEmployeebyId: build.query({
      query: ({ id, company_id }: { id: string; company_id: string }) => ({
        url: `/employees/company/${company_id}/${id}`,
        method: "GET",
      }),
      providesTags: ["employees"],
      transformResponse: (response: { message: string; status_code: number; data: EmployeeResponse }) => response.data,
    }),
    getEmployeeFile: build.query<EmployeeFile[], { id: string; company_id: string }>({
      query: ({ id, company_id }) => ({
        url: `/employees/company/${company_id}/${id}/files`,
        method: "GET",
      }),
      providesTags: ["employees"],
      transformResponse: (response: { status_code: number; message: string; data: EmployeeFile[] }) => response.data,
    }),
    deleteEmployee: build.mutation({
      query: ({ id, employeeId }: { id: string; employeeId: string }) => ({
        url: `/employees/company/${id}/${employeeId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["employees"],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useDeleteEmployeeMutation,
  usePostEmployeeMutation,
  useUpdateEmployeeMutation,
  useGetEmployeebyIdQuery,
  useGetEmployeeFileQuery,
} = employees;
