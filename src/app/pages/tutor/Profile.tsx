export default function TutorProfile() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your tutor profile</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-4 mb-6">
          <img
            src="figma:asset/cafb7b5743696336dd503139cfc3ccfe8627302c.png"
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h2 className="text-2xl font-semibold">Dr. Sarah Chen</h2>
            <p className="text-gray-600 dark:text-gray-400">Tutor</p>
          </div>
        </div>
      </div>
    </div>
  );
}
