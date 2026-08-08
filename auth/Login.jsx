// auth/Login.jsx
// Updated for Puter.js authentication

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../src/context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, signInWithGoogle } = useAuth();

  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthError("");

    try {
      await login();
      navigate("/dashboard");
    } catch (err) {
      setAuthError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setAuthError("");

    try {
      await signInWithGoogle();
      // OAuth redirects, so no navigate needed
    } catch (err) {
      setAuthError(err.message || "Google login failed.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: '#F5F0E8', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-black tracking-widest text-[#1A1A1A]" style={{ letterSpacing: '0.15em' }}>
            DIGITALLY<span className="text-[#C9A84C]">DEFINED</span>
          </h1>
          <p className="mt-2 text-xs text-[#525252] tracking-widest uppercase font-bold">
            Faceless Digital Real Estate
          </p>
        </div>

        <div className="bg-white border-2 border-[#1A1A1A] p-8" style={{ borderRadius: '0', boxShadow: 'none' }}>
          <h2 className="text-xl font-black text-[#1A1A1A] mb-1 uppercase tracking-wider">Welcome back</h2>
          <p className="text-sm text-[#525252] mb-6 font-medium">Sign in to your dashboard.</p>

          {authError && (
            <div className="mb-4 border-2 border-[#8B1A0A] px-4 py-3 text-sm text-[#8B1A0A] font-bold uppercase tracking-wide">
              {authError}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-[#1A1A1A] mb-2">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                className="w-full border-2 border-[#1A1A1A] px-4 py-3 text-[#1A1A1A] outline-none"
                style={{ borderRadius: '0', background: '#FFFFFF' }}
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-[#1A1A1A] mb-2">
                Password
              </label>
              <input
                name="password"
                type="password"
                className="w-full border-2 border-[#1A1A1A] px-4 py-3 text-[#1A1A1A] outline-none"
                style={{ borderRadius: '0', background: '#FFFFFF' }}
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C9A84C] text-[#1A1A1A] py-3 font-black uppercase tracking-widest text-sm border-2 border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors"
              style={{ borderRadius: '0' }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white border-2 border-[#1A1A1A] py-3 font-black uppercase tracking-widest text-sm text-[#1A1A1A] hover:bg-[#F5F0E8] transition-colors"
              style={{ borderRadius: '0' }}
            >
              Continue with Google
            </button>
          </div>

          <p className="text-center text-sm text-[#525252] mt-6 font-medium">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#C9A84C] font-black uppercase tracking-wider">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
