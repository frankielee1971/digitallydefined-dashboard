async function subscribe(e) {
  e.preventDefault();

  const res = await fetch("/api/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (res.ok) {
    setStatus("success");
  } else {
    setStatus("error");
  }
}
