import { Bell, Check, CheckCheck, ExternalLink, Loader2, UserPlus, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useGetUnreadCountQuery,
  useGetNotificationsQuery,
  useMarkNotificationsReadMutation,
} from "@/store/services/sharing";

const NotificationBell = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const { data: countData } = useGetUnreadCountQuery(undefined, {
    // Refetch when dropdown opens, but no polling
    refetchOnMountOrArgChange: true,
  });

  const { data: notifData, isLoading } = useGetNotificationsQuery(undefined, {
    skip: !isOpen,
    refetchOnMountOrArgChange: true,
  });

  const [markRead] = useMarkNotificationsReadMutation();

  const unreadCount = countData?.count || 0;
  const notifications = notifData?.notifications || [];

  const handleMarkAllRead = async () => {
    try {
      await markRead({ mark_all: true, notification_type: "all" }).unwrap();
    } catch {
      toast.error("Failed to mark notifications as read");
    }
  };

  const handleNotificationClick = async (notification: ShareNotification) => {
    // Mark as read
    try {
      await markRead({ notification_ids: [notification.id] }).unwrap();
    } catch {
      // Silent fail — non-critical
    }

    setIsOpen(false);

    if (notification.type === "owner_request") {
      navigate("/access-requests");
    } else if (notification.status === "approved" && notification.calculation_id) {
      navigate(`/case-detail/${notification.calculation_id}`);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative rounded-full">
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-sm font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-2 py-1 text-xs text-muted-foreground"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleMarkAllRead();
              }}
            >
              <CheckCheck className="mr-1 size-3" />
              Mark all read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />

        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-3 py-6 text-center text-sm text-muted-foreground">
            No new notifications
          </div>
        ) : (
          <div className="max-h-72 overflow-y-auto">
            {notifications.slice(0, 10).map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="cursor-pointer px-3 py-3"
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex w-full items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {notification.type === "owner_request" ? (
                      <UserPlus className="size-4 text-blue-500" />
                    ) : notification.status === "approved" ? (
                      <Check className="size-4 text-green-500" />
                    ) : (
                      <X className="size-4 text-red-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug">{notification.message}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {notification.created_at
                        ? new Date(notification.created_at).toLocaleString()
                        : notification.reviewed_at
                          ? new Date(notification.reviewed_at).toLocaleString()
                          : ""}
                    </p>
                  </div>
                  <ExternalLink className="mt-0.5 size-3 shrink-0 text-muted-foreground" />
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer justify-center py-2 text-center text-sm text-primary"
              onClick={() => {
                setIsOpen(false);
                navigate("/access-requests");
              }}
            >
              View all requests
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
