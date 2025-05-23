import { getSupabaseClient } from '@/lib/supabase';

import { createClient as createPropelAuthClient } from '@propelauth/javascript';
export const authClient = createPropelAuthClient({
    // The base URL where your authentication pages are hosted. You can find this under the Frontend Integration section for your project.
    authUrl: import.meta.env.VITE_APP_PROPELAUTH_URL,
    // If true, periodically refresh the access token in the background. This helps ensure you always have a valid token ready to go. Default true.
    enableBackgroundTokenRefresh: true,
});
export const authInfo = await authClient.getAuthenticationInfoOrNull();
if (!authInfo) {
    // authClient.redirectToLoginPage();
    // router.push('/login');
}
export const supabase = await getSupabaseClient(authInfo);
localStorage.setItem('token', JSON.stringify(authInfo));

export default { authInfo, authClient, supabase };
