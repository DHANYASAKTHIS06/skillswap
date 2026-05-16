import { X, Check, Trash2, Coins, CheckCircle, Info, Clock, GraduationCap } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function NotificationsPanel({ open, onClose }: NotificationsPanelProps) {
  const { notifications, markNotificationAsRead, clearAllNotifications } = useApp();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "coins":
        return <Coins className="h-5 w-5" />;
      case "check-circle":
        return <CheckCircle className="h-5 w-5" />;
      case "info":
        return <Info className="h-5 w-5" />;
      case "clock":
        return <Clock className="h-5 w-5" />;
      case "graduation-cap":
        return <GraduationCap className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400";
      case "warning":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400";
      default:
        return "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400";
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto transition-transform">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Notifications</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {unreadCount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {unreadCount} NEW ALERT{unreadCount > 1 ? "S" : ""}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllNotifications}
                  className="text-blue-500 hover:text-blue-600"
                >
                  Mark read
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="p-4 space-y-3">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => markNotificationAsRead(notification.id)}
              className={cn(
                "w-full text-left p-4 rounded-lg border transition-all hover:shadow-md",
                notification.read
                  ? "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 opacity-60"
                  : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
              )}
            >
              <div className="flex gap-3">
                <div
                  className={cn(
                    "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                    getIconBg(notification.type)
                  )}
                >
                  {getIcon(notification.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-sm">{notification.title}</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                      {notification.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {notification.message}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4">
          <button className="w-full text-blue-500 hover:text-blue-600 font-medium text-sm py-2">
            View All Activity History
          </button>
        </div>
      </div>
    </>
  );
}
