import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useAuth } from "./AuthContext";

type UserRole = "student" | "tutor" | "admin";
type ConnectionStatus = "none" | "requested" | "accepted" | "rejected" | "active" | "completed";
type Theme = "light" | "dark";

interface Course {
  id: string;
  tutorId: string;
  studentId: string;
  skill: string;
  status: ConnectionStatus;
  tutorName: string;
  tutorImage: string;
  tutorRating?: number;
  studentName?: string;
  studentImage?: string;
  studentYear?: string;
  message?: string;
  requestedAt?: string;
}

interface Tutor {
  id: string;
  name: string;
  image: string;
  skills: string[];
  rating: number;
  experience: string;
  experienceScore: "high" | "medium" | "low";
  creditsPerHour: number;
  matchPercent: number;
  description: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  icon: string;
  type: "info" | "success" | "warning";
}

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  theme: Theme;
  toggleTheme: () => void;
  studentCredits: number;
  setStudentCredits: (credits: number) => void;
  tutorCredits: number;
  setTutorCredits: (credits: number) => void;
  courses: Course[];
  updateCourseStatus: (courseId: string, status: ConnectionStatus) => void;
  addCourse: (course: Course) => void;
  tutors: Tutor[];
  selectedSkill: string;
  setSelectedSkill: (skill: string) => void;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<UserRole>(() => {
    if (user?.role) return user.role;
    return "student";
  });

  // Sync userRole whenever auth user changes
  useEffect(() => {
    if (user?.role) {
      setUserRole(user.role);
    }
  }, [user]);

  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") as Theme | null;
      if (savedTheme) return savedTheme;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });

  // Start with zero credits — real credits come from user actions
  const [studentCredits, setStudentCredits] = useState(0);
  const [tutorCredits, setTutorCredits] = useState(0);
  const [selectedSkill, setSelectedSkill] = useState("All Skills");

  // Empty arrays — only populated by real user actions
  const [courses, setCourses] = useState<Course[]>([]);
  const [tutors] = useState<Tutor[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", newTheme);
      }
      return newTheme;
    });
  };

  const updateCourseStatus = (courseId: string, status: ConnectionStatus) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === courseId ? { ...course, status } : course
      )
    );
  };

  const addCourse = (course: Course) => {
    setCourses((prev) => [...prev, course]);
  };

  const addNotification = (notification: Omit<Notification, "id">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        theme,
        toggleTheme,
        studentCredits,
        setStudentCredits,
        tutorCredits,
        setTutorCredits,
        courses,
        updateCourseStatus,
        addCourse,
        tutors,
        selectedSkill,
        setSelectedSkill,
        notifications,
        addNotification,
        markNotificationAsRead,
        clearAllNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;