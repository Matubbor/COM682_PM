import { useEffect, useState } from "react";
import { LogOut, ShieldCheck, UserPlus } from "lucide-react";

interface StoredUser {
  fullName: string;
  email: string;
  password: string;
}

const USERS_KEY = "tripcloud_users";
const CURRENT_USER_KEY = "tripcloud_current_user";

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]") as StoredUser[];
  } catch {
    return [];
  }
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function LoginSignupPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);

    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const resetFeedback = () => {
    setMessage("");
    setError("");
  };

  const clearForm = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const validateCommonFields = () => {
    if (!email.trim() || !password.trim()) {
      return "Email and password are required.";
    }

    if (!isValidEmail(email)) {
      return "Please enter a valid email address.";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    return "";
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetFeedback();

    const commonError = validateCommonFields();

    if (commonError) {
      setError(commonError);
      return;
    }

    const users = getUsers();

    if (mode === "signup") {
      if (!fullName.trim()) {
        setError("Full name is required.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Confirm password must match password.");
        return;
      }

      if (users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
        setError("An account with this email already exists.");
        return;
      }

      const newUser = {
        fullName: fullName.trim(),
        email: email.trim(),
        password,
      };

      localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
      setCurrentUser(newUser);
      setMessage("Account created successfully. You are now logged in.");
      clearForm();
      return;
    }

    const foundUser = users.find(
      (user) =>
        user.email.toLowerCase() === email.toLowerCase() &&
        user.password === password
    );

    if (!foundUser) {
      setError("Invalid email or password.");
      return;
    }

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(foundUser));
    setCurrentUser(foundUser);
    setMessage("Logged in successfully.");
    clearForm();
  };

  const handleLogout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setCurrentUser(null);
    setMessage("You have been logged out.");
    setError("");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white border-2 border-gray-300 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gray-900 text-white px-8 py-8">
            <p className="text-sm uppercase tracking-[0.25em] text-blue-200 mb-2">
              Secure prototype access
            </p>
            <h1 className="text-3xl font-bold">Login / Sign Up</h1>
            <p className="text-gray-300 mt-2">
              Create a simple local account to personalize your TripCloud uploads.
            </p>
          </div>

          <div className="p-8">
            {currentUser ? (
              <div className="border-2 border-green-200 bg-green-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {currentUser.fullName}
                    </h2>
                    <p className="text-gray-600">{currentUser.email}</p>
                  </div>
                </div>
                {message && <p className="text-green-700 font-medium mb-4">{message}</p>}
                <button
                  onClick={handleLogout}
                  className="px-5 py-3 bg-gray-900 text-white font-semibold rounded border-2 border-black hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 border-2 border-gray-300 rounded-lg overflow-hidden mb-6">
                  <button
                    onClick={() => {
                      setMode("login");
                      resetFeedback();
                    }}
                    className={`py-3 font-semibold ${
                      mode === "login"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setMode("signup");
                      resetFeedback();
                    }}
                    className={`py-3 font-semibold ${
                      mode === "signup"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {mode === "signup" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        placeholder="Your full name"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      placeholder="At least 6 characters"
                    />
                  </div>

                  {mode === "signup" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        placeholder="Repeat your password"
                      />
                    </div>
                  )}

                  {error && (
                    <p className="bg-red-50 border-2 border-red-200 text-red-700 rounded p-3">
                      {error}
                    </p>
                  )}

                  {message && (
                    <p className="bg-green-50 border-2 border-green-200 text-green-700 rounded p-3">
                      {message}
                    </p>
                  )}

                  <button className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded border-2 border-blue-700 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    {mode === "login" ? "Login" : "Create Account"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
