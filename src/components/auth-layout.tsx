import { Outlet } from "react-router-dom";
import Logo from "@/assets/img/logo.png";
import { ModeToggle } from "./mode-toggle";

const AuthLayout = () => {

  return (
    <div className="mx-auto h-screen overflow-hidden md:w-1/2">
      <div className="flex h-screen w-full flex-col items-center justify-center">
        <div className="absolute top-5 right-5">
          <ModeToggle />
        </div>
        <img src={Logo} alt="logo" className="mx-auto mb-5 w-24 rounded-lg bg-white p-2" />
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
