export default function SavedNotes() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Saved Notes</h1>
        <p className="text-gray-600 dark:text-gray-400">Your learning materials</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl p-12 border border-gray-200 dark:border-gray-800 text-center">
        <p className="text-gray-500">No saved notes yet</p>
      </div>
    </div>
  );
}
