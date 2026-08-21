import React, { useState } from "react";
import { callSupabaseEdge } from "../lib/supabase-edge";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);

  async function subscribe(e) {
    e.preventDefault();

    try {
      await callSupabaseEdge("subscribe", {
        email,
        source: "dashboard",
      });
      setStatus("success");
      setEmail("");
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
