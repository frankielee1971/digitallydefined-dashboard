 import { useState } from "react";

export default function ComingSoon() {
  const [form, setForm] = useState({
    prospect_name: "",
    email: ""
  });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus("Submitting...");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setForm({ prospect_name: "", email: "" });
      setStatus("You're on the waitlist.");
    } catch (err) {
      setStatus(err.message || "Submission failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        backgroundColor: "#FFFCF9",
        minHeight: "100vh",
        padding: "80px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start"
      }}
    >
      <h1
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "48px",
          fontWeight: 700,
          textTransform: "uppercase",
          color: "#000",
          textAlign: "center",
          marginBottom: "16px",
          letterSpacing: "-0.5px"
        }}
      >
        Coming Soon
      </h1>

      <p
        style={{
          fontFamily: "DM Sans, sans-serif",
          fontSize: "20px",
          color: "#2E2E2E",
          textAlign: "center",
          maxWidth: "640px",
          marginBottom: "48px",
          lineHeight: "1.4"
        }}
      >
        The next evolution of the DigitallyDefined OS is almost here.  
        Your Command Center. Your data. Your power.
      </p>

      <img
        src="/coming-soon.png"
        alt="DigitallyDefined Dashboard Preview"
        style={{
          width: "100%",
          maxWidth: "900px",
          border: "2px solid #000",
          display: "block"
        }}
      />

      {/* WAITLIST FORM */}
      <form
        onSubmit={handleSubmit}
        style={{
          marginTop: "48px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px"
        }}
      >
        <input
          type="text"
          name="prospect_name"
          placeholder="Your name"
          value={form.prospect_name}
          onChange={handleChange}
          required
          style={{
            padding: "14px 20px",
            fontSize: "16px",
            border: "2px solid #000",
            width: "280px",
            fontFamily: "Inter, sans-serif"
          }}
        />

        <input
          type="email"
          name="email"
          placeholder="Your email"
          value={form.email}
         onChange={handleChange}
          required
          style={{
            padding: "14px 20px",
            fontSize: "16px",
            border: "2px solid #000",
            width: "280px",
            fontFamily: "Inter, sans-serif"
          }}
        />

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    marginTop: "16px",
                    padding: "14px 32px",
                    fontSize: "16px",
                    fontWeight: 600,
                    backgroundColor: "#000",
                    color: "#FFF",
                    border: "none",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.6 : 1
                  }}
                >
                  {loading ? "Submitting..." : "Join Waitlist"}
                </button>
              </form>
            </main>
          );
        }