import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import {
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  GraduationCap,
  Moon,
  Sun,
  Loader2,
  PartyPopper,
  AlertCircle,
  Shield,
  ShieldCheck,
} from "lucide-react";

function PasswordStrengthBar({ password }: { password: string }) {
  const getStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getStrength();
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-green-500"];
  const textColors = ["", "text-red-500", "text-orange-400", "text-yellow-500", "text-green-500"];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= strength ? colors[strength] : "bg-gray-200 dark:bg-gray-700"
              }`}
          />
        ))}
      </div>
      {strength > 0 && (
        <p className={`text-xs font-medium ${textColors[strength]}`}>
          {labels[strength]} password
        </p>
      )}
    </div>
  );
}

function FieldStatus({ valid, error }: { valid: boolean; error: string }) {
  if (!error && !valid) return null;
  return (
    <div
      className={`flex items-center gap-1 mt-1 text-xs transition-all duration-200 ${valid ? "text-green-500" : "text-red-500"
        }`}
    >
      {valid ? (
        <CheckCircle2 className="w-3.5 h-3.5" />
      ) : (
        <XCircle className="w-3.5 h-3.5" />
      )}
      <span>{valid ? "Looks good!" : error}</span>
    </div>
  );
}

export default function SignUp() {
  const navigate = useNavigate();
  const { toggleTheme, theme } = useApp();
  const { signup } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    role: "student" as "student" | "tutor",
    gender: "other" as "male" | "female" | "other",
    women_mode: false,
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = {
    name: () => {
      if (!form.name.trim()) return "Full name is required";
      if (form.name.trim().length < 2) return "Name must be at least 2 characters";
      return "";
    },
    email: () => {
      if (!form.email) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        return "Please enter a valid email address";
      return "";
    },
    password: () => {
      if (!form.password) return "Password is required";
      if (form.password.length < 8) return "Must be at least 8 characters";
      return "";
    },
    confirm: () => {
      if (!form.confirm) return "Please confirm your password";
      if (form.confirm !== form.password) return "Passwords do not match";
      return "";
    },
  };

  const errors = {
    name: touched.name ? validate.name() : "",
    email: touched.email ? validate.email() : "",
    password: touched.password ? validate.password() : "",
    confirm: touched.confirm ? validate.confirm() : "",
  };

  const isValid = {
    name: touched.name && !validate.name(),
    email: touched.email && !validate.email(),
    password: touched.password && !validate.password(),
    confirm: touched.confirm && !validate.confirm(),
  };

  const allValid =
    !validate.name() &&
    !validate.email() &&
    !validate.password() &&
    !validate.confirm();

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-disable women_mode if gender changes away from female
      if (field === "gender" && value !== "female") {
        updated.women_mode = false;
      }
      return updated;
    });
    setServerError("");
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirm: true });
    if (!allValid) return;

    setLoading(true);
    setServerError("");

    const result = await signup({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role,
      gender: form.gender,
      women_mode: form.gender === "female" ? form.women_mode : false,
    });

    setLoading(false);

    if (result.success) {
      setSuccess(true);
      // Wait for success animation then navigate
      setTimeout(() => {
        const role = form.role;
        const rolePath = role === "student" ? "/student" : "/tutor";
        navigate(rolePath, { replace: true });
      }, 2500);
    } else {
      setServerError(result.error || "Registration failed. Please try again.");
    }
  };

  const inputClass = (field: string) =>
    `transition-all duration-200 ${errors[field as keyof typeof errors]
      ? "border-red-400 focus:ring-red-400"
      : isValid[field as keyof typeof isValid]
        ? "border-green-400 focus:ring-green-400"
        : ""
    }`;

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 flex items-center justify-center">
        <div className="text-center space-y-6 animate-bounce-in">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto border border-white/30">
            <PartyPopper className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white" style={{ fontFamily: "Poppins, sans-serif" }}>
            Welcome aboard!
          </h2>
          <p className="text-white/80 text-lg">
            Your account has been created successfully.
          </p>
          <p className="text-white/60 text-sm">
            You're signed in as a{" "}
            <span className="font-semibold text-white capitalize">{form.role}</span>.
            {form.women_mode && (
              <span className="block mt-1 text-pink-200">
                🛡️ Women Safe Mode is enabled on your account.
              </span>
            )}
          </p>
          <div className="flex items-center justify-center gap-2 text-white/70 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Redirecting to your dashboard…</span>
          </div>
          <style>{`
            @keyframes bounce-in {
              0% { opacity: 0; transform: scale(0.7); }
              60% { transform: scale(1.05); }
              100% { opacity: 1; transform: scale(1); }
            }
            .animate-bounce-in { animation: bounce-in 0.5s ease-out forwards; }
          `}</style>
        </div>
      </div>
    );
  }

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
            <button
              onClick={() => navigate("/signin")}
              className="flex-1 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 rounded-lg hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              Sign In
            </button>
            <button className="flex-1 py-2 text-sm font-medium bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 rounded-lg shadow-sm">
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
                Create Your Account
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Join the College Skill Exchange community
              </p>
            </div>

            {/* Live badge */}
            <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg px-3 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-indigo-700 dark:text-indigo-300">
                MongoDB connected · Data stored securely
              </span>
            </div>

            {/* Server error */}
            {serverError && (
              <div
                className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6"
                style={{ animation: "slideIn 0.3s ease-out" }}
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-700 dark:text-red-400">
                    Registration Error
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-500 mt-0.5">{serverError}</p>
                </div>
                <style>{`
                  @keyframes slideIn {
                    from { opacity: 0; transform: translateY(-8px); }
                    to   { opacity: 1; transform: translateY(0); }
                  }
                `}</style>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="name"
                    type="text"
                    placeholder="e.g. Priya Sharma"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    onBlur={() => handleBlur("name")}
                    className={inputClass("name")}
                  />
                  {isValid.name && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                  )}
                </div>
                <FieldStatus valid={isValid.name} error={errors.name} />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="email"
                    type="email"
                    placeholder="yourname@example.com"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    className={inputClass("email")}
                  />
                  {isValid.email && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                  )}
                </div>
                <FieldStatus valid={isValid.email} error={errors.email} />
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    onBlur={() => handleBlur("password")}
                    className={`pr-10 ${inputClass("password")}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <PasswordStrengthBar password={form.password} />
                <FieldStatus valid={isValid.password} error={errors.password} />
              </div>

              {/* Confirm Password */}
              <div>
                <Label htmlFor="confirm" className="text-sm font-medium">
                  Confirm Password
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="confirm"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={form.confirm}
                    onChange={(e) => handleChange("confirm", e.target.value)}
                    onBlur={() => handleBlur("confirm")}
                    className={`pr-10 ${inputClass("confirm")}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  {isValid.confirm && (
                    <CheckCircle2 className="absolute right-9 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                  )}
                </div>
                <FieldStatus valid={isValid.confirm} error={errors.confirm} />
              </div>

              {/* Role */}
              <div>
                <Label className="text-sm font-medium">I am a…</Label>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
                  This is saved to your profile and won't be asked again
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {(["student", "tutor"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleChange("role", r)}
                      className={`py-3 px-4 rounded-xl border-2 text-sm font-medium capitalize transition-all ${form.role === r
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                          : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-indigo-300"
                        }`}
                    >
                      {r === "student" ? "🎓 Student" : "📚 Tutor"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div>
                <Label className="text-sm font-medium">Gender</Label>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
                  Required for Women Safe Mode feature
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { value: "male", label: "👨 Male" },
                    { value: "female", label: "👩 Female" },
                    { value: "other", label: "🧑 Other" },
                  ] as const).map((g) => (
                    <button
                      key={g.value}
                      type="button"
                      onClick={() => handleChange("gender", g.value)}
                      className={`py-2.5 px-3 rounded-xl border-2 text-xs font-medium transition-all ${form.gender === g.value
                          ? "border-pink-400 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300"
                          : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-pink-200"
                        }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Women Safe Mode - only visible for female users */}
              {form.gender === "female" && (
                <div
                  className="border-2 border-pink-200 dark:border-pink-800 rounded-xl p-4 bg-pink-50 dark:bg-pink-900/10"
                  style={{ animation: "slideIn 0.2s ease-out" }}
                >
                  <div className="flex items-start gap-3">
                    {form.women_mode ? (
                      <ShieldCheck className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Shield className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-pink-700 dark:text-pink-300">
                            Women Safe Mode
                          </p>
                          <p className="text-xs text-pink-600 dark:text-pink-400 mt-0.5">
                            When enabled, you will only see and interact with other female users. All male profiles will be hidden.
                          </p>
                        </div>
                        <button
                          type="button"
                          id="women-mode-toggle"
                          onClick={() => handleChange("women_mode", !form.women_mode)}
                          className={`relative ml-3 flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${form.women_mode
                              ? "bg-pink-500"
                              : "bg-gray-300 dark:bg-gray-600"
                            }`}
                          aria-label="Toggle Women Safe Mode"
                        >
                          <span
                            className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${form.women_mode ? "translate-x-5" : "translate-x-0"
                              }`}
                          />
                        </button>
                      </div>
                      {form.women_mode && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-pink-600 dark:text-pink-400 font-medium">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Women Safe Mode Enabled — You're protected
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                id="signup-submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all hover:scale-[1.02] disabled:opacity-60 disabled:scale-100 mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating Account…
                  </span>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/signin")}
                className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}