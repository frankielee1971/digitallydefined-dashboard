import { useEffect, useState } from "react";
import AutomationsList from "../components/AutomationsList";
import AutomationsEmptyState from "../components/AutomationsEmptyState";

export default function AutomationsPage() {
  const [automations, setAutomations] = useState([]);

  useEffect(() => {
    const API_URL =
      import.meta.env.VITE_HERMES_GATEWAY_URL ||
      "https://digitallydefined-os-backend.vercel.app/api/hermes";

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_DASHBOARD_API_KEY || ""
      },
      body: JSON.stringify({
        message: "automation.list",
        context: {},
        conversation: [],
      }),
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
