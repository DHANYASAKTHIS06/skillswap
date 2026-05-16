import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  UserProfile,
  UserRole,
  Gender,
  RegisterPayload,
  LoginPayload,
  UpdateProfilePayload,
  registerUser,
  loginUser,
  logoutUser as logoutService,
  fetchCurrentUser,
  updateUserProfile,
  getStoredToken,
  getStoredUser,
  clearStoredToken,
} from "../services/apiService";

// ─── Context Type ────────────────────────────────────────────────────────────
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  token: string | null;

  login: (payload: LoginPayload) => Promise<{ success: boolean; error?: string }>;
  signup: (payload: RegisterPayload) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: UpdateProfilePayload) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// ─── Provider ────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Restore session on mount
  useEffect(() => {
    const init = async () => {
      const storedToken = getStoredToken();
      const storedUser = getStoredUser();

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      // Optimistically restore from localStorage first (instant UI)
      if (storedUser) {
        setUser(storedUser);
        setToken(storedToken);
      }

      // Then verify token with server
      const result = await fetchCurrentUser();
      if (result.success && result.user) {
        setUser(result.user);
        setToken(storedToken);
      } else {
        // Token invalid/expired
        clearStoredToken();
        setUser(null);
        setToken(null);
      }

      setIsLoading(false);
    };

    init();
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const result = await loginUser(payload);
    if (result.success && result.user && result.token) {
      setUser(result.user);
      setToken(result.token);
      return { success: true };
    }
    return { success: false, error: result.error };
  }, []);

  const signup = useCallback(async (payload: RegisterPayload) => {
    const result = await registerUser(payload);
    if (result.success && result.user && result.token) {
      setUser(result.user);
      setToken(result.token);
      return { success: true };
    }
    return { success: false, error: result.error };
  }, []);

  const logout = useCallback(() => {
    logoutService();
    setUser(null);
    setToken(null);
  }, []);

  const updateProfile = useCallback(
    async (updates: UpdateProfilePayload) => {
      const result = await updateUserProfile(updates);
      if (result.success && result.user) {
        setUser(result.user);
      }
      return { success: result.success, error: result.error };
    },
    []
  );

  const resetPassword = useCallback(async (email: string) => {
    // TODO: implement actual password reset logic using apiService
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Password reset link sent to ${email}`);
  }, []);

  const value: AuthContextType = {
    isAuthenticated: !!user && !!token,
    isLoading,
    user,
    token,
    login,
    signup,
    logout,
    updateProfile,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
