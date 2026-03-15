const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

function getHeaders(extra = {}) {
  return {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
    'Content-Type': 'application/json',
    ...extra,
  };
}

async function parseError(res, fallback) {
  let payload;
  try {
    payload = await res.json();
  } catch {
    // no-op
  }
  return payload?.msg || payload?.error_description || payload?.message || fallback;
}

async function authRequest(path, payload = {}, token) {
  if (!isSupabaseConfigured) {
    return { ok: false, error: 'Supabase environment variables are missing.' };
  }

  const res = await fetch(`${supabaseUrl}/auth/v1/${path}`, {
    method: 'POST',
    headers: getHeaders(token ? { Authorization: `Bearer ${token}` } : {}),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    return { ok: false, error: await parseError(res, 'Authentication request failed.') };
  }

  const data = await res.json();
  return { ok: true, data };
}

export async function supabaseSignIn(email, password) {
  const result = await authRequest('token?grant_type=password', { email, password });
  if (!result.ok) return { ok: false, error: result.error };

  return {
    ok: true,
    user: result.data?.user || null,
    accessToken: result.data?.access_token || null,
    refreshToken: result.data?.refresh_token || null,
  };
}

export async function supabaseSignUp(email, password) {
  const result = await authRequest('signup', { email, password });
  if (!result.ok) return { ok: false, error: result.error };

  return {
    ok: true,
    user: result.data?.user || null,
    accessToken: result.data?.access_token || null,
    refreshToken: result.data?.refresh_token || null,
  };
}

export async function supabaseSignOut() {
  const accessToken = window.localStorage.getItem('quizforge.sb.accessToken');
  if (!accessToken) return { ok: true };

  const result = await authRequest('logout', {}, accessToken);
  window.localStorage.removeItem('quizforge.sb.accessToken');
  return result.ok ? { ok: true } : { ok: false, error: result.error };
}

export async function supabaseGetSession() {
  const accessToken = window.localStorage.getItem('quizforge.sb.accessToken');
  if (!accessToken || !isSupabaseConfigured) return null;

  const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
    method: 'GET',
    headers: getHeaders({ Authorization: `Bearer ${accessToken}` }),
  });

  if (!res.ok) {
    window.localStorage.removeItem('quizforge.sb.accessToken');
    return null;
  }

  const user = await res.json();
  return { user };
}

export function persistSupabaseSession(accessToken) {
  if (accessToken) {
    window.localStorage.setItem('quizforge.sb.accessToken', accessToken);
  }
}

export async function supabaseSelect(path) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase environment variables are missing.');
  }

  const res = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!res.ok) {
    const message = await res.text();
    const error = new Error(message || 'Supabase select failed');
    error.status = res.status;
    throw error;
  }

  return res.json();
}

export async function supabaseUpsert(table, row) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase environment variables are missing.');
  }

  const res = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
    method: 'POST',
    headers: getHeaders({
      Prefer: 'resolution=merge-duplicates,return=minimal',
    }),
    body: JSON.stringify(row),
  });

  if (!res.ok) {
    const message = await res.text();
    const error = new Error(message || 'Supabase upsert failed');
    error.status = res.status;
    throw error;
  }
}
