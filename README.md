# Turkish → French Live Translator — Vercel edition

A browser-based, face-to-face translator. It displays Turkish source speech and French translation side by side, retaining transcript history in the current browser tab.

## What changed for Vercel

- The Express server has been removed.
- `api/session.js` is now a Vercel Node.js Function that creates short-lived OpenAI client secrets.
- `api/health.js` is a simple health endpoint.
- `middleware.js` optionally protects the entire site and API with HTTP Basic Authentication.
- Vercel builds the Vite frontend into `dist` and serves it from its CDN.

The long-lived OpenAI API key remains server-side. The browser receives only a short-lived client secret.

## Deploy to Vercel (recommended: GitHub import)

1. Extract this ZIP.
2. Create a **private** repository on GitHub and upload the project files. Do not upload `.env` or any API key.
3. Sign in at https://vercel.com/ and choose **Add New → Project**.
4. Import the GitHub repository.
5. Vercel should detect Vite. Confirm:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
6. Before or after the first deployment, open **Project → Settings → Environment Variables** and add:
   - `OPENAI_API_KEY` — your OpenAI API key
   - `SITE_USERNAME` — optional login name
   - `SITE_PASSWORD` — optional strong password
7. Apply the variables to Production (and Preview too, if you want password protection there), save, then redeploy.
8. Open the HTTPS `*.vercel.app` address, enter the Basic Auth credentials if configured, allow microphone access, and press **Start live translation**.

The Basic Auth middleware protects the page, static assets and API routes when both `SITE_USERNAME` and `SITE_PASSWORD` are configured. If you leave either unset, the site is public. Use a long, unique password. This simple gate is suitable for a small private tool, not a public multi-user product.

## Run locally

Requirements: Node.js 20+.

1. Open PowerShell in the extracted folder.
2. Install packages:

   ```powershell
   npm install
   ```

3. Install/use the Vercel CLI through the project script:

   ```powershell
   npm run dev
   ```

   The first run may ask to install the Vercel CLI. If prompted, approve it. Alternatively, install it globally with `npm install -g vercel` and run `vercel dev`.

4. For local serverless function environment variables, create a `.env` file with `OPENAI_API_KEY`, `SITE_USERNAME`, and `SITE_PASSWORD`, or pull the project's development environment using `vercel env pull .env.development.local` after linking the project with `vercel link`.

5. Open the local URL printed by Vercel, usually http://localhost:3000.

To build the frontend only, run `npm run build`. The Vercel deployment runs the API function automatically; do not use `vite preview` as a replacement for the Vercel Functions runtime.

## How to use

- Put the device between the speakers, ideally in a quiet room.
- Press **Start live translation**.
- Speak Turkish in natural, reasonably short turns.
- Read the Turkish original and French translation in the two panels.
- Press **Stop conversation** to stop microphone streaming while keeping the displayed history.
- Press **Clear history** to erase the transcript.

History is held in browser memory only. It is not stored in a database and disappears when the tab is reloaded or closed.

## Security and privacy

- Keep `OPENAI_API_KEY` in Vercel Environment Variables. Never put it in frontend code or a `VITE_` variable.
- Audio is streamed to OpenAI to perform transcription and translation. Tell conversation participants and obtain any consent required by your local rules.
- Use HTTPS in production; microphone access requires a secure context.
- The optional Basic Auth middleware is a lightweight private-site gate. For broader use, implement proper user accounts, abuse prevention and privacy controls.
- Do not rely on the in-memory browser history as a permanent record.

## Cost and accuracy

API usage is billed separately from a ChatGPT subscription. Check current Realtime Translation pricing:
https://developers.openai.com/api/docs/guides/realtime-translation

The model can mishear names, numbers, addresses, accents, overlapping speech or speech in noisy rooms. Do not use it as the sole interpreter for legal, medical, financial or safety-critical conversations.

## Troubleshooting

- **No microphone permission:** use Chrome or Edge and allow microphone access for the HTTPS site.
- **401 authentication prompt:** use the `SITE_USERNAME` and `SITE_PASSWORD` values from Vercel.
- **Missing OPENAI_API_KEY:** add it under Vercel Environment Variables and redeploy.
- **Session creation fails:** check the API key, API billing, model access and Vercel Function logs.
- **No transcript appears:** check microphone input, reduce background noise and have one person speak at a time.
