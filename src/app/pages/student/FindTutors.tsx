import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { useRequests } from "../../context/RequestsContext";
import { fetchUsers, UserProfile } from "../../services/apiService";
import {
  Star,
  Sparkles,
  ArrowRight,
  X,
  Send,
  Loader2,
  CheckCircle2,
  Shield,
  ShieldCheck,
  Users,
  MapPin,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";

// ── Request Modal ─────────────────────────────────────────────────────────────
function RequestModal({
  open,
  onClose,
  preselectedUser,
  availableUsers,
}: {
  open: boolean;
  onClose: () => void;
  preselectedUser?: UserProfile;
  availableUsers: UserProfile[];
}) {
  const { user: currentUser } = useAuth();
  const { sendRequest } = useRequests();
  const { addNotification } = useApp();

  const [selectedUserId, setSelectedUserId] = useState(preselectedUser?._id ?? "");
  const [year, setYear] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset when modal opens
  useEffect(() => {
    if (open) {
      setSelectedUserId(preselectedUser?._id ?? "");
      setSubmitted(false);
      setErrors({});
    }
  }, [open, preselectedUser]);

  const selectedUser = availableUsers.find((u) => u._id === selectedUserId);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!selectedUserId) e.user = "Please select a tutor";
    if (!message.trim()) e.message = "Message is required";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    const result = await sendRequest({
      receiver_id: selectedUserId,
      message: message.trim(),
      student_year: year.trim(),
    });

    setLoading(false);

    if (result.success) {
      setSubmitted(true);
      addNotification({
        title: "Request Sent ✅",
        message: `Your request to ${selectedUser?.name ?? "the tutor"} has been saved.`,
        timestamp: "Just now",
        read: false,
        icon: "clock",
        type: "info",
      });
      toast.success("Request sent successfully!");
      setTimeout(() => {
        setSubmitted(false);
        setYear("");
        setMessage("");
        setSelectedUserId(preselectedUser?._id ?? "");
        onClose();
      }, 1800);
    } else {
      toast.error(result.error || "Failed to send request");
      setErrors({ submit: result.error || "Failed to send request" });
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-lg overflow-hidden"
        style={{ animation: "modalIn 0.2s ease-out" }}
      >
        <style>{`
          @keyframes modalIn {
            from { opacity: 0; transform: scale(0.95) translateY(8px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
          <div>
            <h2 className="font-bold text-lg" style={{ fontFamily: "Poppins, sans-serif" }}>
              Send a Skill Request
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Saved directly to MongoDB · visible in Compass
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-9 h-9 text-green-500" />
            </div>
            <h3 className="font-bold text-lg mb-1">Request Sent!</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your request to {selectedUser?.name} has been saved to MongoDB.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* MongoDB badge */}
            <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-700 dark:text-green-300">
                Request stored in MongoDB <code className="font-mono">requests</code> collection
              </span>
            </div>

            {/* Women Mode notice */}
            {currentUser?.women_mode && (
              <div className="flex items-center gap-2 bg-pink-50 dark:bg-pink-900/10 border border-pink-200 dark:border-pink-800 rounded-lg px-3 py-2">
                <ShieldCheck className="w-4 h-4 text-pink-500" />
                <span className="text-xs text-pink-700 dark:text-pink-300 font-medium">
                  Women Safe Mode Enabled — only showing female users
                </span>
              </div>
            )}

            {/* Submit error */}
            {errors.submit && (
              <div className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                {errors.submit}
              </div>
            )}

            {/* Select User */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Select Tutor / Skill Partner
              </label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className={`w-full bg-gray-50 dark:bg-gray-800 border rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${errors.user ? "border-red-400" : "border-gray-200 dark:border-gray-700"
                  }`}
              >
                <option value="">— Choose a tutor —</option>
                {availableUsers.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.role})
                    {u.skills.length > 0 ? ` · offers: ${u.skills.slice(0, 2).join(", ")}` : ""}
                  </option>
                ))}
              </select>
              {errors.user && <p className="text-xs text-red-500 mt-1">{errors.user}</p>}
              {selectedUser && (
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                    {selectedUser.name[0]}
                  </div>
                  <span className="capitalize">{selectedUser.role}</span>
                  {selectedUser.location && (
                    <>
                      <span>·</span>
                      <MapPin className="w-3 h-3" />
                      <span>{selectedUser.location}</span>
                    </>
                  )}
                  {selectedUser.gender === "female" && selectedUser.women_mode && (
                    <span className="flex items-center gap-0.5 text-pink-500">
                      <Shield className="w-3 h-3" /> Safe Mode
                    </span>
                  )}
                </div>
              )}
            </div>



            {/* Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Your Year / Level (optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 2nd Year, Final Semester…"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Message
              </label>
              <textarea
                rows={3}
                placeholder="Describe what you want to learn and what you can offer in exchange…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`w-full bg-gray-50 dark:bg-gray-800 border rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-all ${errors.message ? "border-red-400" : "border-gray-200 dark:border-gray-700"
                  }`}
              />
              {errors.message && (
                <p className="text-xs text-red-500 mt-1">{errors.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              id="send-request-submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl py-3 gap-2 transition-all hover:scale-[1.02] disabled:opacity-60 disabled:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving to MongoDB…
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Request
                </>
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function FindTutors() {
  const { user: currentUser } = useAuth();
  const { selectedSkill, setSelectedSkill } = useApp();
  const { sentRequests } = useRequests();
  const [filter, setFilter] = useState("All Skills");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [preselectedUser, setPreselectedUser] = useState<UserProfile | undefined>();
  const [availableUsers, setAvailableUsers] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const skills = [
    "All Skills", "React", "Python", "TypeScript", "UI/UX Design",
    "Machine Learning", "Figma", "Node.js", "Data Science", "Flutter",
  ];

  useEffect(() => {
    const load = async () => {
      setLoadingUsers(true);
      const result = await fetchUsers({ role: "tutor" });
      if (result.success && result.users) {
        setAvailableUsers(result.users);
      }
      setLoadingUsers(false);
    };
    load();
  }, []);

  const filteredUsers = availableUsers.filter((u) => {
    const matchesFilter =
      filter === "All Skills" ||
      u.skills.some((s: string) => s.toLowerCase().includes(filter.toLowerCase()));
    const matchesSearch =
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.skills.some((s: string) => s.toLowerCase().includes(search.toLowerCase())) ||
      u.location.toLowerCase().includes(search.toLowerCase());
    const matchesWomenMode = !currentUser?.women_mode || u.gender === "female";
    return matchesFilter && matchesSearch && matchesWomenMode;
  });

  const getRequestStatus = (userId: string) => {
    const req = sentRequests.find((r) => {
      if (typeof r.receiver_id === "object") {
        return r.receiver_id._id === userId;
      }
      return r.receiver_id === userId;
    });
    return req ? req.status : null;
  };

  const openRequestModal = (user?: UserProfile) => {
    setPreselectedUser(user);
    setModalOpen(true);
  };

  return (
    <>
      <RequestModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        preselectedUser={preselectedUser}
        availableUsers={availableUsers}
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Find Skill Partners</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Browse registered users and send skill swap requests — saved to MongoDB
            </p>
          </div>

          {/* Women Mode banner */}
          {currentUser?.women_mode && (
            <div className="flex items-center gap-2 bg-pink-50 dark:bg-pink-900/10 border border-pink-200 dark:border-pink-800 rounded-xl px-4 py-2">
              <ShieldCheck className="w-5 h-5 text-pink-500" />
              <span className="text-sm font-medium text-pink-700 dark:text-pink-300">
                Women Safe Mode Enabled
              </span>
            </div>
          )}

          <Button
            onClick={() => openRequestModal()}
            id="open-send-request-btn"
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl gap-2"
          >
            <Send className="w-4 h-4" />
            Send Request
          </Button>
        </div>

        {/* Search & Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search by name, skill, or location…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 pl-10 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>

          <div className="flex gap-2 flex-wrap">
            {skills.map((skill) => (
              <button
                key={skill}
                onClick={() => {
                  setFilter(skill);
                  setSelectedSkill(skill);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === skill
                  ? "bg-indigo-500 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loadingUsers ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 animate-pulse"
              >
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="flex gap-2">
                      <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                      <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-16 text-center">
            <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {currentUser?.women_mode ? "No female tutors found" : "No tutors found"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {currentUser?.women_mode
                ? "Women Safe Mode is on — only female tutors are shown. Invite more female users to join!"
                : "Try a different skill filter or search term."}
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <h2 className="text-xl font-semibold">
                {filteredUsers.length} Tutor{filteredUsers.length !== 1 ? "s" : ""} Available
              </h2>
              {currentUser?.women_mode && (
                <span className="flex items-center gap-1 text-xs text-pink-500 bg-pink-50 dark:bg-pink-900/20 px-2 py-0.5 rounded-full border border-pink-200 dark:border-pink-800">
                  <ShieldCheck className="w-3 h-3" /> Female only
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4">
              {filteredUsers.map((u) => (
                <UserCard
                  key={u._id}
                  user={u}
                  onRequest={openRequestModal}
                  status={getRequestStatus(u._id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ── User Card ─────────────────────────────────────────────────────────────────
function UserCard({
  user,
  onRequest,
  status,
}: {
  user: UserProfile;
  onRequest: (user: UserProfile) => void;
  status: string | null;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
            {user.name[0].toUpperCase()}
          </div>
          {user.women_mode && user.gender === "female" && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-pink-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
              <Shield className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
            <div>
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="capitalize">{user.role}</span>
                {user.location && (
                  <>
                    <span>·</span>
                    <MapPin className="w-3 h-3" />
                    <span>{user.location}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Skills They Teach */}
          {user.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              <span className="text-xs text-gray-400 font-medium self-center">Teaches:</span>
              {user.skills.map((s: string, i: number) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full"
                >
                  {s}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-end">
            {!status ? (
              <Button
                onClick={() => onRequest(user)}
                id={`request-user-${user._id}`}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl gap-2"
              >
                Request
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                disabled
                className={`rounded-xl gap-2 text-white font-semibold flex items-center ${status === "pending"
                  ? "bg-amber-500 hover:bg-amber-500"
                  : status === "accepted"
                    ? "bg-green-500 hover:bg-green-500"
                    : "bg-red-500 hover:bg-red-500"
                  }`}
              >
                {status === "pending" && <Loader2 className="w-4 h-4 animate-spin" />}
                {status === "accepted" && <CheckCircle2 className="w-4 h-4" />}
                {status === "rejected" && <X className="w-4 h-4" />}
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
