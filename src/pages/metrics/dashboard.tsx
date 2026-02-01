import {
  BarChart3,
  Briefcase,
  Crown,
  LogOut,
  Search,
  Activity,
  UserCheck,
  UserX,
  Users,
  Power,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Loader from "@/components/loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import {
  useGetOverviewQuery,
  useGetEntitiesQuery,
  useUpdateTierMutation,
  useUpdateStatusMutation,
  type UserWithStats,
} from "@/store/services/analytics";

const AnalyticsOverview = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Check access
  useEffect(() => {
    const level = localStorage.getItem("_sys_lv");
    const token = localStorage.getItem("_sys_tk");
    if (!level || !token) {
      navigate("/analytics");
    }
  }, [navigate]);

  // Fetch stats and users
  const { data: stats, isLoading: statsLoading } = useGetOverviewQuery();
  const {
    data: usersData,
    isLoading: usersLoading,
    refetch,
  } = useGetEntitiesQuery({
    page,
    page_size: 20,
    search,
  });

  const [updateSubscription, { isLoading: isUpdating }] =
    useUpdateTierMutation();
  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useUpdateStatusMutation();

  const handleLogout = () => {
    localStorage.removeItem("_sys_tk");
    localStorage.removeItem("_sys_lv");
    toast.success("Session ended");
    navigate("/analytics");
  };

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleSubscriptionChange = async (
    userId: string,
    newType: "free" | "premium" | "admin",
  ) => {
    try {
      await updateSubscription({ userId, subscription_type: newType }).unwrap();
      toast.success(`Tier updated`);
      refetch();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const handleStatusChange = async (userId: string, isActive: boolean) => {
    try {
      await updateStatus({ userId, is_active: isActive }).unwrap();
      toast.success(isActive ? "User activated" : "User deactivated");
      refetch();
    } catch (error) {
      toast.error("Status update failed");
    }
  };

  const getTierBadgeColor = (type: string) => {
    switch (type) {
      case "admin":
        return "bg-slate-600 hover:bg-slate-700";
      case "premium":
        return "bg-green-600 hover:bg-green-700";
      default:
        return "bg-gray-600 hover:bg-gray-700";
    }
  };

  if (statsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8 text-slate-400" />
            <div>
              <h1 className="text-xl font-bold text-white">
                Analytics Dashboard
              </h1>
              <p className="text-sm text-slate-400">System metrics overview</p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Exit
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-slate-700 bg-slate-900/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Total Entities
              </CardTitle>
              <Users className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats?.total_users || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-900/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Total Records
              </CardTitle>
              <Briefcase className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats?.total_cases || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-900/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Verified
              </CardTitle>
              <UserCheck className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats?.verified_users || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-900/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Pending
              </CardTitle>
              <UserX className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats?.unverified_users || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tier Breakdown */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="border-slate-700 bg-slate-900/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Tier 1
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats?.users_by_subscription?.free || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-900/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Tier 2
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats?.users_by_subscription?.premium || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-900/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Tier 3
              </CardTitle>
              <Crown className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats?.users_by_subscription?.admin || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Entities Table */}
        <Card className="border-slate-700 bg-slate-900/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-white">All Entities</CardTitle>
                <CardDescription className="text-slate-400">
                  Manage entity tiers and view metrics
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Search..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-64 border-slate-700 bg-slate-800/50 text-white placeholder:text-slate-500"
                />
                <Button
                  onClick={handleSearch}
                  className="bg-slate-700 hover:bg-slate-600"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <div className="flex justify-center py-8">
                <Loader />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700 hover:bg-slate-800/50">
                        <TableHead className="text-slate-400">Name</TableHead>
                        <TableHead className="text-slate-400">
                          Identifier
                        </TableHead>
                        <TableHead className="text-slate-400">Status</TableHead>
                        <TableHead className="text-slate-400">Active</TableHead>
                        <TableHead className="text-slate-400">
                          Records
                        </TableHead>
                        <TableHead className="text-slate-400">Tier</TableHead>
                        <TableHead className="text-slate-400">
                          Created
                        </TableHead>
                        <TableHead className="text-slate-400">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usersData?.users.map((user: UserWithStats) => (
                        <TableRow
                          key={user.id}
                          className="border-slate-700 hover:bg-slate-800/50"
                        >
                          <TableCell className="text-white">
                            <div>
                              <p className="font-medium">
                                {user.name || "N/A"}
                              </p>
                              <p className="text-sm text-slate-400">
                                {user.firm_name || ""}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-300">
                            {user.email}
                          </TableCell>
                          <TableCell>
                            {user.is_verified ? (
                              <Badge className="bg-green-600">Verified</Badge>
                            ) : (
                              <Badge className="bg-yellow-600">Pending</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={user.is_active}
                                onCheckedChange={(checked) =>
                                  handleStatusChange(user.id, checked)
                                }
                                disabled={isUpdatingStatus}
                                className="data-[state=checked]:bg-green-600"
                              />
                              <span
                                className={`text-xs ${user.is_active ? "text-green-400" : "text-red-400"}`}
                              >
                                {user.is_active ? "On" : "Off"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-white font-semibold">
                            {user.case_count}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={getTierBadgeColor(
                                user.subscription_type,
                              )}
                            >
                              {user.subscription_type.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-400 text-sm">
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={user.subscription_type}
                              onValueChange={(
                                value: "free" | "premium" | "admin",
                              ) => handleSubscriptionChange(user.id, value)}
                              disabled={isUpdating}
                            >
                              <SelectTrigger className="w-32 border-slate-700 bg-slate-800/50 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="border-slate-700 bg-slate-800">
                                <SelectItem
                                  value="free"
                                  className="text-white hover:bg-slate-700"
                                >
                                  Free
                                </SelectItem>
                                <SelectItem
                                  value="premium"
                                  className="text-white hover:bg-slate-700"
                                >
                                  Premium
                                </SelectItem>
                                <SelectItem
                                  value="admin"
                                  className="text-white hover:bg-slate-700"
                                >
                                  Admin
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {usersData && usersData.total_pages > 1 && (
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-slate-400">
                      Page {page} of {usersData.total_pages} ({usersData.total}{" "}
                      total)
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="border-slate-700 bg-slate-800/50 text-white hover:bg-slate-700"
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setPage((p) => Math.min(usersData.total_pages, p + 1))
                        }
                        disabled={page === usersData.total_pages}
                        className="border-slate-700 bg-slate-800/50 text-white hover:bg-slate-700"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AnalyticsOverview;
