import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, BarChart3 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRequestAccessMutation } from "@/store/services/analytics";

const accessSchema = z.object({
  identifier: z.string().email("Please enter a valid identifier"),
  access_key: z.string().min(1, "Access key is required"),
});

type AccessFormData = z.infer<typeof accessSchema>;

const SystemMetrics = () => {
  const navigate = useNavigate();
  const [requestAccess, { isLoading }] = useRequestAccessMutation();
  const [showKey, setShowKey] = useState(false);

  const form = useForm<AccessFormData>({
    resolver: zodResolver(accessSchema),
    defaultValues: {
      identifier: "",
      access_key: "",
    },
  });

  const onSubmit = async (data: AccessFormData) => {
    try {
      const result = await requestAccess(data).unwrap();

      localStorage.setItem("_sys_tk", result.access_token);
      localStorage.setItem("_sys_lv", "9");

      toast.success("Access granted");
      navigate("/analytics/overview");
    } catch (error: unknown) {
      const err = error as { data?: { detail?: string } };
      toast.error(err.data?.detail || "Access denied");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-md border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-700/50">
            <BarChart3 className="h-8 w-8 text-slate-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            System Analytics
          </CardTitle>
          <CardDescription className="text-slate-400">
            Internal metrics dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Identifier</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                        <Input
                          {...field}
                          type="email"
                          placeholder="Enter identifier"
                          className="border-slate-700 bg-slate-800/50 pl-10 text-white placeholder:text-slate-500"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="access_key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Access Key</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                        <Input
                          {...field}
                          type={showKey ? "text" : "password"}
                          placeholder="••••••••"
                          className="border-slate-700 bg-slate-800/50 pl-10 text-white placeholder:text-slate-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowKey(!showKey)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                        >
                          {showKey ? "Hide" : "Show"}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-700 hover:bg-slate-600"
              >
                {isLoading ? "Verifying..." : "Access Dashboard"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/")}
              className="text-sm text-slate-500 hover:text-slate-300"
            >
              ← Return
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemMetrics;
