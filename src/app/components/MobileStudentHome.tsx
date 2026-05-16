import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { Clock, XCircle, CheckCircle, Inbox } from "lucide-react";

export default function MobileStudentHome() {
  const { studentCredits, courses } = useApp();
  const { user } = useAuth();

  const firstName = user?.name?.split(" ")[0] || "Student";
  const pendingRequests = courses.filter((c) => c.status === "requested");
  const activeCourses = courses.filter((c) => c.status === "active" || c.status === "accepted");

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Welcome back, {firstName}!</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {pendingRequests.length > 0
            ? `You have ${pendingRequests.length} pending request${pendingRequests.length !== 1 ? "s" : ""}.`
            : "No pending requests right now."}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="w-5 h-5 text-blue-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 3v18M15 3v18" />
            </svg>
            <span className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Credits
            </span>
          </div>
          <p className="text-2xl font-bold">{studentCredits}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="w-5 h-5 text-green-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            <span className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Active Courses
            </span>
          </div>
          <p className="text-2xl font-bold">{activeCourses.length}</p>
        </div>
      </div>

      {/* Priority Requests */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Priority Requests</h2>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-3">
              <Inbox className="w-7 h-7 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
              No requests available yet
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
              Find a tutor to send your first request
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((course) => (
              <div
                key={course.id}
                className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {(course.tutorName ?? "T")[0].toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold">{course.tutorName}</h3>
                      <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 text-xs font-medium rounded">
                        Requested
                      </span>
                    </div>
                    {course.requestedAt && (
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{course.requestedAt}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">
                    TOPIC REQUESTED
                  </p>
                  <p className="font-medium">{course.skill}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}