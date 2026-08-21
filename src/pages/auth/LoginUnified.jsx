import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import FadeInSection from "../../components/FadeInSection";
import { ddBrand, ddSection, ddContainer, ddGrid } from "../../brand/dd-brand-tokens";

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
    <div
      style={{
        minHeight: "100vh",
        background: ddBrand.tokens.background,
        color: ddBrand.tokens.text,
        fontFamily: ddBrand.typography.body.fontFamily,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: ddSection.padding,
      }}
    >
      <div style={{ ...ddContainer, width: "100%", maxWidth: "420px" }}>
        <FadeInSection>
          <div
            style={{
              ...ddBrand.card,
              padding: "clamp(24px, 5vw, 40px)",
              display: "grid",
              gap: "22px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <h1
                style={{
                  ...ddBrand.typography.headingBase,
                  fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
                  margin: 0,
                }}
              >
                DIGITALLY<span style={{ color: ddBrand.tokens.orange }}>DEFINED</span>
              </h1>
              <p
                style={{
                  ...ddBrand.typography.eyebrow,
                  color: ddBrand.tokens.textMuted,
                  marginTop: "10px",
                }}
              >
                Faceless Digital Real Estate
              </p>
            </div>

            <div>
              <h2
                style={{
                  ...ddBrand.typography.headingBase,
                  fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
                  margin: 0,
                }}
              >
                Welcome back
              </h2>
              <p
                style={{
                  ...ddBrand.typography.muted,
                  marginTop: "8px",
                }}
              >
                Sign in to your dashboard.
              </p>
            </div>

            {authError && (
              <div
                style={{
                  ...ddBrand.card,
                  borderColor: ddBrand.tokens.danger,
                  padding: "12px 14px",
                  color: ddBrand.tokens.danger,
                  ...ddBrand.typography.eyebrow,
                  fontSize: "0.72rem",
                }}
              >
                {authError}
              </div>
            )}

            <form onSubmit={handleEmailLogin} style={{ display: "grid", gap: "14px" }}>
              <div style={{ display: "grid", gap: "6px" }}>
                <label
                  style={{
                    ...ddBrand.typography.eyebrow,
                    color: ddBrand.tokens.text,
                    fontSize: "0.72rem",
                  }}
                >
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="dd-input"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div style={{ display: "grid", gap: "6px" }}>
                <label
                  style={{
                    ...ddBrand.typography.eyebrow,
                    color: ddBrand.tokens.text,
                    fontSize: "0.72rem",
                  }}
                >
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="dd-input"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="dd-button dd-button--primary"
                style={{
                  transition: "transform 0.2s ease, filter 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.filter = "brightness(0.96)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.filter = "brightness(1)";
                }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div style={{ display: "grid", gap: "10px" }}>
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="dd-button dd-button--secondary"
                style={{
                  transition: "transform 0.2s ease, filter 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.filter = "brightness(0.98)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.filter = "brightness(1)";
                }}
              >
                Continue with Google
              </button>
            </div>

            <p
              style={{
                textAlign: "center",
                ...ddBrand.typography.muted,
                margin: 0,
              }}
            >
              Don't have an account?{" "}
              <Link
                to="/signup"
                style={{
                  color: ddBrand.tokens.orange,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Create one
              </Link>
            </p>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}
