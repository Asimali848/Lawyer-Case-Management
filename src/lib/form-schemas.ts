import * as z from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const caseSchema = z.object({
  case_name: z.string().min(2, "Case name must be at least 2 characters"),

  court_name: z.string().min(2, "Court name must be at least 2 characters"),

  court_case_number: z.string().min(2, "Court case number must be at least 2 characters"),

  judegment_amount: z.string().min(2, "Judegment amount must be at least 2 characters"),

  judgement_date: z.string().min(2, "Judgement date must be at least 2 characters"),

  last_payment_date: z.string().min(2, "Last payment date must be at least 2 characters"),

  total_payment_to_date: z.string().min(2, "Total payment to date must be at least 2 characters"),

  interest_to_date: z.string().min(2, "Interest to date must be at least 2 characters"),

  today_payoff: z.string().min(2, "Today payoff must be at least 2 characters"),
});

export const employeesSchema = z.object({
  name: z
    .string()
    .min(2, "Full name is required")
    .regex(/^[a-zA-Z\s]+$/, "Name must only contain letters and spaces"),

  email: z
    .string()
    .min(1, "Email is required")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),

  password: z.string().min(6, "Password must be at least 6 characters").optional(),

  date_of_birth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date of Birth must be in YYYY-MM-DD format")
    .optional(),

  user_phone_number: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, "Phone number must be 10-15 digits and may start with +")
    .optional(),

  user_designation: z
    .string()
    .min(2, "Designation is required")
    .regex(/^[a-zA-Z\s\-_/]+$/, "Designation must only contain letters, spaces, -, /, or _")
    .optional(),

  department: z
    .string()
    .min(2, "Department is required")
    .regex(/^[a-zA-Z\s]+$/, "Department must only contain letters and spaces")
    .optional(),

  salary: z.number().min(0, "Salary must be a positive number"),

  is_role_model: z.boolean().optional(),
  is_candidate: z.boolean().optional(),

  files: z.array(z.instanceof(File)).optional(),
});

export const transactionSchema = z.object({
  payment_date: z.string().min(1, "Payment date is required"),
  payment_amount: z.string().min(1, "Payment amount is required"),
  payment_method: z.string().optional(),
  payment_status: z.string().optional(),
  payment_notes: z.string().optional(),
});