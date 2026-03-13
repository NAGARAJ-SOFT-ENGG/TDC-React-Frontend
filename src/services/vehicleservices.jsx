import { apiCall } from '@utils';

 const VEHICLE_BASE = '/rideradar/vehicle';

/**
 * Fetches the list of vehicles associated with a specific operator.
 * @param {string} operatorMobile - The mobile number of the operator.
 * @returns {Promise<object>} - A promise that resolves with the API response object,
 * which includes a 'vehicles' array and pagination info.
 */
export const fetchVehiclesList = async (operatorMobile) => {
  if (!operatorMobile) {
    console.error("Operator mobile number is required to fetch associated vehicles.");
    // Return a structure consistent with the expected API response on error or missing param
    return { total: 0, limit: 0, offset: 0, vehicles: [] };
  }
  const responseData = await apiCall({
    method: 'GET',
    url: `${VEHICLE_BASE}/vehicleassociated/${operatorMobile}`,
  });
  return responseData || { total: 0, limit: 0, offset: 0, vehicles: [] }; // Ensure a consistent return structure
};

/**
 * Onboards a new vehicle.
 * @param {FormData} formDataPayload - The FormData object prepared by VehicleModel.
 * @returns {Promise<any>} - The API response.
 */
export const onboardVehicle = async (formDataPayload) => {
  return apiCall({
    method: 'POST',
    url: `${VEHICLE_BASE}/onboard`,
    data: formDataPayload,
  });
};
/**
 * Updates an existing vehicle's details.
 * @param {FormData} formDataPayload - The FormData object prepared by VehicleModel.
 * It must include 'vehicle_number' for identification.
 * @returns {Promise<any>} - The API response.
 */
export const updateVehicleDetails = async (formDataPayload) => {
  return apiCall({
    method: 'PUT', // Or 'POST', depending on your API design for updates
    url: `${VEHICLE_BASE}/profileupdate`,
    data: formDataPayload,
  });
};

/**
 * Updates the verification status of a specific vehicle.
 * @param {object} payload - The payload for updating vehicle verification status.
 * @param {string} payload.operator_mobile - The mobile number of the operator.
 * @param {string} payload.vehicle_number - The vehicle number.
 * @param {string} payload.verification_status - The new verification status string.
 * @param {string} payload.notes - Remarks for the status change.
 * @returns {Promise<any>} - The API response.
 */

export const updateVehicleVerificationStatus = async (payload) => {
  if (!payload.operator_mobile || !payload.vehicle_number || !payload.verification_status) {
    throw new Error("Operator mobile, vehicle number, and verification status are required.");
  }
  return apiCall({
    method: 'PUT', // Or 'POST' based on your API design
    url: `${VEHICLE_BASE}/verificationstatus`,
    data: payload,
  });
};

/**
 * Updates the active status of a specific vehicle.
 * @param {object} payload - The payload for updating vehicle active status.
 * @param {string} payload.vehicle_number - The vehicle number.
 * @param {string} payload.operator_mobile - The mobile number of the operator.
 * @param {number} payload.active_flag - The new active flag (1 for Active, 2 for Suspend).
 * @param {string} payload.notes - Remarks for the status change.
 * @returns {Promise<any>} - The API response.
 */
export const updateVehicleActiveStatus = async (payload) => {
  if (!payload.vehicle_number || !payload.operator_mobile || payload.active_flag === undefined) {
    throw new Error("Vehicle number, operator mobile, and active flag are required.");
  }
  // Assuming your API expects active_flag as a number, but the payload example shows 0.
  // Ensure the value sent matches API expectations (0, 1, 2, etc.)
  const apiPayload = {
      ...payload,
      active_flag: Number(payload.active_flag) // Ensure it's a number if API expects number
  };
  return apiCall({
    method: 'PUT', // Or 'POST' based on your API design
    url: `${VEHICLE_BASE}/statusupdate`,
    data: apiPayload,
  });
};

/**
 * Fetches a list of unassigned drivers for a given operator.
 * @param {string} operatorMobile - The mobile number of the operator.
 * @returns {Promise<any>} - The API response containing the list of unassigned drivers.
 */
export const fetchUnassignedDrivers = async (operatorMobile) => {
  return apiCall({
    method: 'GET', // Assuming GET for a list, adjust if POST is strictly required by API
    url: `/rideradar/vehicle/unassigneddriverlist`,
    params:{operator_mobile: operatorMobile} // operator_mobile as query string
  });
};

/**
 * Assigns a driver to a vehicle.
 * @param {object} payload - The payload object, typically from VehicleDriverAssignModel.
 * @returns {Promise<any>} - The API response.
 */
export const assignDriverToVehicle = async (payload) => {
  return apiCall({
    method: 'POST',
    url: `${VEHICLE_BASE}/driverassign`,
    data: payload,
  });
};

/**
 * Reassigns a driver for a vehicle.
 * @param {object} payload - The payload object, typically from VehicleDriverReassignModel.
 * @returns {Promise<any>} - The API response.
 */
export const reassignDriverToVehicle = async (payload) => {
  return apiCall({
    method: 'PUT',
    url: `${VEHICLE_BASE}/driverreassign`,
    data: payload,
  });
};
