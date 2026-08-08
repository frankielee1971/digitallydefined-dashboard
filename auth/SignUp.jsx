// auth/SignUp.jsx
// Updated for Puter.js authentication

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../src/context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Puter.js handles signup through its auth flow
      await signInWithGoogle();
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      console.error("Signup failed:", err);
    } finally {
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
          <h2 className="text-xl font-black text-[#1A1A1A] mb-1 uppercase tracking-wider">
            Create your account
          </h2>
          <p className="text-sm text-[#525252] mb-6 font-medium">
            Start owning your digital presence.
          </p>

          {success && (
            <div className="mb-4 border-2 border-[#15803d] px-4 py-3 text-sm text-[#15803d] font-bold uppercase tracking-wide">
              Account created! Redirecting…
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-[#1A1A1A] mb-2">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                className="w-full border-2 border-[#1A1A1A] px-4 py-3 text-[#1A1A1A] outline-none"
                style={{ borderRadius: '0', background: '#FFFFFF' }}
                readOnly
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
                readOnly
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-[#1A1A1A] mb-2">
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                className="w-full border-2 border-[#1A1A1A] px-4 py-3 text-[#1A1A1A] outline-none"
                style={{ borderRadius: '0', background: '#FFFFFF' }}
                readOnly
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C9A84C] text-[#1A1A1A] py-3 font-black uppercase tracking-widest text-sm border-2 border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors"
              style={{ borderRadius: '0' }}
            >
              {loading ? "Creating account..." : "Create Account with Puter"}
            </button>
          </form>

          <p className="text-center text-sm text-[#525252] mt-6 font-medium">
            Already have an account?{" "}
            <Link to="/login" className="text-[#C9A84C] font-black uppercase tracking-wider">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
