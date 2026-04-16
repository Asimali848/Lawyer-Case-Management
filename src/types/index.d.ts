declare type GlobalState = {
  selectedCompany: string;
  token: string;
  user: User;
};

declare type PostLogin = {
  email: string;
  password: string;
};

declare type User = {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  first_name?: string;
  last_name?: string;
  firm_name?: string;
  street_address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  website?: string;
  profile_picture_url?: string | null;
  profile_picture_id?: string | null;
  is_active?: boolean;
  is_admin?: boolean;
  is_verified?: boolean;
  created_at?: string;
  updated_at?: string;
};

// Auth Types
declare type LoginRequest = {
  email: string;
  password: string;
};

declare type LoginResponse = {
  access_token: string;
  token_type: string;
};

declare type RegisterRequest = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

declare type RegisterResponse = {
  id: string;
  name: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_admin: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  message?: string;
};

declare type VerifyEmailRequest = {
  email: string;
  otp: string;
};

declare type VerifyEmailResponse = {
  message: string;
};

declare type ResendOtpRequest = {
  email: string;
};

declare type ResendOtpResponse = {
  message: string;
};

declare type ForgotPasswordRequest = {
  email: string;
};

declare type ForgotPasswordResponse = {
  message: string;
};

declare type VerifyOtpRequest = {
  email: string;
  otp: string;
};

declare type VerifyOtpResponse = {
  message: string;
  reset_token: string;
};

declare type ResetPasswordRequest = {
  email: string;
  reset_token: string;
  new_password: string;
};

declare type ResetPasswordResponse = {
  message: string;
};

declare type UserResponse = User;

declare type PostLoginResponse = {
  status: string;
  message: string;
  data: {
    access_token: string;
    role: string;
    email: string;
  };
};

// Calculation/Case Types
declare type PaymentEvent = {
  date: string;
  amount: number;
};

declare type CostEvent = {
  date: string;
  amount: number;
};

declare type CalculationRequest = {
  case_name?: string;
  client_name?: string;
  court_name?: string;
  court_number?: string;
  lawyer_name?: string;
  firm_name?: string;
  street_address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  lawyer_phone?: string;
  lawyer_email?: string;
  judgment_amount: number;
  judgment_date: string;
  end_date: string;
  annual_interest_rate?: number;
  payments?: PaymentEvent[];
  costs?: CostEvent[];
};

declare type TimelineEntry = {
  event_date: string;
  event_type: string;
  days_since_last_event: number;
  interest_accrued: number;
  payment_amount?: number;
  cost_amount?: number;
  applied_to_interest: number;
  applied_to_principal: number;
  remaining_principal: number;
  unpaid_interest: number;
};

declare type CalculationResponse = {
  initial_principal: number;
  daily_interest: number;
  days: number;
  principal_reduction: number;
  total_costs: number;
  interest_to_date: number;
  interest_accrued: number;
  total_interest_accrued: number;
  remaining_principal: number;
  total_due: number;
  timeline: TimelineEntry[];
  disclaimer?: string;
};

declare type CalculationDetailResponse = CalculationResponse & {
  id?: string;
  case_name?: string;
  client_name?: string;
  court_name?: string;
  court_number?: string;
  lawyer_name?: string;
  firm_name?: string;
  street_address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  lawyer_phone?: string;
  lawyer_email?: string;
  judgment_amount: number;
  judgment_date: string;
  end_date: string;
  annual_interest_rate: number;
  external_id?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  transactions?: TransactionData[];
  unpaid_interest?: number;
};

declare type TransactionData = {
  id: string;
  calculation_id: string;
  transaction_date: string;
  payment_amount: number;
  cost_amount: number;
  description?: string;
  created_at?: string;
  accrued_interest: number;
  principal_balance: number;
};

declare type TransactionRequest = {
  transaction_date: string;
  transaction_type: "payment" | "cost";
  amount: number;
  description?: string;
};

declare type CalculationDetail = {
  id: string;
  case_name: string;
  client_name?: string;
  court_name?: string;
  court_number?: string;
  lawyer_name?: string;
  firm_name?: string;
  street_address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  lawyer_phone?: string;
  lawyer_email?: string;
  judgment_amount: number;
  annual_interest_rate: number;
  judgment_date: string;
  end_date: string;
  external_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  transactions?: Transaction[];
  calculation_request?: CalculationRequest;
};

declare type Transaction = {
  id: string;
  calculation_id: string;
  transaction_type: "payment" | "cost";
  transaction_date: string;
  amount: number;
  created_at: string;
};

declare type GetCalculationsResponse = {
  calculations: CalculationDetail[];
  limit: number;
  offset: number;
};

declare type CaseAdd = {
  id?: string;
  case_name: string;
  court_name: string;
  court_case_number: string;
  judegment_amount: number;
  judgement_date: string;
  end_date: string;
  firm_name?: string;
  email?: string;
  website?: string;
  street_address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  phone_number?: string;
};

declare type CaseGet = {
  id?: string;
  case_name: string;
  court_name: string;
  court_case_number: string;
  judegment_amount: string;
  judgement_date: string;
  last_payment_date: string;
  total_payment_to_date: string;
  interest_to_date: string;
  today_payoff: string;
};

declare type Payment = {
  id: string;
  payment_date: string;
  transaction_type: "PAYMENT" | "COST";
  payment_amount: string;
  accrued_interest: string;
  principal_balance: string;
  description: string;
  payment_method?: string;
  payment_status?: string;
  payment_notes?: string;
};

// Company and Employee types
declare type CompanyInfo = {
  id?: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
};

declare type CompanyFile = {
  id: string;
  company_id?: string;
  filename: string;
  file_type: string;
  file_path?: string;
  upload_date: string;
  created_at?: string;
};

declare type Policy = {
  id: string;
  company_id?: string;
  title: string;
  content: string;
  version?: string;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
};

declare type Employees = {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  position?: string;
  department?: string;
  hire_date?: string;
  is_active?: boolean;
};

declare type EmployeeResponse = Employees & {
  id: string;
  created_at: string;
  updated_at?: string;
};

declare type EmployeeFile = {
  id: string;
  employee_id: string;
  filename: string;
  file_type: string;
  file_path?: string;
  upload_date: string;
  created_at?: string;
};

// Payoff Demand Types
declare type PayoffDemandRequest = {
  payoff_date: string;
};

declare type PayoffTransaction = {
  date: string;
  type: "PAYMENT" | "COST";
  amount: number;
  description?: string;
};

declare type PayoffDemandResponse = {
  case_id: string;
  case_name?: string;
  client_name?: string;
  court_name?: string;
  court_case_number?: string;
  judgment_amount: number;
  judgment_date: string;
  payoff_date: string;
  lawyer_name?: string;
  firm_name?: string;
  street_address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  lawyer_phone?: string;
  lawyer_email?: string;
  principal_balance: number;
  accrued_interest: number;
  total_payoff: number;
  daily_interest_rate: number;
  daily_interest_amount: number;
  transactions_included: PayoffTransaction[];
  annual_interest_rate: number;
  total_payments_made: number;
  total_costs_added: number;
};

// ============================================================================
// Sharing Types (Public sharing — no auth required for viewing)
// ============================================================================

declare type ShareLink = {
  id: string;
  calculation_id?: string;
  token: string;
  is_active: boolean;
  created_at: string;
};

declare type GenerateShareLinkResponse = ShareLink;

declare type PublicTransaction = {
  date: string;
  type: "PAYMENT" | "COST";
  amount: number;
  description: string;
  accrued_interest: number;
  principal_balance: number;
};

declare type PublicSharedCaseResponse = {
  case_name: string;
  court_name: string;
  judgment_amount: number;
  judgment_date: string;
  annual_interest_rate: number;
  end_date: string;
  total_due: number;
  total_interest_accrued: number;
  principal_reduction: number;
  transactions: PublicTransaction[];
};


