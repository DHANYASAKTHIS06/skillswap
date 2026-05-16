import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router";
import { AppProvider } from "./context/AppContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { RequestsProvider } from "./context/RequestsContext";

// Lazy load all page components
const AppLayout = lazy(() => import("./AppLayout"));
const Landing = lazy(() => import("./pages/Landing"));
const SignIn = lazy(() => import("./pages/auth/SignIn"));
const SignUp = lazy(() => import("./pages/auth/SignUp"));
const StudentOverview = lazy(() => import("./pages/student/Overview"));
const FindTutors = lazy(() => import("./pages/student/FindTutors"));
const MyCourses = lazy(() => import("./pages/student/MyCourses"));
const StudentCredits = lazy(() => import("./pages/student/Credits"));
const SavedNotes = lazy(() => import("./pages/student/SavedNotes"));
const StudentProfile = lazy(() => import("./pages/student/Profile"));
const TutorOverview = lazy(() => import("./pages/tutor/Overview"));
const StudentRequests = lazy(() => import("./pages/tutor/StudentRequests"));
const ActiveCourses = lazy(() => import("./pages/tutor/ActiveCourses"));
const TutorCredits = lazy(() => import("./pages/tutor/Credits"));
const Reviews = lazy(() => import("./pages/tutor/Reviews"));
const TutorProfile = lazy(() => import("./pages/tutor/Profile"));
const AdminOverview = lazy(() => import("./pages/admin/Overview"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));

const LoadingFallback = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-sm text-gray-500 dark:text-gray-400">Loading...</span>
    </div>
  </div>
);

// Full-screen loader while restoring auth session
function AuthLoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-600 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white/90 text-sm font-medium">Restoring your session…</p>
      </div>
    </div>
  );
}

// Protected route wrapper - redirects to signin if not authenticated
function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) return <AuthLoadingScreen />;

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If specific roles required, check
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to their own dashboard
    const rolePath = user.role === "student" ? "/student" : user.role === "tutor" ? "/tutor" : "/admin";
    return <Navigate to={rolePath} replace />;
  }

  return <>{children}</>;
}

// Public route wrapper - redirects to dashboard if already authenticated
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <AuthLoadingScreen />;

  if (isAuthenticated && user) {
    const rolePath = user.role === "student" ? "/student" : user.role === "tutor" ? "/tutor" : "/admin";
    return <Navigate to={rolePath} replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public routes - redirect to dashboard if already logged in */}
        <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
        <Route path="/signin" element={<PublicRoute><SignIn /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />

        {/* Student routes */}
        <Route path="/student" element={
          <ProtectedRoute allowedRoles={["student"]}>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route index element={<StudentOverview />} />
          <Route path="find-tutors" element={<FindTutors />} />
          <Route path="courses" element={<MyCourses />} />
          <Route path="credits" element={<StudentCredits />} />
          <Route path="notes" element={<SavedNotes />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>

        {/* Tutor routes */}
        <Route path="/tutor" element={
          <ProtectedRoute allowedRoles={["tutor"]}>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route index element={<TutorOverview />} />
          <Route path="requests" element={<StudentRequests />} />
          <Route path="active-courses" element={<ActiveCourses />} />
          <Route path="credits" element={<TutorCredits />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="profile" element={<TutorProfile />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminOverview />} />
          <Route path="users" element={<UserManagement />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <RequestsProvider>
            <AppRoutes />
          </RequestsProvider>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}