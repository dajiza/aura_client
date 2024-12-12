import { AuthenticationInfo } from '@propelauth/javascript';
import { SupabaseClient } from '@supabase/supabase-js';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function createUser(info: AuthenticationInfo): Promise<SupabaseClient<any, 'public', any>> {
    const propelAuthToken = info.accessToken;

    console.log('🚀 ~ createUser ~ import.meta.env.VITE_APP_API_URL:', import.meta.env.VITE_APP_API_URL);
    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/create-user`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${propelAuthToken}`,
            'Content-type': 'application/json',
        },
    });

    const { res } = await response.json();
    return res;
}
