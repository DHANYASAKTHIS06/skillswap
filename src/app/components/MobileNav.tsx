import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import {
  LayoutDashboard,
  Search,
  BookOpen,
  CreditCard,
  User,
  Users,
  BookOpenCheck,
  Star,
} from "lucide-react";
import { cn } from "./ui/utils";

export default function MobileNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const studentMenuItems = [
    { icon: LayoutDashboard, label: "Home", path: "/student" },
    { icon: Search, label: "Search", path: "/student/find-tutors" },
    { icon: BookOpen, label: "Courses", path: "/student/courses" },
    { icon: CreditCard, label: "Credits", path: "/student/credits" },
    { icon: User, label: "Account", path: "/student/profile" },
  ];

  const tutorMenuItems = [
    { icon: LayoutDashboard, label: "Home", path: "/tutor" },
    { icon: Users, label: "Requests", path: "/tutor/requests" },
    { icon: BookOpenCheck, label: "Courses", path: "/tutor/active-courses" },
    { icon: Star, label: "Reviews", path: "/tutor/reviews" },
    { icon: User, label: "Account", path: "/tutor/profile" },
  ];

  const adminMenuItems = [
    { icon: LayoutDashboard, label: "Home", path: "/admin" },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: CreditCard, label: "Credits", path: "/admin/credits" },
    { icon: User, label: "Profile", path: "/admin/profile" },
  ];

  const menuItems =
    user?.role === "student"
      ? studentMenuItems
      : user?.role === "tutor"
      ? tutorMenuItems
      : adminMenuItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50 lg:hidden">
      <div className="flex justify-around items-center h-16 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[60px]",
                isActive
                  ? "text-blue-500"
                  : "text-gray-600 dark:text-gray-400"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "scale-110")} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
