import { CreditCardIcon, HomeIcon, LogOutIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Logo from "@/assets/img/logo.jpg";
import LogoBlack from "@/assets/img/logo-black.jpg";
import {  
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setUser, setToken } from "@/store/slices/global";
import MaxWidthWrapper from "./max-width-wrapper";
import { ModeToggle } from "./mode-toggle";
import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";
import WarningModal from "./warning-modal";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Navbar = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState<boolean>(false);

  const Profile =() => {
    navigate("/profile");
  };

  const Home = () => {
    navigate("/dashboard");
  }

  const Membership =() => {
    navigate("/membership");
  };

  const logout = () => {
    dispatch(setToken(""));
    dispatch(setUser({} as User));

    navigate("/");
    toast.success("Logged out successfully!");
  };

  return (
    <>
      <nav className="fixed top-0 z-[2] h-16 w-full border-b backdrop-blur">
        <MaxWidthWrapper className="flex items-center justify-between px-5 py-2.5 xl:px-0">
          <img
            src={theme === "dark" ? Logo : LogoBlack}
            alt="logo"
            className="h-full rounded-md"
            onClick={() => navigate("/dashboard")}
          />
          <div className="flex items-center justify-center gap-2.5">
            {/* <div className="hidden items-center justify-center gap-2.5 sm:flex">
              <Button size="sm" variant="destructive" onClick={() => setOpen(true)}>
                Logout
              </Button>
              <ModeToggle />
            </div> */}
            <div className="">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar> 
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Button className="w-full" variant="default" size="sm" onClick={() => Home()} >
                     <HomeIcon className="size-4 text-white" /> Home
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Button className="w-full" variant="default" size="sm" onClick={() => Profile()} >
                      <UserIcon className="size-4 text-white" /> Profile
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Button className="w-full" variant="default" size="sm" onClick={() => Membership()} >
                      <CreditCardIcon className="size-4 text-white" /> Billing
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Button className="w-full" variant="destructive" size="sm" onClick={() => setOpen(true)}>
                      <LogOutIcon className="size-4 text-white" /> Logout
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <span className="">
              <ModeToggle />
            </span>
          </div>
        </MaxWidthWrapper>
      </nav>
      <WarningModal
        open={open}
        title="Are you sure?"
        text="You'll be signed out of your account."
        setOpen={setOpen}
        cta={logout}
      />
    </>
  );
};

export default Navbar;
