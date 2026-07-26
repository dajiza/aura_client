import axios from 'axios';

const apiBase = () => import.meta.env.VITE_APP_API_URL;

/**
 * Loads the clinic's active intake consent templates from the EMR API.
 * Seeds built-in presets server-side on first call for a clinic (same as EMR).
 */
export async function fetchIntakeConsentTemplates(hid) {
    const response = await axios({
        url: `${apiBase()}/api/consent-templates`,
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        data: { hid, intakeOnly: true },
    });
    return response.data?.res?.templates || [];
}

/**
 * Records a signing event for one or more templates. The EMR snapshots body text
 * from the database — do not send template bodies from the client.
 */
export async function createPatientConsents({ hid, pid, templateIds, signature, source = 'intake' }) {
    const response = await axios({
        url: `${apiBase()}/api/consent-create`,
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        data: { hid, pid, templateIds, signature, source },
        validateStatus: () => true,
    });
    if (response.status >= 400) {
        const err = new Error(response.data?.message || 'Failed to save consent forms');
        err.response = response;
        throw err;
    }
    return response.data?.res;
}
