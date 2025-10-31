Quick TTS proxy (hackathon/demo)
================================

Purpose
-------
This folder contains a minimal Express proxy that forwards text-to-speech requests to ElevenLabs and returns an MP3/audio bytes. It's intentionally simple for quick demos.

Files to note
- `server.js` — the Express server (POST /tts)
- `.env.example` — copy to `.env` and set your `ELEVENLABS_API_KEY`
- `package.json` — includes `npm start` to run the server

Run locally (PowerShell)
------------------------
1. From the repo root or this folder:

   cd backend/middleware

2. If you haven't already, copy `.env.example` to `.env` and add your key:

   cp .env.example .env
   # then edit .env (e.g. notepad .env) and paste your key

3. Install dependencies and start the server:

   npm install
   npm start

4. Keep your frontend running (Expo web). The frontend calls:

   POST http://127.0.0.1:3001/tts

Quick test (curl)
-----------------
You can test via curl (saves to out.mp3):

  curl -X POST http://127.0.0.1:3001/tts -H "Content-Type: application/json" -d '{"text":"Hello from ElevenLabs"}' --output out.mp3

Then play `out.mp3` with your preferred audio player.
