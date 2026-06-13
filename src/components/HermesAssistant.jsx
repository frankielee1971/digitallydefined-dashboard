import { useState } from "react";

export default function HermesAssistant() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  async function sendMessage() {
    const response = await fetch("/api/hermes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_DASHBOARD_API_KEY
      },
      body: JSON.stringify({ message: input })
    });

    const data = await response.json();

    setMessages(prev => [
      ...prev,
      { role: "user", text: input },
      { role: "hermes", text: data.reply }
    ]);

    setInput("");
  }

  return (
    <div className="hermes-assistant">
      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={m.role}>
            {m.text}
          </div>
        ))}
      </div>

      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Ask Hermes…"
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
