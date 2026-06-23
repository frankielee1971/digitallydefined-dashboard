import React, { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);

  async function subscribe(e) {
    e.preventDefault();
    // Use current origin for frontend serverless function
    const API_URL = `${window.location.origin}/api/subscribe`;
    
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error("Newsletter subscription error:", err);
      setStatus("error");
    }
  }

  return (
    <form onSubmit={subscribe} className="dd-signup-form">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="dd-signup-input"
        required
      />
      <button type="submit" className="dd-signup-btn">Subscribe</button>
      {status === "success" && <p>You're in! Welcome to the community 🎉</p>}
      {status === "error" && <p>Something went wrong. Please try again.</p>}
    </form>
  );
}
