import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
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
import { forgotPasswordSchema } from "@/lib/form-schemas";
import { useForgotPasswordMutation } from "@/store/services/auth";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    try {
      const response = await forgotPassword(data).unwrap();
      toast.success(
        response.message || "Password reset OTP sent to your email!"
      );
      navigate(`/verify-otp?email=${encodeURIComponent(data.email)}`);
    } catch (error: any) {
      toast.error(
        error?.data?.detail || "Failed to send reset email. Please try again."
      );
    }
  };

  return (
    <div className="mx-auto flex w-[90%] flex-col items-center justify-center gap-8 lg:w-2/3 xl:w-1/2">
      <div className="flex w-full flex-col items-center justify-center gap-3">
        <span className="w-full text-center font-bold text-[32px] leading-[32px] md:text-[48px] md:leading-[48px]">
          Forgot Password?
        </span>
        <span className="w-full text-center text-[#71717A] text-[14px] leading-[14px]">
          Enter your email to receive a verification code
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
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Send Verification Code"
            )}
          </Button>
        </form>
      </Form>
      <div className="flex w-full items-center justify-center gap-2 text-[14px]">
        <span className="text-[#71717A]">Remember your password?</span>
        <Link to="/" className="font-medium text-primary hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
