/**
 * Thin client for the CMS API in `backend/`. Deliberately dependency-free —
 * the admin area is small enough that a fetch wrapper beats a data library.
 */

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

const TOKEN_KEY = 'investcare.cms.token';

export function getToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

/**
 * Identical GETs that are already in flight share one request.
 *
 * React StrictMode runs every effect twice in development, so each screen would
 * otherwise fetch its data twice. The entry is dropped as soon as the request
 * settles — this de-duplicates concurrent calls, it does not cache, so a reload
 * after saving always hits the network.
 */
const inFlight = new Map();

/**
 * Calls the API and unwraps the `{ success, data | error }` envelope.
 * Throws an Error carrying the server's message so callers can display it.
 */
export async function apiFetch(path, { method = 'GET', body, auth = true } = {}) {
  if (method === 'GET') {
    const key = `${auth ? 'auth' : 'anon'}:${path}`;
    const existing = inFlight.get(key);
    if (existing) return existing;

    const request = requestJson(path, { method, body, auth }).finally(() => inFlight.delete(key));
    inFlight.set(key, request);
    return request;
  }

  return requestJson(path, { method, body, auth });
}

async function requestJson(path, { method, body, auth }) {
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    // fetch only rejects on a transport failure — the API is down or blocked.
    throw new Error('Cannot reach the server. Is the backend running?');
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.error?.message ?? `Request failed (${response.status})`);
  }

  return payload.data ?? payload;
}
