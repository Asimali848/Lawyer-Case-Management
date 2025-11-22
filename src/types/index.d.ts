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
  phone_number: string;
  password: string;
};

declare type RegisterResponse = {
  id: string;
  name: string;
  email: string;
  phone_number: string;
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
