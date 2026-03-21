import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ArrowRight, KeyRound, Lock, Mail, Sparkles } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Forgot Password States
  const [view, setView] = useState<"login" | "forgot-email" | "forgot-reset">(
    "login",
  );
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const auth = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await auth?.login(email, password);
    } catch (error) {
      console.error(error);
    }
  };

  const handleForgotEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      await auth?.forgotPassword(email);
      setView("forgot-reset");
      setMessage("OTP sent to your email.");
    } catch (error) {
      console.error(error);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      await auth?.resetPassword(email, otp, newPassword);
      setMessage("Password reset successful. Please login.");
      setView("login");
      // Clear sensitive fields
      setOtp("");
      setNewPassword("");
      setPassword("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07111f] text-white">
      <Navbar />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-6rem] top-10 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl animate-float-slow" />
        <div className="absolute right-[-4rem] top-28 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl animate-float-medium" />
        <div className="absolute bottom-[-8rem] left-1/3 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-4 pb-10 pt-24 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="hidden lg:block animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              Stay Focused
            </div>
            <h1 className="mt-6 max-w-xl text-5xl font-black tracking-tight text-white">
              Your calm, curated YouTube workspace.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
              Sign in to get distraction-aware search, personalized
              recommendations, and a feed that reflects what you actually want
              to watch.
            </p>
            <div className="mt-8 grid max-w-xl gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-sm text-slate-400">Smarter Search</p>
                <p className="mt-2 text-white">
                  Filter out topics that break your focus.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-sm text-slate-400">Personal Feed</p>
                <p className="mt-2 text-white">
                  Learn more from the content you actually care about.
                </p>
              </div>
            </div>
          </div>

          <div className="animate-fade-in-up rounded-[30px] border border-white/10 bg-slate-900/85 p-6 shadow-2xl shadow-black/30 backdrop-blur sm:p-8">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-blue-500/25">
                {view === "login" ? (
                  <Lock className="h-6 w-6 text-white" />
                ) : view === "forgot-email" ? (
                  <Mail className="h-6 w-6 text-white" />
                ) : (
                  <KeyRound className="h-6 w-6 text-white" />
                )}
              </div>
              <h2 className="text-3xl font-black tracking-tight text-white">
                {view === "login"
                  ? "Welcome Back"
                  : view === "forgot-email"
                    ? "Forgot Password"
                    : "Reset Password"}
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                {view === "login"
                  ? "Sign in to continue your focused browsing flow."
                  : view === "forgot-email"
                    ? "Enter your email and we'll send a reset code."
                    : "Enter the OTP and choose a new password."}
              </p>
            </div>

            {message && (
              <div className="mt-6 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-3 text-center text-sm text-blue-100 animate-fade-in">
                {message}
              </div>
            )}

            {auth?.error && (
              <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-500/10 p-3 text-center text-sm text-red-200 animate-fade-in">
                {auth.error}
              </div>
            )}

            {view === "login" && (
              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm text-slate-300">
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="mb-2 block text-sm text-slate-300">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="mt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setView("forgot-email");
                          setMessage(null);
                        }}
                        className="text-sm text-cyan-300 transition hover:text-cyan-200"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 px-4 py-3.5 text-sm font-semibold text-white transition hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25"
                >
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}

            {view === "forgot-email" && (
              <form className="mt-8 space-y-5" onSubmit={handleForgotEmailSubmit}>
                <div>
                  <label htmlFor="reset-email" className="mb-2 block text-sm text-slate-300">
                    Email address
                  </label>
                  <input
                    id="reset-email"
                    name="reset-email"
                    type="email"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 px-4 py-3.5 text-sm font-semibold text-white transition hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25"
                  >
                    Send Reset Code
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setView("login");
                      setMessage(null);
                    }}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            )}

            {view === "forgot-reset" && (
              <form className="mt-8 space-y-5" onSubmit={handleResetSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="otp" className="mb-2 block text-sm text-slate-300">
                      OTP Code
                    </label>
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      required
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
                      placeholder="Enter OTP Code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="new-password" className="mb-2 block text-sm text-slate-300">
                      New Password
                    </label>
                    <input
                      id="new-password"
                      name="new-password"
                      type="password"
                      required
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 px-4 py-3.5 text-sm font-semibold text-white transition hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25"
                  >
                    Reset Password
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setView("login");
                      setMessage(null);
                    }}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {view === "login" && (
              <>
                <div className="relative mt-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-slate-900 px-3 text-slate-400">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <GoogleLoginButton onSuccess={auth?.googleLogin} />
                </div>

                <div className="text-center text-sm text-slate-400">
                  Don&apos;t have an account?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-cyan-300 transition hover:text-cyan-200"
                  >
                    Sign up
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

import { GoogleLogin } from "@react-oauth/google";

const GoogleLoginButton = ({
  onSuccess,
}: {
  onSuccess?: (token: string) => void;
}) => {
  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          if (credentialResponse.credential) {
            onSuccess?.(credentialResponse.credential);
          }
        }}
        onError={() => {
          console.log("Login Failed");
        }}
        theme="filled_black"
        shape="pill"
        size="large"
        width="100%"
      />
    </div>
  );
};
