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

};

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
  payment_amount: string;
  payment_method?: string;
  payment_status?: string;
  payment_notes?: string;
};