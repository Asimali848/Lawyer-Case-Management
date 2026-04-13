import { Check, Clock, Loader2, Shield, UserCheck, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Loader from "@/components/loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGetAccessRequestsQuery,
  useApproveAccessMutation,
  useRejectAccessMutation,
} from "@/store/services/sharing";

const AccessRequests = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetAccessRequestsQuery();
  const [approveAccess, { isLoading: isApproving }] = useApproveAccessMutation();
  const [rejectAccess, { isLoading: isRejecting }] = useRejectAccessMutation();

  const requests = data?.requests || [];

  const handleApprove = async (calculationId: string, userId: string, requesterName: string) => {
    try {
      await approveAccess({ calculationId, userId }).unwrap();
      toast.success(`Access approved for ${requesterName}`);
    } catch (error: any) {
      toast.error(error?.data?.detail || "Failed to approve access");
    }
  };

  const handleReject = async (calculationId: string, userId: string, requesterName: string) => {
    try {
      await rejectAccess({ calculationId, userId }).unwrap();
      toast.success(`Access rejected for ${requesterName}`);
    } catch (error: any) {
      toast.error(error?.data?.detail || "Failed to reject access");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center py-8">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col gap-3 overflow-hidden p-3 sm:gap-4 sm:p-4 lg:p-5">
      <div className="flex items-center gap-2 sm:gap-3">
        <h1 className="font-bold text-primary text-lg sm:text-xl lg:text-2xl">Access Requests</h1>
        <Badge variant="secondary" className="flex items-center gap-1 text-[10px] sm:text-xs">
          <Shield className="size-2.5 sm:size-3" />
          {requests.length} pending
        </Badge>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto sm:space-y-3">
        {error ? (
          <Card>
            <CardContent className="flex items-center justify-center py-6 sm:py-8">
              <p className="text-sm text-destructive">Error loading requests. Please try again.</p>
            </CardContent>
          </Card>
        ) : requests.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
              <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 sm:mb-4 sm:size-16">
                <UserCheck className="size-6 text-green-500 sm:size-8" />
              </div>
              <p className="text-base font-medium sm:text-lg">All caught up!</p>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                No pending access requests for your cases.
              </p>
              <Button
                variant="outline"
                className="mt-3 sm:mt-4"
                size="sm"
                onClick={() => navigate("/dashboard")}
              >
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        ) : (
          requests.map((req) => {
            const requesterName =
              req.requester_first_name && req.requester_last_name
                ? `${req.requester_first_name} ${req.requester_last_name}`
                : req.requester_name || "Unknown User";

            return (
              <Card key={req.id} className="transition-colors hover:border-primary/30">
                <CardHeader className="p-3 pb-2 sm:p-4 sm:pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <CardTitle className="truncate text-sm sm:text-base">
                        {requesterName}
                      </CardTitle>
                      <CardDescription className="mt-0.5 truncate text-[11px] sm:mt-1 sm:text-sm">
                        {req.requester_email}
                      </CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className="shrink-0 border-amber-300 bg-amber-50 text-[10px] text-amber-700 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-300 sm:text-xs"
                    >
                      <Clock className="mr-0.5 size-2.5 sm:mr-1 sm:size-3" />
                      Pending
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 p-3 pt-0 sm:space-y-3 sm:p-4 sm:pt-0">
                  <div className="rounded-lg bg-muted/50 p-2.5 sm:p-3">
                    <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 sm:gap-2">
                      <div>
                        <p className="text-[10px] text-muted-foreground sm:text-xs">Case</p>
                        <p className="text-xs font-medium sm:text-sm">{req.case_name || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground sm:text-xs">Court</p>
                        <p className="text-xs font-medium sm:text-sm">
                          {req.court_name || "N/A"} {req.court_number ? `- ${req.court_number}` : ""}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-[10px] text-muted-foreground sm:text-xs">Requested</p>
                        <p className="text-xs sm:text-sm">
                          {new Date(req.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1 bg-green-600 text-xs text-white hover:bg-green-700 sm:text-sm"
                      onClick={() => handleApprove(req.calculation_id, req.user_id, requesterName)}
                      disabled={isApproving || isRejecting}
                    >
                      {isApproving ? (
                        <Loader2 className="mr-1 size-3.5 animate-spin" />
                      ) : (
                        <Check className="mr-1 size-3.5" />
                      )}
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1 text-xs sm:text-sm"
                      onClick={() => handleReject(req.calculation_id, req.user_id, requesterName)}
                      disabled={isApproving || isRejecting}
                    >
                      {isRejecting ? (
                        <Loader2 className="mr-1 size-3.5 animate-spin" />
                      ) : (
                        <X className="mr-1 size-3.5" />
                      )}
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AccessRequests;
