// ─── Auth Service ───────────────────────────────────────────────────────────
// localStorage-based authentication backend simulation.
// Provides user registration, login, session management, and password hashing.

export type UserRole = "student" | "tutor" | "admin";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  skillsOffered: string[];
  skillsWanted: string[];
  location: string;
  createdAt: string;     // ISO timestamp
  lastLoginAt: string;   // ISO timestamp
}

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  token: string;         // simulated JWT
  expiresAt: number;     // ms timestamp
}

// ─── Storage Keys ───────────────────────────────────────────────────────────
const USERS_DB_KEY = "skillswap_users_db";
const SESSION_KEY = "skillswap_session";

// ─── Simple Hash (simulated bcrypt) ─────────────────────────────────────────
// In production, use bcrypt on a real server. This is a deterministic hash
// for localStorage simulation.
async function simpleHash(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text + "__skillswap_salt_2026__");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ─── Generate Token ─────────────────────────────────────────────────────────
function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ─── DB Helper ──────────────────────────────────────────────────────────────
function getUsers(): UserProfile[] {
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: UserProfile[]): void {
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
}

function saveSession(session: AuthSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

// ─── Seed Demo Accounts ─────────────────────────────────────────────────────
// Creates demo accounts on first load so users can try the app immediately.
export async function seedDemoAccounts(): Promise<void> {
  const users = getUsers();
  const demoEmails = [
    "student@cit.edu.in",
    "tutor@cit.edu.in",
    "admin@cit.edu.in",
  ];

  const existingEmails = new Set(users.map((u) => u.email));
  const needsSeed = demoEmails.some((e) => !existingEmails.has(e));

  if (!needsSeed) return;

  const passwordHash = await simpleHash("password");
  const now = new Date().toISOString();

  const demoUsers: UserProfile[] = [
    {
      id: "demo-student-001",
      name: "Alex Rivera",
      email: "student@cit.edu.in",
      passwordHash,
      role: "student",
      skillsOffered: ["Python", "Data Science"],
      skillsWanted: ["React", "UI/UX Design"],
      location: "Chennai",
      createdAt: now,
      lastLoginAt: now,
    },
    {
      id: "demo-tutor-001",
      name: "Sarah Chen",
      email: "tutor@cit.edu.in",
      passwordHash,
      role: "tutor",
      skillsOffered: ["Advanced React", "TypeScript"],
      skillsWanted: ["Machine Learning"],
      location: "Bangalore",
      createdAt: now,
      lastLoginAt: now,
    },
    {
      id: "demo-admin-001",
      name: "Admin User",
      email: "admin@cit.edu.in",
      passwordHash,
      role: "admin",
      skillsOffered: [],
      skillsWanted: [],
      location: "Delhi",
      createdAt: now,
      lastLoginAt: now,
    },
  ];

  const updatedUsers = [...users];
  for (const demo of demoUsers) {
    if (!existingEmails.has(demo.email)) {
      updatedUsers.push(demo);
    }
  }
  saveUsers(updatedUsers);
}

// ─── API: Register ──────────────────────────────────────────────────────────
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: "student" | "tutor";
}

export interface AuthResult {
  success: boolean;
  error?: string;
  session?: AuthSession;
  user?: UserProfile;
}

export async function registerUser(payload: RegisterPayload): Promise<AuthResult> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 800));

  const { name, email, password, role } = payload;

  // Validation
  if (!name.trim() || name.trim().length < 2) {
    return { success: false, error: "Name must be at least 2 characters." };
  }
  if (!email.trim()) {
    return { success: false, error: "Email is required." };
  }
  if (password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters." };
  }

  const normalizedEmail = email.toLowerCase().trim();
  const users = getUsers();

  // Check duplicate email
  if (users.some((u) => u.email === normalizedEmail)) {
    return {
      success: false,
      error: "An account with this email already exists. Please sign in instead.",
    };
  }

  // Create user
  const passwordHash = await simpleHash(password);
  const now = new Date().toISOString();
  const newUser: UserProfile = {
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    role,
    skillsOffered: [],
    skillsWanted: [],
    location: "",
    createdAt: now,
    lastLoginAt: now,
  };

  users.push(newUser);
  saveUsers(users);

  // Create session
  const session: AuthSession = {
    userId: newUser.id,
    email: newUser.email,
    name: newUser.name,
    role: newUser.role,
    token: generateToken(),
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
  };
  saveSession(session);

  return { success: true, session, user: newUser };
}

// ─── API: Login ─────────────────────────────────────────────────────────────
export interface LoginPayload {
  email: string;
  password: string;
}

export async function loginUser(payload: LoginPayload): Promise<AuthResult> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 800));

  const { email, password } = payload;
  const normalizedEmail = email.toLowerCase().trim();
  const users = getUsers();

  const user = users.find((u) => u.email === normalizedEmail);
  if (!user) {
    return {
      success: false,
      error: "No account found with this email. Please create an account first.",
    };
  }

  // Verify password
  const passwordHash = await simpleHash(password);
  if (passwordHash !== user.passwordHash) {
    return { success: false, error: "Incorrect password. Please try again." };
  }

  // Update last login
  user.lastLoginAt = new Date().toISOString();
  saveUsers(users);

  // Create session
  const session: AuthSession = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    token: generateToken(),
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
  };
  saveSession(session);

  return { success: true, session, user };
}

// ─── API: Restore Session (Auto-Login) ──────────────────────────────────────
export function restoreSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const session: AuthSession = JSON.parse(raw);

    // Check expiration
    if (session.expiresAt < Date.now()) {
      clearSession();
      return null;
    }

    // Verify user still exists in DB
    const users = getUsers();
    const user = users.find((u) => u.id === session.userId);
    if (!user) {
      clearSession();
      return null;
    }

    return session;
  } catch {
    clearSession();
    return null;
  }
}

// ─── API: Logout ────────────────────────────────────────────────────────────
export function logoutUser(): void {
  clearSession();
}

// ─── API: Get User Profile ──────────────────────────────────────────────────
export function getUserProfile(userId: string): UserProfile | null {
  const users = getUsers();
  return users.find((u) => u.id === userId) || null;
}

// ─── API: Update User Profile ───────────────────────────────────────────────
export interface UpdateProfilePayload {
  name?: string;
  skillsOffered?: string[];
  skillsWanted?: string[];
  location?: string;
}

export async function updateUserProfile(
  userId: string,
  updates: UpdateProfilePayload
): Promise<AuthResult> {
  await new Promise((r) => setTimeout(r, 400));

  const users = getUsers();
  const idx = users.findIndex((u) => u.id === userId);

  if (idx === -1) {
    return { success: false, error: "User not found." };
  }

  const user = users[idx];
  if (updates.name !== undefined) user.name = updates.name;
  if (updates.skillsOffered !== undefined) user.skillsOffered = updates.skillsOffered;
  if (updates.skillsWanted !== undefined) user.skillsWanted = updates.skillsWanted;
  if (updates.location !== undefined) user.location = updates.location;

  saveUsers(users);

  // Also update session name if it changed
  const raw = localStorage.getItem(SESSION_KEY);
  if (raw) {
    const session: AuthSession = JSON.parse(raw);
    if (session.userId === userId && updates.name) {
      session.name = updates.name;
      saveSession(session);
    }
  }

  return { success: true, user };
}

// ─── API: Get All Users (admin) ─────────────────────────────────────────────
export function getAllUsers(): UserProfile[] {
  return getUsers().map((u) => ({ ...u, passwordHash: "***" }));
}

// ─── API: Reset Password ───────────────────────────────────────────────────
export async function resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
  await new Promise((r) => setTimeout(r, 600));

  const normalizedEmail = email.toLowerCase().trim();
  const users = getUsers();
  const user = users.find((u) => u.email === normalizedEmail);

  if (!user) {
    // Don't reveal whether email exists (security best practice)
    return { success: true };
  }

  // In a real app, send a reset link via email.
  // Here we just simulate success.
  return { success: true };
}
