// ─── API Client ──────────────────────────────────────────────────────────────
// Centralized HTTP client for all backend requests.
// Base URL points to our Express server.

const BASE_URL = (import.meta as any).env?.VITE_API_URL || "/api";

// ─── Token Management ────────────────────────────────────────────────────────
const TOKEN_KEY = "skillswap_token";
const USER_KEY = "skillswap_user";

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: UserProfile): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// ─── Types ───────────────────────────────────────────────────────────────────
export type UserRole = "student" | "tutor" | "admin";
export type Gender = "male" | "female" | "other";
export type RequestStatus = "pending" | "accepted" | "rejected";

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  gender: Gender;
  women_mode: boolean;
  skillsOffered: string[];
  skillsWanted: string[];
  location: string;
  bio?: string;
  created_at: string;
  lastLoginAt?: string;
}

export interface SkillRequest {
  _id: string;
  sender_id: UserProfile | string;
  receiver_id: UserProfile | string;
  status: RequestStatus;
  message?: string;
  student_year?: string;
  created_at: string;
  responded_at?: string;
}

export interface ApiResult<T = undefined> {
  success: boolean;
  error?: string;
  data?: T;
}

// ─── HTTP Helper ─────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function request(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();
  return data;
}

// ─── Auth API ─────────────────────────────────────────────────────────────────
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: "student" | "tutor";
  gender: Gender;
  women_mode: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  name?: string;
  skillsOffered?: string[];
  skillsWanted?: string[];
  location?: string;
  bio?: string;
  women_mode?: boolean;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: UserProfile;
  error?: string;
}

export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  try {
    const data = await request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (data.success && data.token && data.user) {
      setStoredToken(data.token);
      setStoredUser(data.user);
    }

    return data as AuthResponse;
  } catch (err) {
    return { success: false, error: "Network error. Is the backend server running?" };
  }
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const data = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (data.success && data.token && data.user) {
      setStoredToken(data.token);
      setStoredUser(data.user);
    }

    return data as AuthResponse;
  } catch (err) {
    return { success: false, error: "Network error. Is the backend server running?" };
  }
}

export async function fetchCurrentUser(): Promise<AuthResponse> {
  try {
    const data = await request("/auth/me");
    if (data.success && data.user) {
      setStoredUser(data.user);
    }
    return data as AuthResponse;
  } catch (err) {
    return { success: false, error: "Network error." };
  }
}

export async function updateUserProfile(updates: UpdateProfilePayload): Promise<AuthResponse> {
  try {
    const data = await request("/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
    if (data.success && data.user) {
      setStoredUser(data.user);
    }
    return data as AuthResponse;
  } catch (err) {
    return { success: false, error: "Network error." };
  }
}

export function logoutUser(): void {
  // Best-effort logout ping (don't await to avoid blocking UI)
  request("/auth/logout", { method: "POST" }).catch(() => { });
  clearStoredToken();
}

// ─── Requests API ─────────────────────────────────────────────────────────────
export interface SendRequestPayload {
  receiver_id: string;
  message?: string;
  student_year?: string;
}

export interface RequestsResponse {
  success: boolean;
  requests?: SkillRequest[];
  request?: SkillRequest;
  error?: string;
  count?: number;
}

export async function sendSkillRequest(payload: SendRequestPayload): Promise<RequestsResponse> {
  try {
    return await request("/requests", {
      method: "POST",
      body: JSON.stringify(payload),
    }) as RequestsResponse;
  } catch {
    return { success: false, error: "Network error." };
  }
}

export async function fetchSentRequests(): Promise<RequestsResponse> {
  try {
    return await request("/requests/sent") as RequestsResponse;
  } catch {
    return { success: false, error: "Network error." };
  }
}

export async function fetchReceivedRequests(): Promise<RequestsResponse> {
  try {
    return await request("/requests/received") as RequestsResponse;
  } catch {
    return { success: false, error: "Network error." };
  }
}

export async function acceptRequest(requestId: string): Promise<RequestsResponse> {
  try {
    return await request(`/requests/${requestId}/accept`, { method: "PATCH" }) as RequestsResponse;
  } catch {
    return { success: false, error: "Network error." };
  }
}

export async function rejectRequest(requestId: string): Promise<RequestsResponse> {
  try {
    return await request(`/requests/${requestId}/reject`, { method: "PATCH" }) as RequestsResponse;
  } catch {
    return { success: false, error: "Network error." };
  }
}

export async function cancelRequest(requestId: string): Promise<RequestsResponse> {
  try {
    return await request(`/requests/${requestId}`, { method: "DELETE" }) as RequestsResponse;
  } catch {
    return { success: false, error: "Network error." };
  }
}

// ─── Users API ───────────────────────────────────────────────────────────────
export interface UsersResponse {
  success: boolean;
  users?: UserProfile[];
  user?: UserProfile;
  error?: string;
  count?: number;
}

export async function fetchUsers(params?: { role?: string; skill?: string }): Promise<UsersResponse> {
  try {
    const qs = params
      ? "?" + new URLSearchParams(params as Record<string, string>).toString()
      : "";
    return await request(`/users${qs}`) as UsersResponse;
  } catch {
    return { success: false, error: "Network error." };
  }
}

export async function fetchAllUsersAdmin(): Promise<UsersResponse> {
  try {
    return await request("/users/admin/all") as UsersResponse;
  } catch {
    return { success: false, error: "Network error." };
  }
}
