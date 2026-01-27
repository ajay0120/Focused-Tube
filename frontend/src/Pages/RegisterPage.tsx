import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // OTP State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);

  const auth = useContext(AuthContext);

  // Timer effect
  React.useEffect(() => {
    if (!showOtpModal) return;

    setCanResend(false);
    setTimer(120);

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showOtpModal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await auth?.register(name, username, email, password);
      setShowOtpModal(true);
      setTimer(120);
      setCanResend(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return;
    try {
      await auth?.verifyOtp(email, otp);
    } catch (error) {
      console.error(error);
    }
  };

  const handleResendOtp = async () => {
    try {
      await auth?.resendOtp(email);
      setTimer(120);
      setCanResend(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white relative">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-xl shadow-2xl">
        <Navbar />
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-400">Join FocusedTube today</p>
        </div>

        {!showOtpModal ? (
          <>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="sr-only">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-white transition duration-200"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="username" className="sr-only">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-white transition duration-200"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
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
                </div>
              </div>

              {auth?.error && (
                <div className="text-red-500 text-sm text-center">
                  {auth.error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 transform hover:scale-[1.02] cursor-pointer"
                >
                  Sign up
                </button>
              </div>
            </form>

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
              {/* Assumes we have GoogleLogin import. I need to add it */}
              <GoogleLoginButton onSuccess={auth?.googleLogin} />
            </div>

            <div className="text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
              >
                Sign in
              </Link>
            </div>
          </>
        ) : (
          <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg leading-6 font-medium text-white">
                Verify your email
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                We sent a verification code to <strong>{email}</strong>.
                <br />
                Enter it below to confirm your account.
              </p>
            </div>

            <div>
              <label htmlFor="otp" className="sr-only">
                Verification Code
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-white text-center tracking-[0.5em] text-2xl transition duration-200"
                placeholder="000000"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
              />
            </div>

            {auth?.error && (
              <div className="text-red-500 text-sm text-center">
                {auth.error}
              </div>
            )}

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={otp.length !== 6}
              className={`w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${otp.length === 6 ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700" : "bg-gray-600 cursor-not-allowed"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300 transform hover:scale-[1.02] cursor-pointer`}
            >
              Verify Email
            </button>

            <div className="text-center text-sm">
              <p className="text-gray-400">
                {timer > 0 ? (
                  <>
                    Resend code in{" "}
                    <span className="text-white font-mono">
                      {Math.floor(timer / 60)}:
                      {String(timer % 60).padStart(2, "0")}
                    </span>
                  </>
                ) : (
                  <button
                    onClick={handleResendOtp}
                    className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Resend Code
                  </button>
                )}
              </p>
              <button
                onClick={() => setShowOtpModal(false)}
                className="mt-4 text-xs text-gray-500 hover:text-gray-400"
              >
                Change email
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Start Quick Component for Google Button (should be moved or imported really, but inline for now to save tool calls)
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

export default RegisterPage;
