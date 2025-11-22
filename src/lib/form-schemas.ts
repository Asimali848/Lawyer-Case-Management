import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const verifyEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const verifyOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const resetPasswordSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    reset_token: z.string().min(1, "Reset token is required"),
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export const caseSchema = z.object({
  case_name: z.string().min(2, "Case name must be at least 2 characters"),
  court_name: z.string().min(2, "Court name must be at least 2 characters"),
  court_case_number: z
    .string()
    .min(2, "Court case number must be at least 2 characters"),
  judegment_amount: z.string().min(1, "Judgment amount is required"),
  judgement_date: z.string().min(1, "Judgment date is required"),
  // Optional fields for other use cases
  last_payment_date: z.string().optional(),
  total_payment_to_date: z.string().optional(),
  interest_to_date: z.string().optional(),
  today_payoff: z.string().optional(),
});

export const newCaseSchema = z.object({
  // Judgment Information (Required)
  case_name: z.string().min(2, "Case name must be at least 2 characters"),
  court_name: z.string().min(2, "Court name must be at least 2 characters"),
  court_case_number: z
    .string()
    .min(2, "Court case number must be at least 2 characters"),
  judegment_amount: z.string().min(1, "Judgment amount is required"),
  interest_rate: z.string().min(1, "Interest rate is required"),
  judgement_date: z.string().min(1, "Judgment date is required"),
  // Debtor Contact Info (Optional)
  firm_name: z.string().optional(),
  street_address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip_code: z.string().optional(),
  phone_number: z.string().optional(),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
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

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),

  date_of_birth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date of Birth must be in YYYY-MM-DD format")
    .optional(),

  user_phone_number: z
    .string()
    .regex(
      /^\+?[0-9]{10,15}$/,
      "Phone number must be 10-15 digits and may start with +"
    )
    .optional(),

  user_designation: z
    .string()
    .min(2, "Designation is required")
    .regex(
      /^[a-zA-Z\s\-_/]+$/,
      "Designation must only contain letters, spaces, -, /, or _"
    )
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
  transaction_type: z.enum(["PAYMENT", "COST"], {
    required_error: "Transaction type is required",
  }),
  payment_amount: z.string().min(1, "Payment amount is required"),
  description: z.string().optional(),
  // These fields are calculated/auto-filled, not entered by user
  accrued_interest: z.string().optional(),
  principal_balance: z.string().optional(),
  payment_method: z.string().optional(),
  payment_status: z.string().optional(),
  payment_notes: z.string().optional(),
});
