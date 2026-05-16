export default function StudentProfile() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your account</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-4 mb-6">
          <img
            src="figma:asset/4a61db49c15cd921b9cb38a2013b8299f1b2f60c.png"
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h2 className="text-2xl font-semibold">Alex</h2>
            <p className="text-gray-600 dark:text-gray-400">Student</p>
          </div>
        </div>
      </div>
    </div>
  );
}
