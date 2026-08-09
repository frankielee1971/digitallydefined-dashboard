import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, signInWithGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthError("");

    try {
      await login(email, password);
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
    } catch (err) {
      setAuthError(err.message || "Google login failed.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: '#FFFCF9', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-black tracking-widest text-[#111111]" style={{ letterSpacing: '0.15em' }}>
            DIGITALLY<span className="text-[#F18B25]">DEFINED</span>
          </h1>
          <p className="mt-2 text-xs text-[#5F5F5F] tracking-widest uppercase font-bold">
            Faceless Digital Real Estate
          </p>
        </div>

        <div className="bg-white border-2 border-[#111111] p-8" style={{ borderRadius: '0', boxShadow: 'none' }}>
          <h2 className="text-xl font-black text-[#111111] mb-1 uppercase tracking-wider">Welcome back</h2>
          <p className="text-sm text-[#5F5F5F] mb-6 font-medium">Sign in to your dashboard.</p>

          {authError && (
            <div className="mb-4 border-2 border-[#8B1A0A] px-4 py-3 text-sm text-[#8B1A0A] font-bold uppercase tracking-wide">
              {authError}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-[#111111] mb-2">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-[#111111] px-4 py-3 text-[#111111] outline-none"
                style={{ borderRadius: '0', background: '#FFFFFF' }}
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-[#111111] mb-2">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-[#111111] px-4 py-3 text-[#111111] outline-none"
                style={{ borderRadius: '0', background: '#FFFFFF' }}
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F18B25] text-[#111111] py-3 font-black uppercase tracking-widest text-sm border-2 border-[#111111] hover:bg-[#111111] hover:text-white transition-colors"
              style={{ borderRadius: '0' }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white border-2 border-[#111111] py-3 font-black uppercase tracking-widest text-sm text-[#111111] hover:bg-[#FFFCF9] transition-colors"
              style={{ borderRadius: '0' }}
            >
              Continue with Google
            </button>
          </div>

          <p className="text-center text-sm text-[#5F5F5F] mt-6 font-medium">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#F18B25] font-black uppercase tracking-wider">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}