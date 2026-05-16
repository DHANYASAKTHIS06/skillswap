import { useState } from "react";
import { useRequests } from "../../context/RequestsContext";
import { useApp } from "../../context/AppContext";
import { SkillRequest, UserProfile } from "../../services/apiService";
import { Button } from "../../components/ui/button";
import {
  CheckCircle,
  XCircle,
  Clock,
  BookOpen,
  MessageSquare,
  GraduationCap,
  Loader2,
  RefreshCw,
  Inbox,
  BadgeCheck,
  Ban,
  User,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    pending: {
      label: "Pending",
      className:
        "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800",
    },
    accepted: {
      label: "Accepted",
      className:
        "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800",
    },
    rejected: {
      label: "Declined",
      className:
        "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800",
    },
  };
  const cfg = map[status] ?? map["pending"];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}
    >
      {status === "pending" && <Clock className="w-3 h-3" />}
      {status === "accepted" && <BadgeCheck className="w-3 h-3" />}
      {status === "rejected" && <Ban className="w-3 h-3" />}
      {cfg.label}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl flex items-center justify-center mb-6 border border-indigo-100 dark:border-indigo-800">
        <Inbox className="w-12 h-12 text-indigo-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
        No new requests yet
      </h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-xs text-sm">
        When students send you a skill request, it will appear here. Check back
        soon!
      </p>
      <div className="flex items-center gap-2 mt-6 text-xs text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-full border border-indigo-200 dark:border-indigo-800">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        Connected to MongoDB · Live data
      </div>
    </div>
  );
}

// Helper to safely get sender info from populated or string
function getSender(req: SkillRequest): UserProfile | null {
  if (req.sender_id && typeof req.sender_id === "object") {
    return req.sender_id as UserProfile;
  }
  return null;
}

export default function StudentRequests() {
  const { receivedRequests, isLoadingReceived, accept, reject, refreshReceived } =
    useRequests();
  const { addNotification } = useApp();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const pendingRequests = receivedRequests.filter((r) => r.status === "pending");
  const decidedRequests = receivedRequests.filter(
    (r) => r.status === "accepted" || r.status === "rejected"
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshReceived();
    setRefreshing(false);
  };

  const handleAccept = async (req: SkillRequest) => {
    setActionLoading(req._id + "-accept");
    const sender = getSender(req);
    const result = await accept(req._id);
    if (result.success) {
      addNotification({
        title: "Request Accepted ✅",
        message: `You accepted ${sender?.name ?? "a student"}'s request.`,
        timestamp: "Just now",
        read: false,
        icon: "check-circle",
        type: "success",
      });
      toast.success(`Accepted ${sender?.name ?? "student"}'s request`);
    } else {
      toast.error(result.error || "Failed to accept request");
    }
    setActionLoading(null);
  };

  const handleDecline = async (req: SkillRequest) => {
    setActionLoading(req._id + "-decline");
    const sender = getSender(req);
    const result = await reject(req._id);
    if (result.success) {
      addNotification({
        title: "Request Declined",
        message: `You declined ${sender?.name ?? "a student"}'s request.`,
        timestamp: "Just now",
        read: false,
        icon: "info",
        type: "info",
      });
      toast.info(`Declined ${sender?.name ?? "student"}'s request`);
    } else {
      toast.error(result.error || "Failed to decline request");
    }
    setActionLoading(null);
  };

  // Loading skeleton
  if (isLoadingReceived) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-2" />
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </div>
          <div className="h-9 w-28 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
        </div>
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 space-y-4 animate-pulse"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
            </div>
            <div className="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl" />
            <div className="flex gap-2">
              <div className="h-10 flex-1 bg-gray-200 dark:bg-gray-700 rounded-xl" />
              <div className="h-10 flex-1 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1
            className="text-3xl font-bold mb-1"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Incoming Skill Requests
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Review and respond to student requests — data stored in MongoDB
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Live indicator */}
          <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-full px-3 py-1.5 text-xs text-indigo-700 dark:text-indigo-300">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            MongoDB · Live
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="rounded-xl gap-2"
            disabled={refreshing}
            id="refresh-requests-btn"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Pending count badge */}
      {pendingRequests.length > 0 && (
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-sm font-medium px-3 py-1.5 rounded-full">
            <Clock className="w-4 h-4" />
            {pendingRequests.length} pending request{pendingRequests.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Pending Requests */}
      {pendingRequests.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
          <EmptyState />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {pendingRequests.map((req) => {
            const sender = getSender(req);
            return (
              <div
                key={req._id}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Card header */}
                <div className="p-5 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {sender ? sender.name[0].toUpperCase() : <User className="w-6 h-6" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {sender?.name ?? "Unknown Student"}
                        </p>
                        <StatusBadge status={req.status} />
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                        {req.student_year && (
                          <span className="flex items-center gap-1">
                            <GraduationCap className="w-3 h-3" />
                            {req.student_year}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(req.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-5 space-y-4">
                  {/* Message */}
                  {req.message && (
                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">
                          Message
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {req.message}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-xl border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 gap-2"
                      onClick={() => handleDecline(req)}
                      disabled={!!actionLoading}
                      id={`decline-${req._id}`}
                    >
                      {actionLoading === req._id + "-decline" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      Decline
                    </Button>
                    <Button
                      className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white gap-2"
                      onClick={() => handleAccept(req)}
                      disabled={!!actionLoading}
                      id={`accept-${req._id}`}
                    >
                      {actionLoading === req._id + "-accept" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      Accept
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Recent Decisions */}
      {decidedRequests.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
            Recent Decisions
          </h2>
          <div className="space-y-3">
            {decidedRequests.map((req) => {
              const sender = getSender(req);
              return (
                <div
                  key={req._id}
                  className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {sender ? sender.name[0].toUpperCase() : "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {sender?.name ?? "Unknown Student"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                      <BookOpen className="w-3 h-3" />
                      Tutoring Request
                    </p>
                  </div>
                  <StatusBadge status={req.status} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
