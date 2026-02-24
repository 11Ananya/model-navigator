import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Lazy singleton — only initializes when first accessed.
// This means the server starts fine even without Supabase env vars set (Phase 1/2).
let _adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!_adminClient) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error(
        "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set to use database features"
      );
    }
    _adminClient = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return _adminClient;
}

// Keep supabaseAdmin as a named export for routes that use it directly
// (analytics, configs) — they'll throw a clear error if Supabase isn't configured
export { getSupabaseAdmin as supabaseAdmin };

// Creates a user-scoped client that respects RLS policies
export function createSupabaseClientWithToken(token: string) {
  const url = process.env.SUPABASE_URL!;
  const anonKey = process.env.SUPABASE_ANON_KEY!;
  return createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}
