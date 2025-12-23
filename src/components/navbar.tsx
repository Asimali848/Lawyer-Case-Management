import { CreditCardIcon, HomeIcon, LogOutIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Logo from "@/assets/img/logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setToken, setUser } from "@/store/slices/global";
import MaxWidthWrapper from "./max-width-wrapper";
import { ModeToggle } from "./mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import WarningModal from "./warning-modal";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState<boolean>(false);
  const user = useSelector(
    (state: { global: GlobalState }) => state.global?.user
  );

  const Profile = () => {
    navigate("/profile");
  };

  const Home = () => {
    navigate("/dashboard");
  };

  const Membership = () => {
    navigate("/billing");
  };

  const logout = () => {
    dispatch(setToken(""));
    dispatch(setUser({} as User));

    navigate("/");
    toast.success("Logged out successfully!");
  };

  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    if (user?.name) {
      const parts = user.name.split(" ");
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return user.name[0].toUpperCase();
    }
    return "U";
  };

  const getAvatarUrl = () => {
    if (user?.profile_picture_url) {
      return `${user.profile_picture_url}?tr=w-50,h-50,fo-face,r-max`;
    }
    return null;
  };

  return (
    <>
      <nav className="fixed top-0 z-[2] h-16 w-full border-b backdrop-blur">
        <MaxWidthWrapper className="flex items-center justify-between px-5 py-2.5 xl:px-0">
          <img
            src={Logo}
            alt="logo"
            className="h-full rounded-md dark:bg-white dark:px-1 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          />
          <div className="flex items-center justify-center gap-2.5">
            <div className="">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <Avatar>
                      {getAvatarUrl() ? (
                        <AvatarImage
                          src={getAvatarUrl()!}
                          alt="Profile"
                          className="object-cover"
                        />
                      ) : null}
                      <AvatarFallback className="bg-primary/40 text-white font-semibold">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  <DropdownMenuItem>
                    <Button
                      className="w-full gap-3.5"
                      variant="ghost"
                      size="sm"
                      onClick={() => Home()}
                    >
                      <HomeIcon className="size-4 text-primary" /> Home
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Button
                      className="w-full gap-3.5"
                      variant="ghost"
                      size="sm"
                      onClick={() => Membership()}
                    >
                      <CreditCardIcon className="size-4 text-primary" /> Billing
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Button
                      className="w-full gap-3.5"
                      variant="ghost"
                      size="sm"
                      onClick={() => Profile()}
                    >
                      <UserIcon className="size-4 text-primary" /> Profile
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Button
                      className="w-full"
                      variant="destructive"
                      size="sm"
                      onClick={() => setOpen(true)}
                    >
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
