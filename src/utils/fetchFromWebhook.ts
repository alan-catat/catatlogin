export async function fetchFromWebhook(envKey: string, body: any = {}) {
  const url = process.env[envKey];
  if (!url) return { success: false, error: `Missing ${envKey}` };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return { success: false, error: text };
    }
  } catch (err) {
    console.error("Fetch error:", err);
    return { success: false, error: "Failed to connect to server." };
  }
}
