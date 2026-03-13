import { apiCall } from '@utils/api'; // Import the centralized apiCall function

/**
 * Fetches the list of vehicle types.
 * @returns {Promise<Array>} A promise that resolves to an array of vehicle type objects.
 * @throws {Error} If the API call fails or returns an unexpected structure.
 */
export const fetchVehicleTypeList = async () => {
  // Use apiCall for the GET request
  const responseData = await apiCall({ method: 'get', url: '/rideradar/vehicle/vehicletypelist/' });
  if (responseData && Array.isArray(responseData.vehicle_types)) {
    return responseData.vehicle_types;
  }
  throw new Error('Invalid response structure for vehicle type list.');
};

/**
 * Creates a new vehicle type.
 * @param {object} vehicleTypeData - The vehicle type data for creation.
 * @returns {Promise<object>} A promise that resolves with the API response.
 * @throws {Error} If the API call fails.
 */
export const createVehicleType = async (vehicleTypeData) => {
  const responseData = await apiCall({
    method: 'post',
    url: '/rideradar/vehicle/vehicletypeonboard',
    data: vehicleTypeData,
  });
  return responseData;
};

/**
 * Updates an existing vehicle type.
 * @param {object} vehicleTypeData - The vehicle type data for update.
 *                                   For deactivation, this should include vehicle_type and active_flag: 0.
 * @returns {Promise<object>} A promise that resolves with the API response.
 * @throws {Error} If the API call fails.
 */
export const updateVehicleType = async (vehicleTypeData) => {
  const responseData = await apiCall({
    method: 'put', // Assuming PUT for updates
    url: `/rideradar/vehicle/vehicletypeupdate`, // The API path might need vehicle_type, e.g., /vehicletypeupdate/${vehicleTypeData.vehicle_type}
    data: vehicleTypeData,
  });
  return responseData;
};

/**
 * Suspends (deactivates) a vehicle type.
 * @param {object} suspendData - Data containing vehicle_type and active_flag (should be 0).
 * @returns {Promise<object>} A promise that resolves with the API response.
 * @throws {Error} If the API call fails.
 */
export const suspendVehicleType = async (suspendData) => {
  const responseData = await apiCall({
    method: 'put', // Or 'post' if your API uses that for status updates
    url: '/rideradar/vehicle/vehicletypesuspend',
    data: suspendData,
  });
  return responseData;
};