import { useNavigate } from "react-router-dom";
import { Star, Calendar, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetSubscriptionStatusQuery } from "@/store/services/subscription";
import Loader from "@/components/loader";

interface AccountDetailsCardProps {
  memberSince: string;
  onPasswordChange: () => void;
}

const AccountDetailsCard = ({
  memberSince,
  onPasswordChange,
}: AccountDetailsCardProps) => {
  const navigate = useNavigate();
  const { data: subscription, isLoading } = useGetSubscriptionStatusQuery();

  const handleUpgradePlan = () => {
    navigate("/billing");
  };

  const isPremium = subscription?.subscription_type === "premium";
  const planName = isPremium ? "Premium" : "Free";
  const planColor = isPremium ? "bg-chart-4 dark:bg-chart-3" : "bg-gray-500";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Subscription Plan</p>
          </div>
          <div className="flex items-center gap-2">
            {isLoading ? (
              <Loader />
            ) : (
              <Badge className={`gap-1 ${planColor}`}>
                <Star className="size-3 fill-current" />
                {planName}
              </Badge>
            )}
          </div>
        </div>
        <Button
          className="w-full bg-primary text-white hover:bg-primary/90"
          onClick={handleUpgradePlan}
        >
          {isPremium ? "Manage Plan" : "Upgrade Plan"}
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Member Since</p>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="size-4" />
            <span className="text-sm">{memberSince}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Security</p>
            <p className="text-xs text-muted-foreground">Password protected</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={onPasswordChange}
          >
            <Lock className="size-4" />
            Change Password
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountDetailsCard;
