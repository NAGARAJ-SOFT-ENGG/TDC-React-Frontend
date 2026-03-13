import { apiCall } from '@/utils/api'; // Assuming @/utils alias
import { AuthModel } from '@/models';   // Assuming @/models alias

const AUTH_BASE_URL = '/rideradar'; // Or your specific base for auth if different

/**
 * Logs in a user.
 * @param {string} userName - The user's username.
 * @param {string} password - The user's password.
 * @returns {Promise<any>} - A promise that resolves with the API response data.
 */
export const loginUser = async (userName, password) => {
    const authCredentials = new AuthModel(userName, password);
    return apiCall({
        method: 'POST',
        url: `${AUTH_BASE_URL}/login`,
        data: authCredentials.toJSON(),
    });
};