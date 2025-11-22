import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import type z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { verifyOtpSchema } from "@/lib/form-schemas";
import {
  useVerifyOtpMutation,
  useForgotPasswordMutation,
} from "@/store/services/auth";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [forgotPassword, { isLoading: isResending }] =
    useForgotPasswordMutation();
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const form = useForm<z.infer<typeof verifyOtpSchema>>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      email: emailParam,
      otp: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verifyOtpSchema>) => {
    try {
      const response = await verifyOtp(data).unwrap();
      toast.success(response.message || "OTP verified successfully!");
      navigate(
        `/reset-password?email=${encodeURIComponent(
          data.email
        )}&token=${encodeURIComponent(response.reset_token)}`
      );
    } catch (error: any) {
      toast.error(
        error?.data?.detail || "Verification failed. Please try again."
      );
    }
  };

  const handleResendOtp = async () => {
    try {
      const email = form.getValues("email");
      const response = await forgotPassword({ email }).unwrap();
      toast.success(response.message || "OTP sent successfully!");
      setCanResend(false);
      setCountdown(60);
    } catch (error: any) {
      toast.error(
        error?.data?.detail || "Failed to resend OTP. Please try again."
      );
    }
  };

  return (
    <div className="mx-auto flex w-[90%] flex-col items-center justify-center gap-8 lg:w-2/3 xl:w-1/2">
      <div className="flex w-full flex-col items-center justify-center gap-3">
        <span className="w-full text-center font-bold text-[32px] leading-[32px] md:text-[48px] md:leading-[48px]">
          Verify OTP Code
        </span>
        <span className="w-full text-center text-[#71717A] text-[14px] leading-[14px]">
          Enter the 6-digit code sent to your email
        </span>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-5"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="johndoe@example.com"
                    {...field}
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    {...field}
                    className="text-center text-2xl tracking-widest"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            variant="default"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Verify OTP"}
          </Button>
        </form>
      </Form>
      <div className="flex w-full flex-col items-center justify-center gap-2 text-[14px]">
        <span className="text-[#71717A]">Didn't receive the code?</span>
        {canResend ? (
          <Button
            type="button"
            variant="link"
            onClick={handleResendOtp}
            disabled={isResending}
            className="p-0 font-medium text-primary"
          >
            {isResending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Resend Code"
            )}
          </Button>
        ) : (
          <span className="text-[#71717A]">Resend in {countdown}s</span>
        )}
      </div>
    </div>
  );
};

export default VerifyOtp;
