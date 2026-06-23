import { useEffect, useState } from "react";
import AutomationsList from "../components/AutomationsList";
import AutomationsEmptyState from "../components/AutomationsEmptyState";

export default function AutomationsPage() {
  const [automations, setAutomations] = useState([]);

  useEffect(() => {
    const API_URL =
      import.meta.env.VITE_HERMES_GATEWAY_URL ||
      import.meta.env.VITE_BACKEND_URL ||
      "/api/hermes";
    const url = `${API_URL}?action=automation.list`;

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_DASHBOARD_API_KEY
      }
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
