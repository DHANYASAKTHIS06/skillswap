import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import {
  Mail,
  Lock,
  ArrowRight,
  Moon,
  Sun,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Send,
} from "lucide-react";
import { getStoredUser } from "../../services/apiService";

// Floating label input
function FloatingInput({
  id,
  type,
  label,
  value,
  onChange,
  icon: Icon,
  suffix,
}: {
  id: string;
  type: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ElementType;
  suffix?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  return (
    <div className="relative">
      <div className="relative flex items-center border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
        <Icon className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full pl-11 pr-10 pt-5 pb-2 bg-transparent text-gray-900 dark:text-gray-100 rounded-xl outline-none text-sm"
          placeholder=""
        />
        <label
          htmlFor={id}
          className={`absolute left-11 pointer-events-none transition-all duration-200 ${lifted
              ? "top-1.5 text-xs text-indigo-500 font-medium"
              : "top-1/2 -translate-y-1/2 text-sm text-gray-400"
            }`}
        >
          {label}
        </label>
        {suffix && (
          <div className="absolute right-3">{suffix}</div>
        )}
      </div>
    </div>
  );
}

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Forgot password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const { theme, toggleTheme } = useApp();
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    const result = await login({ email, password });
    setLoading(false);

    if (result.success) {
      // Fetch user again to be sure we have the latest role (the login call already returns it though)
      const role = getStoredUser()?.role;
      const rolePath = role === "student" ? "/student" : role === "tutor" ? "/tutor" : "/admin";
      navigate(rolePath, { replace: true });
    } else {
      setError(result.error || "Login failed. Please try again.");
    }
  };

  const handleDemoLogin = async (role: "student" | "tutor" | "admin") => {
    const demoEmails: Record<string, string> = {
      student: "student@cit.edu.in",
      tutor: "tutor@cit.edu.in",
      admin: "admin@cit.edu.in",
    };
    setEmail(demoEmails[role]);
    setPassword("password");
    setError("");

    // Auto-submit after filling
    setLoading(true);
    const result = await login({ email: demoEmails[role], password: "password" });
    setLoading(false);

    if (result.success) {
      const role = getStoredUser()?.role;
      const rolePath = role === "student" ? "/student" : role === "tutor" ? "/tutor" : "/admin";
      navigate(rolePath, { replace: true });
    } else {
      setError(result.error || "Demo login failed.");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;

    setResetLoading(true);
    await resetPassword(resetEmail);
    setResetLoading(false);
    setResetSent(true);
  };

  // ── Forgot Password Modal ──────────────────────────────────────────────
  if (showForgotPassword) {
    return (
      <div
        className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors flex items-center justify-center px-4"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
            {resetSent ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <h2 className="text-xl font-bold" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Check Your Email
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  If an account exists with <span className="font-medium text-gray-700 dark:text-gray-300">{resetEmail}</span>,
                  you'll receive a password reset link shortly.
                </p>
                <Button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetSent(false);
                    setResetEmail("");
                  }}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl"
                >
                  Back to Sign In
                </Button>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-7 h-7 text-indigo-500" />
                  </div>
                  <h2 className="text-xl font-bold mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>
                    Reset Password
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enter your email and we'll send you a reset link
                  </p>
                </div>

                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <FloatingInput
                    id="reset-email"
                    type="email"
                    label="Email Address"
                    value={resetEmail}
                    onChange={setResetEmail}
                    icon={Mail}
                  />
                  <Button
                    type="submit"
                    disabled={resetLoading || !resetEmail.trim()}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-60"
                  >
                    {resetLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending…
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Send Reset Link
                      </span>
                    )}
                  </Button>
                </form>

                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetEmail("");
                  }}
                  className="block w-full text-center text-sm text-gray-500 hover:text-indigo-500 mt-4 transition-colors"
                >
                  ← Back to Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Sign-in form ────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 z-50">
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span
              className="font-semibold text-indigo-600 dark:text-indigo-400 text-lg"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Skill Swap
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </div>
      </header>

      {/* Main */}
      <div className="flex items-center justify-center min-h-screen pt-16 pb-8 px-4">
        <div className="w-full max-w-md">
          {/* Tab strip */}
          <div className="flex mb-8 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            <button className="flex-1 py-2 text-sm font-medium bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 rounded-lg shadow-sm">
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="flex-1 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 rounded-lg hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              Create Account
            </button>
          </div>

          {/* Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
            <div className="text-center mb-8">
              <h1
                className="text-2xl font-bold mb-1"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Welcome Back
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Sign in with your email and password
              </p>
            </div>

            {/* Dynamic status badge */}
            <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg px-3 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-indigo-700 dark:text-indigo-300">
                System live · Persistent login enabled
              </span>
            </div>

            {/* Animated error card */}
            {error && (
              <div
                className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6"
                style={{ animation: "slideIn 0.3s ease-out" }}
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-700 dark:text-red-400">
                    Sign In Failed
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-500 mt-0.5">{error}</p>
                </div>
                <style>{`
                  @keyframes slideIn {
                    from { opacity: 0; transform: translateY(-8px); }
                    to   { opacity: 1; transform: translateY(0); }
                  }
                `}</style>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <FloatingInput
                id="email"
                type="email"
                label="Email Address"
                value={email}
                onChange={(v) => { setEmail(v); setError(""); }}
                icon={Mail}
              />

              <FloatingInput
                id="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                value={password}
                onChange={(v) => { setPassword(v); setError(""); }}
                icon={Lock}
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                }
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-xs text-indigo-500 hover:text-indigo-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all hover:scale-[1.02] disabled:opacity-60 disabled:scale-100"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing In…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign In <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white dark:bg-gray-900 px-3 text-gray-500">
                  TRY A DEMO ACCOUNT
                </span>
              </div>
            </div>

            {/* Demo accounts */}
            <div className="grid grid-cols-3 gap-2">
              {(["student", "tutor", "admin"] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleDemoLogin(role)}
                  disabled={loading}
                  className="py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium capitalize text-gray-600 dark:text-gray-400 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all disabled:opacity-50"
                >
                  {role === "student" ? "🎓" : role === "tutor" ? "📚" : "🛡️"} {role}
                </button>
              ))}
            </div>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
              >
                Create Account
              </button>
            </p>
          </div>

          <div className="mt-6 flex justify-center gap-6 text-xs text-gray-400">
            <button onClick={() => navigate("/")} className="hover:text-gray-600">
              ← Back to Home
            </button>
            <button className="hover:text-gray-600">Support</button>
            <button className="hover:text-gray-600">Privacy Policy</button>
          </div>
        </div>
      </div>
    </div>
  );
}
