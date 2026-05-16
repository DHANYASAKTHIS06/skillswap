import { Clock, BookOpen, Target, Inbox } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useRequests } from "../../context/RequestsContext";
import MobileStudentHome from "../../components/MobileStudentHome";

export default function StudentOverview() {
  const { user } = useAuth();
  const { sentRequests } = useRequests();

  const firstName = user?.name?.split(" ")[0] || "Student";
  const activeCourses = sentRequests.filter((c) => c.status === "accepted");
  const pendingCourses = sentRequests.filter((c) => c.status === "pending");
  const completedCoursesCount = 0; // TBD when completion logic added
  const studentCredits = 0;

  return (
    <>
      {/* Mobile View */}
      <div className="lg:hidden">
        <MobileStudentHome />
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {sentRequests.length === 0
              ? "Start your learning journey by finding tutors and sending requests."
              : `You have ${activeCourses.length} accepted request${activeCourses.length !== 1 ? "s" : ""} and ${pendingCourses.length} pending.`}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M9 3v18M15 3v18" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Total Credits
                </p>
              </div>
            </div>
            <p className="text-3xl font-bold text-blue-500">{studentCredits}</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Active Courses
                </p>
              </div>
            </div>
            <p className="text-3xl font-bold text-green-500">{activeCourses.length}</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Completed
                </p>
              </div>
            </div>
            <p className="text-3xl font-bold text-orange-500">{completedCoursesCount}</p>
          </div>
        </div>

        {/* Recent Course Progress & Daily Goal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Accept Requests */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Tutors Connected</h2>
            </div>

            {activeCourses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
                  <Inbox className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">No courses yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Find a tutor and send a request to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeCourses.map((req) => {
                  const receiverObj = typeof req.receiver_id === "object" ? req.receiver_id : null;
                  const receiverName = receiverObj?.name || "Tutor";
                  return (
                  <div key={req._id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Tutoring with {receiverName}</span>
                      <span className="text-sm text-green-500 font-semibold text-right">Accepted</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: "20%" }}
                      />
                    </div>
                  </div>
                )})}
              </div>
            )}
          </div>

          {/* Daily Goal */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-semibold mb-4">Daily Goal</h2>

            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={`${(completedCoursesCount / Math.max(3, completedCoursesCount + 1)) * 2 * Math.PI * 56} ${2 * Math.PI * 56}`}
                    className="text-green-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Target className="w-8 h-8 text-green-500" />
                </div>
              </div>

              <div className="text-center">
                <p className="text-2xl font-bold mb-1">{completedCoursesCount}/3 Skills</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {completedCoursesCount >= 3
                    ? 'You earned your "Explorer" badge! 🎉'
                    : `${3 - completedCoursesCount} more to earn your weekly "Explorer" badge!`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}