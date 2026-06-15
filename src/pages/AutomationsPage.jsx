import { useEffect, useState } from "react";
import AutomationsList from "../components/AutomationsList";
import AutomationsEmptyState from "../components/AutomationsEmptyState";

export default function AutomationsPage() {
  const [automations, setAutomations] = useState([]);

  useEffect(() => {
    const API_KEY = import.meta.env.VITE_DASHBOARD_API_KEY || "";
    if (!API_KEY) {
      alert("Dashboard API key is missing. Please check your configuration.");
      return;
    }

    fetch("/api/hermes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY
      },
      body: JSON.stringify({ action: "automation.list" })
    })
      .then(res => res.json())
      .then(data => {
        if (data?.automations) {
          setAutomations(data.automations);
        }
      })
      .catch(err => console.error("Automation fetch error:", err));
  }, []);

  return (
    <div>
      {automations.length === 0 ? (
        <AutomationsEmptyState />
      ) : (
        <AutomationsList items={automations} />
      )}
    </div>
  );
}
