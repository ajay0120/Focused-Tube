import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

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
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-xl shadow-2xl">
        <Navbar />
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            {view === "login"
              ? "Welcome Back"
              : view === "forgot-email"
                ? "Forgot Password"
                : "Reset Password"}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {view === "login"
              ? "Sign in to your account"
              : view === "forgot-email"
                ? "Enter your email to receive a reset code"
                : "Enter the OTP and your new password"}
          </p>
        </div>

        {message && (
          <div className="p-3 bg-blue-900/50 text-blue-200 text-sm rounded-lg text-center border border-blue-800">
            {message}
          </div>
        )}

        {auth?.error && (
          <div className="text-red-500 text-sm text-center">{auth.error}</div>
        )}

        {view === "login" && (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-white transition duration-200"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-white transition duration-200"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="flex justify-end mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setView("forgot-email");
                      setMessage(null);
                    }}
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 transform hover:scale-[1.02] cursor-pointer"
              >
                Sign in
              </button>
            </div>
          </form>
        )}

        {view === "forgot-email" && (
          <form className="mt-8 space-y-6" onSubmit={handleForgotEmailSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="reset-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="reset-email"
                  name="reset-email"
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-white transition duration-200"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 transform hover:scale-[1.02] cursor-pointer"
              >
                Send Reset Code
              </button>
              <button
                type="button"
                onClick={() => {
                  setView("login");
                  setMessage(null);
                }}
                className="w-full flex justify-center py-3 px-4 border border-gray-600 text-sm font-medium rounded-lg text-gray-300 hover:bg-gray-700 focus:outline-none transition duration-300"
              >
                Back to Login
              </button>
            </div>
          </form>
        )}

        {view === "forgot-reset" && (
          <form className="mt-8 space-y-6" onSubmit={handleResetSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="otp" className="sr-only">
                  OTP Code
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-white transition duration-200"
                  placeholder="Enter OTP Code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="new-password" className="sr-only">
                  New Password
                </label>
                <input
                  id="new-password"
                  name="new-password"
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-white transition duration-200"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 transform hover:scale-[1.02] cursor-pointer"
              >
                Reset Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setView("login");
                  setMessage(null);
                }}
                className="w-full flex justify-center py-3 px-4 border border-gray-600 text-sm font-medium rounded-lg text-gray-300 hover:bg-gray-700 focus:outline-none transition duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {view === "login" && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <GoogleLoginButton onSuccess={auth?.googleLogin} />
            </div>

            <div className="text-center text-sm text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
              >
                Sign up
              </Link>
            </div>
          </>
        )}
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
