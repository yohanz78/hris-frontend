const DEFAULT_API_BASE_URL = 'http://localhost:3000/api/v1';

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL
).replace(/\/$/, '');

export async function requestJson(path, options = {}) {
  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Accept: 'application/json',
      ...(!isFormData && options.body
        ? { 'Content-Type': 'application/json' }
        : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  let payload;

  try {
    payload = await response.json();
  } catch {
    throw new Error('The server returned an invalid JSON response.');
  }

  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.error || 'Unable to load HRIS data.');
  }

  return payload?.data ?? null;
}
