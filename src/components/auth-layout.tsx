import { Outlet } from "react-router-dom";
import Logo from "@/assets/img/logo.png";

const AuthLayout = () => {
  return (
    <div className="mx-auto h-screen overflow-hidden md:w-1/2">
      <div className="flex h-screen w-full flex-col items-center justify-center">
        <div className="absolute top-5 right-5">
        </div>
        <img src={Logo} alt="logo" className="mx-auto mb-5 w-24 rounded-lg bg-white p-2" />
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
