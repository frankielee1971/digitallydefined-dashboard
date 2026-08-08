// src/lib/puter.js
// Puter.js client instance for the DigitallyDefined Dashboard

let puterInstance = null;

export async function getPuter() {
  if (puterInstance) {
    return puterInstance;
  }

  // Load Puter.js from CDN if not already loaded
  if (typeof window.puter === 'undefined') {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://js.puter.com/v2/';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // IMPORTANT: Do NOT call puter.ui.onLoad() - this triggers Puter's generic auth UI
  // We want to use our custom login/signup pages instead

  puterInstance = window.puter;
  return puterInstance;
}

export default { getPuter };
