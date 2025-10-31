// Supabase Edge Function (Deno) - elevenlabs-tts
// Receives POST { text, voice? } and proxies to ElevenLabs TTS.
// Configure secret ELEVENLABS_API_KEY (use `supabase secrets set` or CLI envs).

export default async (req: Request) => {
  try {
    if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

    const body = await req.json().catch(() => ({}));
    const text: string = body?.text || '';
    const voice: string = body?.voice || 'alloy'; // default voice id — replace as needed

    if (!text || !text.trim()) return new Response('Missing text', { status: 400 });

  // Use secret injected into runtime (set this with supabase CLI or your deployment env)
  // Use globalThis cast to avoid TypeScript errors in local tooling that doesn't have Deno types.
  const ELEVEN_API_KEY = (globalThis as any).Deno?.env?.get?.('ELEVENLABS_API_KEY');
    if (!ELEVEN_API_KEY) return new Response('Server misconfigured: missing ELEVENLABS_API_KEY', { status: 500 });

    // ElevenLabs TTS endpoint (subject to their API surface). This implementation
    // posts JSON and requests an audio response. Adjust path/headers as ElevenLabs docs require.
    const elevenUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voice}`;

    const elevenResp = await fetch(elevenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // ElevenLabs uses `xi-api-key` header in many examples; check their docs for your account
        'xi-api-key': ELEVEN_API_KEY,
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({ text }),
    });

    if (!elevenResp.ok) {
      const errText = await elevenResp.text().catch(() => 'Unknown error from ElevenLabs');
      return new Response(errText, { status: 502 });
    }

    const contentType = elevenResp.headers.get('content-type') || 'audio/mpeg';
    const buf = await elevenResp.arrayBuffer();
    return new Response(buf, {
      status: 200,
      headers: { 'Content-Type': contentType },
    });
  } catch (err) {
    console.error('elevenlabs-tts error', err);
    return new Response(String((err as any)?.message || String(err)), { status: 500 });
  }
};
