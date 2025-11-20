import { Outlet } from "react-router-dom";
import LoginImage from "@/assets/img/auth.jpg";
import Logo from "@/assets/img/logo.jpg";
import LogoBlack from "@/assets/img/logo-black.jpg";
import { ModeToggle } from "./mode-toggle";
import { useTheme } from "./theme-provider";

const AuthLayout = () => {
  const { theme } = useTheme();

  return (
    <div className="mx-auto grid h-screen grid-cols-1 overflow-hidden md:w-1/2 lg:w-full lg:grid-cols-2">
      <div className="col-span-1 hidden h-full w-full lg:flex">
        <img src={LoginImage} alt="login-image" className="h-full w-full object-cover" />
      </div>
      <div className="col-span-1 flex h-screen w-full flex-col items-center justify-center">
        <div className="absolute top-5 right-5">
          <ModeToggle />
        </div>
        <img src={theme === "dark" ? Logo : LogoBlack} alt="logo" className="mx-auto mb-5 w-24 rounded-lg" />
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
