import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PasswordInput } from "@/components/ui/password-input";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
} from "@/store/services/auth";
import { useGetCurrentUserQuery } from "@/store/services/auth";

interface ChangePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ChangePasswordModal = ({
  open,
  onOpenChange,
}: ChangePasswordModalProps) => {
  const [step, setStep] = useState<"request" | "verify" | "reset">("request");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");

  const { data: userData } = useGetCurrentUserQuery();
  const [forgotPassword, { isLoading: isSendingOtp }] =
    useForgotPasswordMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resetPassword, { isLoading: isResetting }] =
    useResetPasswordMutation();

  const handleRequestOtp = async () => {
    if (!userData?.email) {
      toast.error("Email not found");
      return;
    }

    try {
      await forgotPassword({ email: userData.email }).unwrap();
      toast.success("OTP sent to your email");
      setStep("verify");
    } catch (error: any) {
      toast.error(error?.data?.detail || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    if (!userData?.email || !otp) {
      toast.error("Please enter the OTP");
      return;
    }

    try {
      const result = await verifyOtp({ email: userData.email, otp }).unwrap();
      setResetToken(result.reset_token);
      toast.success("OTP verified! Now set your new password");
      setStep("reset");
    } catch (error: any) {
      toast.error(error?.data?.detail || "Invalid or expired OTP");
    }
  };

  const handleResetPassword = async () => {
    if (!userData?.email || !resetToken) {
      toast.error("Invalid session");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    try {
      await resetPassword({
        email: userData.email,
        reset_token: resetToken,
        new_password: newPassword,
      }).unwrap();
      toast.success("Password changed successfully!");
      handleClose();
    } catch (error: any) {
      toast.error(error?.data?.detail || "Failed to change password");
    }
  };

  const handleClose = () => {
    setStep("request");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setResetToken("");
    onOpenChange(false);
  };

  const isLoading = isSendingOtp || isVerifying || isResetting;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            {step === "request" &&
              "We'll send an OTP to your email to verify it's you."}
            {step === "verify" && "Enter the OTP sent to your email."}
            {step === "reset" && "Enter your new password."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {step === "request" && (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">
                Email: <span className="font-medium">{userData?.email}</span>
              </p>
            </div>
          )}
          {step === "verify" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">OTP Code</label>
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                required
              />
            </div>
          )}
          {step === "reset" && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">New Password</label>
                <PasswordInput
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Confirm Password</label>
                <PasswordInput
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                />
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {step === "request" && (
            <Button onClick={handleRequestOtp} disabled={isLoading}>
              {isSendingOtp ? "Sending..." : "Send OTP"}
            </Button>
          )}
          {step === "verify" && (
            <Button onClick={handleVerifyOtp} disabled={isLoading}>
              {isVerifying ? "Verifying..." : "Verify OTP"}
            </Button>
          )}
          {step === "reset" && (
            <Button onClick={handleResetPassword} disabled={isLoading}>
              {isResetting ? "Changing..." : "Change Password"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordModal;
