import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth-layout";
import GlobalLayout from "./components/global-layout";
import Billing from "./pages/billing";
import Dashboard from "./pages/dashboard";
import ForgotPassword from "./pages/forgot-password";
import InterestRate from "./pages/interest-rate";
import Landing from "./pages/landing";
import Login from "./pages/login";
import NewCase from "./pages/new-case";
import Profile from "./pages/profile";
import ResetPassword from "./pages/reset-password";
import Signup from "./pages/signup";
import UserDetail from "./pages/user-detail";
import VerifyEmail from "./pages/verify-email";
import VerifyOtp from "./pages/verify-otp";
import { SystemMetrics, AnalyticsOverview } from "./pages/metrics";

function App() {
  return (
    <Routes>
      {/* Internal Analytics Routes */}
      <Route path="/analytics" element={<SystemMetrics />} />
      <Route path="/analytics/overview" element={<AnalyticsOverview />} />

      {/* Regular Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Regular User Routes */}
      <Route element={<GlobalLayout />}>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/case-detail/:id" element={<UserDetail />}></Route>
        <Route path="/new-case" element={<NewCase />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/billing" element={<Billing />}></Route>
        <Route path="/add-case" element={<NewCase />}></Route>
      </Route>
    </Routes>
  );
}

export default App;
