import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth-layout";
import GlobalLayout from "./components/global-layout";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
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
      </Route>
    </Routes>
  );
}

export default App;
