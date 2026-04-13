import { CheckCircle, Clock, Loader2, Lock, ShieldAlert, XCircle } from "lucide-react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useValidateShareTokenQuery } from "@/store/services/sharing";

const SharedCase = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const globalToken = useSelector((state: { global: GlobalState }) => state.global?.token);
  const isAuthenticated = !!globalToken;

  // If not authenticated, redirect to login with redirect param
  useEffect(() => {
    if (!isAuthenticated && token) {
      navigate(`/login?redirect=/shared/${token}`, { replace: true });
    }
  }, [isAuthenticated, token, navigate]);

  // Validate the token (only when authenticated)
  const {
    data: accessData,
    isLoading,
    error,
  } = useValidateShareTokenQuery(token || "", {
    skip: !isAuthenticated || !token,
  });

  // If approved and has calculation_id, redirect to case detail
  useEffect(() => {
    if (accessData?.status === "approved" && accessData?.calculation_id) {
      navigate(`/case-detail/${accessData.calculation_id}`, { replace: true });
    }
  }, [accessData, navigate]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background p-3 sm:p-4">
        <Card className="w-full max-w-sm sm:max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
            <Loader2 className="size-7 animate-spin text-primary sm:size-8" />
            <p className="mt-3 text-sm text-muted-foreground sm:mt-4">Redirecting to login...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background p-3 sm:p-4">
        <Card className="w-full max-w-sm sm:max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
            <Loader2 className="size-7 animate-spin text-primary sm:size-8" />
            <p className="mt-3 text-sm text-muted-foreground sm:mt-4">Validating share link...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    const errorDetail = (error as any)?.data?.detail || "Invalid or expired share link";
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background p-3 sm:p-4">
        <Card className="w-full max-w-sm sm:max-w-md">
          <CardHeader className="px-4 text-center sm:px-6">
            <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 sm:mb-3 sm:size-14">
              <ShieldAlert className="size-6 text-red-500 sm:size-7" />
            </div>
            <CardTitle className="text-lg sm:text-xl">Invalid Share Link</CardTitle>
            <CardDescription className="text-xs sm:text-sm">{errorDetail}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center px-4 sm:px-6">
            <Button onClick={() => navigate("/dashboard")} variant="default" className="w-full sm:w-auto">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render based on access status
  const status = accessData?.status;
  const caseName = accessData?.case_name || "a case";

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background p-3 sm:p-4">
      <Card className="w-full max-w-sm sm:max-w-md">
        {status === "pending" && (
          <>
            <CardHeader className="px-4 text-center sm:px-6">
              <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 sm:mb-3 sm:size-14">
                <Clock className="size-6 text-amber-500 sm:size-7" />
              </div>
              <CardTitle className="text-lg sm:text-xl">Access Request Sent</CardTitle>
              <CardDescription className="mt-1 text-xs sm:mt-2 sm:text-sm">
                Your request to access <strong>"{caseName}"</strong> has been submitted.
                The case owner will review your request.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 px-4 sm:px-6">
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-2.5 dark:border-amber-800 dark:bg-amber-900/20 sm:p-3">
                <p className="text-xs text-amber-700 dark:text-amber-300 sm:text-sm">
                  You'll be notified when your request is approved or rejected.
                </p>
              </div>
              <Button
                onClick={() => navigate("/dashboard")}
                variant="default"
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </CardContent>
          </>
        )}

        {status === "rejected" && (
          <>
            <CardHeader className="px-4 text-center sm:px-6">
              <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 sm:mb-3 sm:size-14">
                <XCircle className="size-6 text-red-500 sm:size-7" />
              </div>
              <CardTitle className="text-lg sm:text-xl">Access Denied</CardTitle>
              <CardDescription className="mt-1 text-xs sm:mt-2 sm:text-sm">
                Your access request for <strong>"{caseName}"</strong> was rejected by the case owner.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <Button
                onClick={() => navigate("/dashboard")}
                variant="default"
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </CardContent>
          </>
        )}

        {status === "rejected_cooldown" && (
          <>
            <CardHeader className="px-4 text-center sm:px-6">
              <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 sm:mb-3 sm:size-14">
                <Lock className="size-6 text-red-500 sm:size-7" />
              </div>
              <CardTitle className="text-lg sm:text-xl">Please Wait</CardTitle>
              <CardDescription className="mt-1 text-xs sm:mt-2 sm:text-sm">
                Your previous request was rejected. You can re-request access in{" "}
                <strong>{accessData?.cooldown_seconds || 120} seconds</strong>.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <Button
                onClick={() => navigate("/dashboard")}
                variant="default"
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </CardContent>
          </>
        )}

        {status === "approved" && (
          <>
            <CardHeader className="px-4 text-center sm:px-6">
              <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 sm:mb-3 sm:size-14">
                <CheckCircle className="size-6 text-green-500 sm:size-7" />
              </div>
              <CardTitle className="text-lg sm:text-xl">Access Granted</CardTitle>
              <CardDescription className="mt-1 text-xs sm:mt-2 sm:text-sm">
                Redirecting to the case...
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center px-4 sm:px-6">
              <Loader2 className="size-5 animate-spin text-primary sm:size-6" />
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};

export default SharedCase;
