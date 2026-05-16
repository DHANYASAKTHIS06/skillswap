import { useApp } from "../../context/AppContext";
import { Button } from "../../components/ui/button";
import { BookOpen, Clock, CheckCircle } from "lucide-react";

export default function MyCourses() {
  const { courses } = useApp();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "requested":
        return (
          <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 text-xs font-medium rounded-full">
            Pending
          </span>
        );
      case "accepted":
        return (
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 text-xs font-medium rounded-full">
            Accepted
          </span>
        );
      case "active":
        return (
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs font-medium rounded-full">
            Active
          </span>
        );
      case "completed":
        return (
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-full">
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Courses</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your learning journey
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center gap-4">
              <img
                src={course.tutorImage}
                alt={course.tutorName}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{course.skill}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  with {course.tutorName}
                </p>
              </div>
              {getStatusBadge(course.status)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
