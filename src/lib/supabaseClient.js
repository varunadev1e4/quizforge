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
