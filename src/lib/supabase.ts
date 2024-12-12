import { AuthenticationInfo } from '@propelauth/javascript';
import { SupabaseClient } from '@supabase/supabase-js';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function getSupabaseClient(info: AuthenticationInfo): Promise<SupabaseClient<any, 'public', any>> {
    if (!info) {
        return null;
    }
    const propelAuthToken = info.accessToken;

    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/exchange-token`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${propelAuthToken}`,
            'Content-type': 'application/json',
        },
    });

    const { token: supabaseToken } = await response.json();
    return createSupabaseClient(import.meta.env.VITE_APP_SUPABASE_URL, import.meta.env.VITE_APP_SUPABASE_ANON_KEY, {
        global: {
            headers: {
                Authorization: `Bearer ${supabaseToken}`,
            },
        },
        auth: {
            persistSession: false,
        },
    });
}
