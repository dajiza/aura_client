import { getSupabaseClient } from '@/lib/supabase';

import { createClient as createPropelAuthClient } from '@propelauth/javascript';

export const authClient = createPropelAuthClient({
    // The base URL where your authentication pages are hosted. You can find this under the Frontend Integration section for your project.
    authUrl: import.meta.env.VITE_APP_PROPELAUTH_URL,
    // If true, periodically refresh the access token in the background. This helps ensure you always have a valid token ready to go. Default true.
    enableBackgroundTokenRefresh: true,
});

export let authInfo = null;
export let supabase = null;

/**
 * Resolve PropelAuth + Supabase without blocking the first module evaluation.
 * Call this once from main.js before mounting routes that need auth.
 */
export async function bootSupabase() {
    authInfo = await Promise.race([
        authClient.getAuthenticationInfoOrNull(),
        new Promise((resolve) => setTimeout(() => resolve(null), 4000)),
    ]);

    try {
        if (authInfo) {
            supabase = await getSupabaseClient(authInfo);
        }
    } catch (error) {
        console.error('Failed to create supabase client', error);
        supabase = null;
    }

    localStorage.setItem('token', JSON.stringify(authInfo));
    return { authInfo, supabase };
}

export default { authInfo, authClient, supabase, bootSupabase };
