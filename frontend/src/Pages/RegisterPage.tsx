import React, { useContext, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";
import { ArrowRight, MailCheck, ShieldCheck, Sparkles } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);

  const auth = useContext(AuthContext);

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
    <div className="relative min-h-screen overflow-hidden bg-[#07111f] text-white">
      <Navbar />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-6rem] top-16 h-64 w-64 rounded-full bg-fuchsia-500/15 blur-3xl animate-float-slow" />
        <div className="absolute right-[-5rem] top-24 h-72 w-72 rounded-full bg-purple-500/15 blur-3xl animate-float-medium" />
        <div className="absolute bottom-[-8rem] left-1/4 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-4 pb-10 pt-24 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="hidden lg:block animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-purple-200">
              <Sparkles className="h-3.5 w-3.5" />
              Start Strong
            </div>
            <h1 className="mt-6 max-w-xl text-5xl font-black tracking-tight text-white">
              Build a feed that works for your goals.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
              Create your account to unlock personalized recommendations,
              distraction filtering, and study-friendly search from day one.
            </p>
            <div className="mt-8 space-y-4 max-w-xl">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-sm text-slate-400">Personalized Feed</p>
                <p className="mt-2 text-white">
                  Interests shape what you see. Disinterests shape what gets
                  filtered out.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-sm text-slate-400">Safer Focus Sessions</p>
                <p className="mt-2 text-white">
                  Switch between study and relax mode depending on how strict
                  you want the experience to be.
                </p>
              </div>
            </div>
          </div>

          <div className="animate-fade-in-up rounded-[30px] border border-white/10 bg-slate-900/85 p-6 shadow-2xl shadow-black/30 backdrop-blur sm:p-8">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 via-purple-500 to-violet-600 shadow-lg shadow-purple-500/25">
                {showOtpModal ? (
                  <MailCheck className="h-6 w-6 text-white" />
                ) : (
                  <ShieldCheck className="h-6 w-6 text-white" />
                )}
              </div>
              <h2 className="text-3xl font-black tracking-tight text-white">
                {showOtpModal ? "Verify Your Email" : "Create Account"}
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                {showOtpModal
                  ? "One quick verification step and your account is ready."
                  : "Join FocusedTube and start shaping a better feed."}
              </p>
            </div>

            {!showOtpModal ? (
              <>
                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="mb-2 block text-sm text-slate-300">
                        Full Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-purple-400/60 focus:ring-2 focus:ring-purple-400/20"
                        placeholder="Your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="username" className="mb-2 block text-sm text-slate-300">
                        Username
                      </label>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-purple-400/60 focus:ring-2 focus:ring-purple-400/20"
                        placeholder="Choose a username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-2 block text-sm text-slate-300">
                        Email address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-purple-400/60 focus:ring-2 focus:ring-purple-400/20"
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
                        className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-purple-400/60 focus:ring-2 focus:ring-purple-400/20"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  {auth?.error && (
                    <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-3 text-center text-sm text-red-200 animate-fade-in">
                      {auth.error}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-violet-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/25"
                  >
                    Sign up
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>

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
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-purple-300 transition hover:text-purple-200"
                  >
                    Sign in
                  </Link>
                </div>
              </>
            ) : (
              <div className="mt-8 space-y-6 animate-fade-in-up">
                <div className="rounded-3xl border border-emerald-400/15 bg-emerald-500/10 p-4 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-200">
                    <MailCheck className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    Verify your email
                  </h3>
                  <p className="mt-2 text-sm text-slate-300">
                    We sent a verification code to <strong>{email}</strong>.
                    Enter it below to confirm your account.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="otp"
                    className="mb-2 block text-center text-sm text-slate-300"
                  >
                    Verification Code
                  </label>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-center text-2xl tracking-[0.5em] text-white outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
                    placeholder="000000"
                    maxLength={6}
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/[^0-9]/g, ""))
                    }
                  />
                </div>

                {auth?.error && (
                  <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-3 text-center text-sm text-red-200 animate-fade-in">
                    {auth.error}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={otp.length !== 6}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-semibold text-white transition ${
                    otp.length === 6
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/20"
                      : "bg-white/10 text-slate-400"
                  }`}
                >
                  Verify Email
                  <ArrowRight className="h-4 w-4" />
                </button>

                <div className="text-center text-sm">
                  <p className="text-slate-400">
                    {!canResend ? (
                      <>
                        Resend code in{" "}
                        <span className="font-mono text-white">
                          {Math.floor(timer / 60)}:
                          {String(timer % 60).padStart(2, "0")}
                        </span>
                      </>
                    ) : (
                      "You can request a new code now."
                    )}
                  </p>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={!canResend}
                    className={`mt-3 font-medium transition ${
                      canResend
                        ? "text-purple-300 hover:text-purple-200"
                        : "text-slate-500"
                    }`}
                  >
                    Resend Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowOtpModal(false)}
                    className="mt-4 block w-full text-xs text-slate-500 transition hover:text-slate-400"
                  >
                    Change email
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

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
