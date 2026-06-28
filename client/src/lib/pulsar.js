/**
 * Pulsar analytics loader for the SkillSphere LMS client.
 *
 * Configure via Vercel env vars (Vite requires the VITE_ prefix):
 *   VITE_PULSAR_SRC       e.g. https://<your-pulsar-host>/p.js
 *   VITE_PULSAR_ENDPOINT  e.g. https://<your-pulsar-host>/api/v1/events
 *   VITE_PULSAR_KEY       this project's API key
 *
 * If the env vars are absent, it no-ops (so local dev without Pulsar still runs).
 */
const SRC = import.meta.env.VITE_PULSAR_SRC;
const ENDPOINT = import.meta.env.VITE_PULSAR_ENDPOINT;
const KEY = import.meta.env.VITE_PULSAR_KEY;

let injected = false;

/** Load the tracker once (call on app start). Auto-tracks page views, SPA routes, etc. */
export function initPulsar() {
  if (injected || typeof window === "undefined") return;
  if (!SRC || !ENDPOINT || !KEY) {
    console.warn("[Pulsar] analytics not configured (set VITE_PULSAR_* env vars)");
    return;
  }
  injected = true;
  // Queue stub: identify()/track() calls made before p.js loads are buffered + replayed.
  window.pulsar =
    window.pulsar ||
    function () {
      (window.pulsar.q = window.pulsar.q || []).push(arguments);
    };
  const s = document.createElement("script");
  s.src = SRC;
  s.async = true;
  s.setAttribute("data-key", KEY);
  s.setAttribute("data-endpoint", ENDPOINT);
  document.head.appendChild(s);
}

/** Tie the current visitor to the logged-in user so their whole journey stitches. */
export function identifyUser(user) {
  if (!user || typeof window === "undefined" || !window.pulsar) return;
  const email = user.userEmail || user.email || "";
  const traits = {
    name: user.userName || "",
    role: user.role || "",
    userId: user._id || "",
  };
  if (!email && !traits.name) return;
  // Works whether p.js has loaded (object API) or not yet (queue-stub function).
  if (typeof window.pulsar === "function") window.pulsar("identify", email, traits);
  else if (typeof window.pulsar.identify === "function") window.pulsar.identify(email, traits);
}

/** Optional: track a custom action, e.g. trackEvent('lesson_completed', { courseId }). */
export function trackEvent(name, props) {
  if (typeof window === "undefined" || !window.pulsar) return;
  if (typeof window.pulsar === "function") window.pulsar("track", name, props);
  else if (typeof window.pulsar.track === "function") window.pulsar.track(name, props);
}
