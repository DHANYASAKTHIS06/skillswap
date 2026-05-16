import { Users, BookOpen, TrendingUp, Inbox, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useRequests } from "../../context/RequestsContext";
import { fetchUsers } from "../../services/apiService";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";

export default function TutorOverview() {
  const { user, updateProfile } = useAuth();
  const { receivedRequests } = useRequests();
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    fetchUsers({ role: "student" }).then((res) => {
      if (res.success && res.users) {
        setStudentCount(res.users.length);
      }
    });
  }, []);

  // Real dynamic data from MongoDB incoming requests
  const pendingRequests = receivedRequests.filter((r) => r.status === "pending");
  const acceptedRequests = receivedRequests.filter((r) => r.status === "accepted");
  
  // Just dummy constants for things we don't have MongoDB maps yet
  const completedCoursesCount = 0;
  const tutorCredits = 0;

  const [mySkills, setMySkills] = useState<string[]>(user?.skills || []);
  const [newSkill, setNewSkill] = useState("");
  const [savingSkills, setSavingSkills] = useState(false);

  const handleAddSkill = () => {
    if (newSkill.trim() && !mySkills.includes(newSkill.trim())) {
      setMySkills([...mySkills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setMySkills(mySkills.filter(s => s !== skill));
  };

  const handleSaveSkills = async () => {
    setSavingSkills(true);
    const result = await updateProfile({ skills: mySkills });
    setSavingSkills(false);
    if (result.success) {
      toast.success("Skills updated successfully!");
    } else {
      toast.error(result.error || "Failed to update skills");
    }
  };

  const firstName = user?.name?.split(" ")[0] || "Tutor";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome, {firstName}! 👋</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {pendingRequests.length > 0
            ? `You have ${pendingRequests.length} pending student request${pendingRequests.length !== 1 ? "s" : ""}.`
            : "Your tutor dashboard — track your students and performance."}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Students</p>
          </div>
          <p className="text-3xl font-bold">{studentCount}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" />
              </svg>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Skill Credits</p>
          </div>
          <p className="text-3xl font-bold">{tutorCredits}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Accepted Students</p>
          </div>
          <p className="text-3xl font-bold">{acceptedRequests.length}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
          </div>
          <p className="text-3xl font-bold">{completedCoursesCount}</p>
        </div>
      </div>

      {/* Tutor Profile - Edit Skills */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-semibold mb-4">Edit Profile - My Skills</h2>
        <p className="text-sm text-gray-500 mb-4">
          Add or remove the skills you are able to teach. This helps students find you!
        </p>
        <div className="flex flex-col gap-4 max-w-lg">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Python, UI Design, Guitar..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button onClick={handleAddSkill} variant="outline" className="rounded-xl">Add</Button>
          </div>
          
          <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
            {mySkills.length === 0 ? (
              <span className="text-sm text-gray-400 italic self-center ml-2">No skills added yet.</span>
            ) : (
              mySkills.map((skill, idx) => (
                <span key={idx} className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                  {skill}
                  <button onClick={() => handleRemoveSkill(skill)} className="hover:text-blue-900 dark:hover:text-blue-100 ml-1">&times;</button>
                </span>
              ))
            )}
          </div>
          
          <Button 
            onClick={handleSaveSkills} 
            disabled={savingSkills}
            className="w-full sm:w-auto self-start bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
          >
            {savingSkills ? "Saving..." : "Save Skills"}
          </Button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>

        {receivedRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-3xl flex items-center justify-center mb-4">
              <Inbox className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No activity yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-xs text-sm">
              When students send you tutoring requests, they will appear here. Your dashboard updates in real-time syncing from MongoDB.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {receivedRequests.slice(0, 5).map((req) => {
              const senderObj = typeof req.sender_id === "object" ? req.sender_id : null;
              const senderName = senderObj?.name || "Student";
              return (
                <div
                  key={req._id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {senderName[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {senderName} — Tutoring Request
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(req.created_at || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      req.status === "pending"
                        ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                        : req.status === "accepted"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                    }`}
                  >
                    {req.status === "pending"
                      ? "Pending"
                      : req.status === "accepted"
                      ? "Accepted"
                      : "Rejected"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* System Health — always shown */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80 mb-1">SYSTEM STATUS</p>
            <h3 className="text-2xl font-bold">All Systems Operational</h3>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
