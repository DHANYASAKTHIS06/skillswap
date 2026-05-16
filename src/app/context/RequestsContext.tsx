import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  SkillRequest,
  SendRequestPayload,
  sendSkillRequest,
  fetchSentRequests,
  fetchReceivedRequests,
  acceptRequest,
  rejectRequest,
  cancelRequest,
} from "../services/apiService";
import { useAuth } from "./AuthContext";

interface RequestsContextType {
  sentRequests: SkillRequest[];
  receivedRequests: SkillRequest[];
  isLoadingSent: boolean;
  isLoadingReceived: boolean;
  sendRequest: (payload: SendRequestPayload) => Promise<{ success: boolean; error?: string }>;
  accept: (id: string) => Promise<{ success: boolean; error?: string }>;
  reject: (id: string) => Promise<{ success: boolean; error?: string }>;
  cancel: (id: string) => Promise<{ success: boolean; error?: string }>;
  refreshSent: () => Promise<void>;
  refreshReceived: () => Promise<void>;
}

const RequestsContext = createContext<RequestsContextType | undefined>(undefined);

export function useRequests() {
  const ctx = useContext(RequestsContext);
  if (!ctx) throw new Error("useRequests must be used within RequestsProvider");
  return ctx;
}

export function RequestsProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  const [sentRequests, setSentRequests] = useState<SkillRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<SkillRequest[]>([]);
  const [isLoadingSent, setIsLoadingSent] = useState(false);
  const [isLoadingReceived, setIsLoadingReceived] = useState(false);

  const refreshSent = useCallback(async () => {
    setIsLoadingSent(true);
    const result = await fetchSentRequests();
    if (result.success && result.requests) {
      setSentRequests(result.requests);
    }
    setIsLoadingSent(false);
  }, []);

  const refreshReceived = useCallback(async () => {
    setIsLoadingReceived(true);
    const result = await fetchReceivedRequests();
    if (result.success && result.requests) {
      setReceivedRequests(result.requests);
    }
    setIsLoadingReceived(false);
  }, []);

  // Auto-load on mount when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshSent();
      refreshReceived();
    } else {
      setSentRequests([]);
      setReceivedRequests([]);
    }
  }, [isAuthenticated, refreshSent, refreshReceived]);

  const sendRequest = useCallback(async (payload: SendRequestPayload) => {
    const result = await sendSkillRequest(payload);
    if (result.success) {
      // Add the new request to sent list immediately
      if (result.request) {
        setSentRequests((prev) => [result.request!, ...prev]);
      }
      return { success: true };
    }
    return { success: false, error: result.error };
  }, []);

  const accept = useCallback(async (id: string) => {
    const result = await acceptRequest(id);
    if (result.success && result.request) {
      setReceivedRequests((prev) =>
        prev.map((r) => (r._id === id ? result.request! : r))
      );
      return { success: true };
    }
    return { success: false, error: result.error };
  }, []);

  const reject = useCallback(async (id: string) => {
    const result = await rejectRequest(id);
    if (result.success && result.request) {
      setReceivedRequests((prev) =>
        prev.map((r) => (r._id === id ? result.request! : r))
      );
      return { success: true };
    }
    return { success: false, error: result.error };
  }, []);

  const cancel = useCallback(async (id: string) => {
    const result = await cancelRequest(id);
    if (result.success) {
      setSentRequests((prev) => prev.filter((r) => r._id !== id));
      return { success: true };
    }
    return { success: false, error: result.error };
  }, []);

  return (
    <RequestsContext.Provider
      value={{
        sentRequests,
        receivedRequests,
        isLoadingSent,
        isLoadingReceived,
        sendRequest,
        accept,
        reject,
        cancel,
        refreshSent,
        refreshReceived,
      }}
    >
      {children}
    </RequestsContext.Provider>
  );
}
