import { useLocation, useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Search,
  BookOpen,
  CreditCard,
  FileText,
  User,
  Users,
  BookOpenCheck,
  Star,
  LogOut,
  Settings,
} from "lucide-react";
import { cn } from "./ui/utils";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userRole, studentCredits, tutorCredits } = useApp();
  const { user, logout } = useAuth();

  const studentMenuItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/student" },
    { icon: Search, label: "Find Tutors", path: "/student/find-tutors" },
    { icon: BookOpen, label: "My Courses", path: "/student/courses" },
    { icon: CreditCard, label: "Credits", path: "/student/credits" },
    { icon: FileText, label: "Saved Notes", path: "/student/notes" },
    { icon: User, label: "Profile", path: "/student/profile" },
  ];

  const tutorMenuItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/tutor" },
    { icon: Users, label: "Student Requests", path: "/tutor/requests" },
    { icon: BookOpenCheck, label: "Active Courses", path: "/tutor/active-courses" },
    { icon: CreditCard, label: "Credits", path: "/tutor/credits" },
    { icon: Star, label: "Reviews", path: "/tutor/reviews" },
    { icon: User, label: "Profile", path: "/tutor/profile" },
  ];

  const adminMenuItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/admin" },
    { icon: Users, label: "User Management", path: "/admin/users" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  const menuItems =
    user?.role === "student"
      ? studentMenuItems
      : user?.role === "tutor"
      ? tutorMenuItems
      : adminMenuItems;

  const credits = user?.role === "student" ? studentCredits : tutorCredits;

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-colors overflow-y-auto flex flex-col">
      {/* User info */}
      {user && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user.email}
              </p>
            </div>
          </div>
          <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full">
            {user.role}
          </span>
        </div>
      )}

      {/* Nav */}
      <nav className="p-4 space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left",
                isActive
                  ? "bg-blue-500 text-white shadow-md"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Credits Display */}
      {user?.role !== "admin" && (
        <div className="p-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">
              Your Credits
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold text-blue-500">{credits}</span>
            </div>
          </div>
        </div>
      )}

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
