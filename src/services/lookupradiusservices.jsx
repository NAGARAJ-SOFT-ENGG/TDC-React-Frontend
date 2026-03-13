import { apiCall } from '@utils/api'; // Import the centralized apiCall function

/**
 * Fetches the list of operator lookup radii.
 * @returns {Promise<Array>} A promise that resolves to an array of lookup radius objects.
 * @throws {Error} If the API call fails or returns an unexpected structure.
 */
export const fetchLookupRadiusList = async () => {
  // Use apiCall for the GET request
  const responseData = await apiCall({ method: 'get', url: '/rideradar/operator/lookupradius' });
  if (responseData && responseData.data && Array.isArray(responseData.data.operator_lookup_radius)) {
    return responseData.data.operator_lookup_radius;
  }
  throw new Error('Invalid response structure for lookup radius list.');
};

/**
 * Creates a new lookup radius configuration.
 * @param {object} lookupRadiusData - The lookup radius data for creation.
 * @returns {Promise<object>} A promise that resolves with the API response.
 * @throws {Error} If the API call fails.
 */
export const createLookupRadius = async (lookupRadiusData) => {
  const responseData = await apiCall({
    method: 'post',
    url: '/rideradar/operator/lookupradiuscreate',
    data: lookupRadiusData,
  });
  return responseData;
};

/**
 * Updates an existing lookup radius configuration.
 * @param {object} lookupRadiusData - The lookup radius data for update. operator_mobile is the identifier.
 * @returns {Promise<object>} A promise that resolves with the API response.
 * @throws {Error} If the API call fails.
 */
export const updateLookupRadius = async (lookupRadiusData) => {
  const responseData = await apiCall({
    method: 'put', // Assuming PUT for updates
    url: `/rideradar/operator/lookupradiusupdate`, // The API path might need operator_mobile, e.g., /lookupradiusupdate/${lookupRadiusData.operator_mobile}
    data: lookupRadiusData,
  });
  return responseData;
};

/**
 * Updates the activation status of a lookup radius.
 * @param {object} statusData - Data including operator_mobile and active_flag (0 for deactivate).
 * @returns {Promise<object>} A promise that resolves with the API response.
 * @throws {Error} If the API call fails.
 */
export const updateLookupRadiusStatus = async (statusData) => {
  const responseData = await apiCall({
    method: 'put', // Or 'post'
    url: `/rideradar/operator/lookupradiusstatus`,
    data: statusData,
  });
  return responseData;
};