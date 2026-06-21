import { useEffect, useState } from "react";
import AutomationsList from "../components/AutomationsList";
import AutomationsEmptyState from "../components/AutomationsEmptyState";

const HERMES_URL =
  import.meta.env.VITE_HERMES_BACKEND_URL ||
  import.meta.env.VITE_HERMES_GATEWAY_URL ||
  import.meta.env.VITE_DASHBOARD_API_URL ||
  import.meta.env.VITE_CHAT_API_URL ||
  "/api/hermes";

export default function AutomationsPage() {
  const [automations, setAutomations] = useState([]);

  useEffect(() => {
    const API_KEY = import.meta.env.VITE_DASHBOARD_API_KEY || "";
    if (!API_KEY) {
      console.error("Dashboard API key is missing. Please check your configuration.");
      return;
    }

    const loadAutomations = async () => {
      try {
        const response = await fetch(HERMES_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
          },
          body: JSON.stringify({ action: "automation.list" }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to load automations (${response.status})`);
        }

        const data = await response.json();
        if (data?.automations) {
          setAutomations(data.automations);
        }
      } catch (err) {
        console.error("Automation fetch error:", err);
      }
    };

    loadAutomations();
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
