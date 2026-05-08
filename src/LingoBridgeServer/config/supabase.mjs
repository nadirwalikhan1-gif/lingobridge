import { createClient } from '@supabase/supabase-js';
import { logger } from './logger.mjs';

const SUPABASE_URL         = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in environment');
}

/**
 * Admin client — uses service-role key, bypasses Row Level Security.
 * Never expose this to the browser.
 */
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken:  false,
    persistSession:    false,
    detectSessionInUrl: false,
  },
});

/**
 * Verify a Supabase JWT and return the decoded user, or null on failure.
 * Used by authHttp.mjs and authSocket.mjs.
 *
 * @param  {string} token  — raw Bearer token from the client
 * @returns {object|null}  — Supabase user object, or null if invalid
 */
export async function verifySupabaseToken(token) {
  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data?.user) {
      logger.debug({ error }, 'Token verification failed');
      return null;
    }
    return data.user;
  } catch (err) {
    logger.error({ err }, 'Unexpected error during token verification');
    return null;
  }
}
