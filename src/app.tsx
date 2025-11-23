import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth-layout";
import GlobalLayout from "./components/global-layout";
import Billing from "./pages/billing";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Signup from "./pages/signup";
import VerifyEmail from "./pages/verify-email";
import ForgotPassword from "./pages/forgot-password";
import VerifyOtp from "./pages/verify-otp";
import ResetPassword from "./pages/reset-password";
import NewCase from "./pages/new-case";
import Profile from "./pages/profile";
import UserDetail from "./pages/user-detail";

function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route index element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>
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
