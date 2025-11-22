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
import { loginSchema } from "@/lib/form-schemas";
import { useLoginMutation } from "@/store/services/auth";

const Login = () => {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      await login(data).unwrap();
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error: any) {
      const errorMessage =
        error?.data?.detail || "Login failed. Please check your credentials.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="mx-auto flex w-[90%] flex-col items-center justify-center gap-8 lg:w-2/3 xl:w-1/2">
      <div className="flex w-full flex-col items-center justify-center gap-3">
        <span className="w-full text-center font-bold text-[32px] leading-[32px] md:text-[48px] md:leading-[48px]">
          Welcome to
          <br /> JudgmentCalc
        </span>
        <span className="w-full text-center text-[#71717A] text-[14px] leading-[14px]">
          Enter your credentials to login.
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="• • • • • • • •"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex w-full justify-end">
            <Link
              to="/forgot-password"
              className="text-[14px] font-medium text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
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
              "Sign In with Email"
            )}
          </Button>
        </form>
      </Form>
      <div className="flex w-full items-center justify-center gap-2 text-[14px]">
        <span className="text-[#71717A]">Don't have an account?</span>
        <Link to="/signup" className="font-medium text-primary hover:underline">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Login;
