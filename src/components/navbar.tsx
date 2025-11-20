import { MoreVertical } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { setMode, setToken } from "@/store/slices/global";
import type { RootState } from "@/types/global";
import MaxWidthWrapper from "./max-width-wrapper";
import { ModeToggle } from "./mode-toggle";
import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import WarningModal from "./warning-modal";

const Navbar = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState<boolean>(false);
  const { mode } = useSelector((state: RootState) => state.global);

  const toggleValidationMode = () => {
    if (mode === "employees") {
      dispatch(setMode("candidates"));
    } else {
      dispatch(setMode("employees"));
    }
  };

  const logout = () => {
    dispatch(setToken(null));
    dispatch(setMode(""));

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
            <div className="hidden items-center justify-center gap-2.5 sm:flex">
              <div className="flex items-center justify-center gap-2.5 pr-3">
                <span className="font-medium text-muted-foreground text-xs">Candidates</span>
                <Switch checked={mode === "employees"} onCheckedChange={toggleValidationMode} />
                <span className="font-medium text-muted-foreground text-xs">Employees</span>
              </div>
              <Button size="sm" variant="destructive" onClick={() => setOpen(true)}>
                Logout
              </Button>
              <ModeToggle />
            </div>
            <div className="sm:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-xs">Candidates</span>
                      <Switch checked={mode === "employees"} onCheckedChange={toggleValidationMode} />
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Button size="sm" className="w-full" variant="destructive" onClick={() => setOpen(true)}>
                      Logout
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <span className="sm:hidden">
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
