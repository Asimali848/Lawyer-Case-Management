import * as z from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const companySchema = z.object({
  company_name: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .regex(/^[A-Za-z\s]+$/, "Company name must contain only alphabets"),

  company_email: z.string().email("Invalid company email address"),

  password: z.string().min(6, "Password must be at least 6 characters"),

  owner_name: z
    .string()
    .min(2, "Owner name must be at least 2 characters")
    .regex(/^[A-Za-z\s]+$/, "Owner name must contain only alphabets"),

  owner_email: z.string().email("Invalid owner email address"),

  company_size: z.string().optional(),

  company_type: z
    .string()
    .min(2, "Company type must be contain value")
    .regex(/^[A-Za-z\s]+$/, "Company type must contain only alphabets")
    .optional(),

  company_website: z.string().url("Invalid company_website URL").optional(),

  phone_number: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?[0-9]{1,4}[\s-]?(\([0-9]{1,4}\))?([\s-]?[0-9]{1,15})+$/, "Phone number must contain only numbers")
    .optional(),

  company_address: z.string().min(5, "Company address must be at least 5 characters"),

  company_description: z.string().min(10, "Description must be at least 10 characters").optional(),
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
