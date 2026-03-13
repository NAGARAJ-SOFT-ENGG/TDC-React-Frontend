import { apiCall } from '@utils/api'; // Import the centralized apiCall function

/**
 * Fetches the list of users for a given operator.
 * @param {string} operatorMobile - The mobile number of the operator.
 * @returns {Promise<Array>} A promise that resolves to an array of user objects.
 * @throws {Error} If the API call fails or returns an unexpected structure.
 */
export const fetchUserList = async (operatorMobile) => {
  if (!operatorMobile) {
    throw new Error("Operator mobile number is required to fetch users.");
  }
  // Use apiCall for the GET request
  const responseData = await apiCall({ method: 'get', url: `/rideradar/authentication/userlist/${operatorMobile}` });
  if (responseData && Array.isArray(responseData.users)) {
    return responseData.users;
  }
  throw new Error('Invalid response structure for user list.');
};

/**
 * Fetches the list of user roles.
 * @returns {Promise<Array>} A promise that resolves to an array of role objects.
 * @throws {Error} If the API call fails or returns an unexpected structure.
 */
export const fetchRoleList = async () => {
  const responseData = await apiCall({ method: 'get', url: '/rideradar/authentication/rolelist/' });
  if (responseData && Array.isArray(responseData.role)) {
    return responseData.role;
  }
  throw new Error('Invalid response structure for role list.');
};

/**
 * Creates a new user.
 * @param {object} userData - The user data for creation.
 * @returns {Promise<object>} A promise that resolves with the API response.
 * @throws {Error} If the API call fails.
 */
export const createUser = async (userData) => {
  const responseData = await apiCall({
    method: 'post',
    url: '/rideradar/authentication/usercreate',
    data: userData,
  });
  return responseData; // Assuming the API returns some confirmation or the created user object
};

/**
 * Updates an existing user.
 * @param {object} userData - The user data for update. user_name is typically used as an identifier.
 * @returns {Promise<object>} A promise that resolves with the API response.
 * @throws {Error} If the API call fails.
 */
export const updateUser = async (userData) => {
  const responseData = await apiCall({
    method: 'put', // Assuming PUT for updates, adjust if your API uses POST or PATCH
    url: `/rideradar/authentication/userupdate`, // The API path might need the username, e.g., /userupdate/${userData.user_name}
    data: userData,
  });
  return responseData;
};

/**
 * Updates the activation status of a user.
 * @param {object} statusData - Data including user_name, operator_mobile, and active_flag (0 for deactivate).
 * @returns {Promise<object>} A promise that resolves with the API response.
 * @throws {Error} If the API call fails.
 */
export const updateUserActivationStatus = async (statusData) => {
  // The API payload requires name, user_name, operator_mobile, active_flag.
  // Ensure 'name' is included if the API strictly requires it for this endpoint.
  // If 'name' isn't strictly needed for status update, it can be omitted if API allows.
  const responseData = await apiCall({
    method: 'put', // Or 'post' if your API uses that for status updates
    url: `/rideradar/authentication/activatestatus`,
    data: statusData,
  });
  return responseData;
};