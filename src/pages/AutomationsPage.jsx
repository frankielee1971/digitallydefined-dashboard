import { useEffect, useState } from "react";
import AutomationsList from "../components/AutomationsList";
import AutomationsEmptyState from "../components/AutomationsEmptyState";

export default function AutomationsPage() {
  const [automations, setAutomations] = useState([]);

  useEffect(() => {
    const url = `${import.meta.env.VITE_BACKEND_URL}?action=automation.list`;

    fetch(url)
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
