export default function ActiveCourses() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Active Courses</h1>
        <p className="text-gray-600 dark:text-gray-400">Your ongoing tutoring sessions</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl p-12 border border-gray-200 dark:border-gray-800 text-center">
        <p className="text-gray-500">No active courses</p>
      </div>
    </div>
  );
}
