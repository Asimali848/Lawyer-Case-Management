import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { employeesSchema } from "@/lib/form-schemas";
import type { RootState } from "@/types/global";
import UploadModal from "../file-uploader";
import { Switch } from "../ui/switch";

interface EmployeeSheetProps {
  id?: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  employee?: EmployeeResponse;
  companyId: string;
}

const EmployeeSheet = ({ id, open, setOpen, employee, companyId }: EmployeeSheetProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { mode } = useSelector((state: RootState) => state.global);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);

  const handleUpload = (files: File[]) => {
    form.setValue("files", files);
  };

  const form = useForm<z.infer<typeof employeesSchema>>({
    resolver: zodResolver(employeesSchema),
    defaultValues: {
      name: "",
      email: "",
      salary: 0,
      is_candidate: mode === "employees" ? false : true,
      is_role_model: false,
      date_of_birth: "",
      user_phone_number: "",
      user_designation: "",
      department: "",
      password: "",
      files: [],
    },
  });

  const onSubmit = async (_data: z.infer<typeof employeesSchema>) => {
    if (id) {
      setIsLoadingUpdate(true);
      // Simulate update
      setTimeout(() => {
        setIsLoadingUpdate(false);
        toast.success("Employee Updated Successfully!");
        setOpen(false);
      }, 1000);
      return;
    }

    setIsLoading(true);
    // Simulate create
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Employee Created Successfully!");
      setOpen(false);
    }, 1000);
  };

  useEffect(() => {
    if (id && employee) {
      form.reset({
        name: employee.name,
        email: employee.email,
        salary: employee.salary,
        password: employee.password || "",
        is_candidate: employee.is_candidate ?? (mode === "employees" ? false : true),
        is_role_model: employee.is_role_model,
        date_of_birth: employee.date_of_birth || "",
        user_phone_number: employee.user_phone_number || "",
        user_designation: employee.user_designation || "",
        department: employee.department || "",
        files: [],
      });
    }
  }, [id, employee, form, mode]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {id ? "Edit" : "Add"}
            {mode === "employees" ? " Employee" : " Candidate"}
          </SheetTitle>
          <SheetDescription>
            {id
              ? `Update ${mode === "employees" ? "employee" : "candidate"} details`
              : `Add a new ${mode === "employees" ? "employee" : "candidate"} to your account`}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 overflow-auto px-4 pb-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Full Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="employee@gmail.com" {...field} />
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
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="user_phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+92 300 1234567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input placeholder="HR / IT / Marketing" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="user_designation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designation</FormLabel>
                  <FormControl>
                    <Input placeholder="Developer / Team Lead" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Salary <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="50000"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {mode === "employees" && (
              <FormField
                control={form.control}
                name="is_role_model"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <FormLabel>Is Role Model?</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button type="submit" className="mt-auto w-full" disabled={isLoading || isLoadingUpdate}>
              {isLoading || isLoadingUpdate ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  {id ? "Edit" : "Add"} {mode === "employees" ? "Employee" : "Candidate"}
                </>
              )}
            </Button>
          </form>
          <UploadModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onUpload={handleUpload}
            companyId={companyId}
            employeeId={id || ""}
          />
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default EmployeeSheet;
