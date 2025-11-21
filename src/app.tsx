import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth-layout";
import GlobalLayout from "./components/global-layout";
import Billing from "./pages/billing";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import NewCase from "./pages/new-case";
import Profile from "./pages/profile";
import UserDetail from "./pages/user-detail";

function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route index element={<Login />} />
      </Route>
      <Route element={<GlobalLayout />}>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/case-detail" element={<UserDetail />}></Route>
        <Route path="/new-case" element={<NewCase />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/billing" element={<Billing />}></Route>
        <Route path="/add-case" element={<NewCase />}></Route>
      </Route>
    </Routes>
  );
}

export default App;
