export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Vercel is missing the OPENAI_API_KEY environment variable." });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/realtime/translations/client_secrets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        expires_after: { anchor: "created_at", seconds: 600 },
        session: {
          model: "gpt-realtime-translate",
          audio: {
            input: {
              transcription: { model: "gpt-realtime-whisper" },
              noise_reduction: { type: "far_field", strength: 0.8 }
            },
            output: { language: "fr" }
          }
        }
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("OpenAI client-secret error:", data);
      return res.status(response.status).json({
        error: data?.error?.message || "Could not create a translation session."
      });
    }

    res.setHeader("Cache-Control", "no-store, max-age=0");
    return res.status(200).json({
      client_secret: data.value,
      expires_at: data.expires_at
    });
  } catch (error) {
    console.error("Session creation failed:", error);
    return res.status(500).json({ error: "Could not connect to the translation service." });
  }
}
