import { apiCall } from '@utils';

const DRIVER_BASE = '/rideradar/driver';

/**
 * Onboards a new driver.
 * @param {FormData} formDataPayload - The FormData object prepared by DriverModel.
 * @returns {Promise<any>} - The API response.
 */
export const onboardDriver = async (formDataPayload) => {
  return apiCall({
    method: 'POST',
    url: `${DRIVER_BASE}/onboarding`, // Assuming this is your endpoint
    data: formDataPayload,
  });
};

/**
 * Updates an existing driver's details.
 * @param {FormData} formDataPayload - The FormData object with driver details.
 * @returns {Promise<any>} - The API response.
 */
export const updateDriverDetails = async (formDataPayload) => {
  return apiCall({
    method: 'PUT', // Or 'PUT' if your API uses PUT for updates
    url: `${DRIVER_BASE}/update`, // Corrected from PUT to POST if API expects POST
    data: formDataPayload,
  });
};

/**
 * Fetches the detailed profile for a specific driver.
 * @param {string} driverMobile - The mobile number of the driver.
 * @returns {Promise<object|null>} - A promise that resolves with the driver's profile data or null.
 */
export const fetchDriverProfile = async (driverMobile) => {
  if (!driverMobile) {
    console.error("Driver mobile number is required to fetch profile.");
    return null;
  }
  const responseData = await apiCall({
    method: 'GET',
    url: `${DRIVER_BASE}/driverprofile/${driverMobile}`,
  });
  return responseData || null;
};

/**
 * Updates a driver's verification status.
 * @param {object} payload - The payload object, typically from DriverVerificationUpdateModel.
 * @returns {Promise<any>} - The API response.
 */
export const updateDriverVerificationStatus = async (payload) => {
  return apiCall({
    method: 'PUT', // Corrected from PUT to POST if API expects POST
    url: `${DRIVER_BASE}/statusupdate`, // Assuming this endpoint handles verification_status
    data: payload,
  });
};

/**
 * Deletes a driver permanently.
 * @param {object} payload - The payload object, typically from DriverDeleteModel.
 * @returns {Promise<any>} - The API response.
 */
export const deleteDriverPermanently = async (payload) => {
  return apiCall({
    method: 'PUT', // Corrected from PUT to POST if API expects POST
    url: `${DRIVER_BASE}/driverdelete`,
    data: payload, // Some DELETE requests might expect data in the body
  });
};

/**
 * Updates a driver's active status (active_flag and notes).
 * @param {object} payload - The payload object, typically from DriverActivationUpdateModel.
 * @returns {Promise<any>} - The API response.
 */
export const updateDriverActiveStatus = async (payload) => {
  return apiCall({
    method: 'PUT', // Or 'POST', ensure this matches your API for /statusupdate
    url: `${DRIVER_BASE}/statusupdate`,
    data: payload,
  });
};

/**
 * Assigns a vehicle to a driver.
 * @param {object} payload - The payload object, typically from DriverVehicleAssignModel.
 * @returns {Promise<any>} - The API response.
 */
export const assignVehicleToDriver = async (payload) => {
  return apiCall({
    method: 'POST', // Assuming POST, adjust if your API uses PUT
    url: `${DRIVER_BASE}/vehicleassign`,
    data: payload,
  });
};

/**
 * Fetches a list of unassigned vehicles for a given operator.
 * @param {string} operatorMobile - The mobile number of the operator.
 * @returns {Promise<any>} - The API response containing the list of unassigned vehicles.
 */
export const fetchUnassignedVehicles = async (operatorMobile) => {
  return apiCall({
    method: 'GET', // As specified, though GET might be more typical for lists
    url: `${DRIVER_BASE}/unassignedvehiclelist`,
    params:{operator_mobile: operatorMobile}
     // operatorMobile as query string
    // If the API expects operatorMobile in the body for a POST request, it would be: data: { operator_mobile: operatorMobile }
  });
};

/**
 * Reassigns a vehicle for a driver (changes from an old vehicle to a new one).
 * @param {object} payload - The payload object, typically from DriverVehicleReassignModel.
 * @returns {Promise<any>} - The API response.
 */
export const reassignVehicleToDriver = async (payload) => {
  return apiCall({
    method: 'PUT', // Assuming POST, adjust if your API uses PUT
    url: `${DRIVER_BASE}/vehiclereassign`,
    data: payload,
  });
};

/**
 * Updates the status (activate/suspend) of a specific driver.
 * @param {string} driverMobile - The mobile number of the driver to update.
 * @param {string} operatorMobile - The mobile number of the operator performing the action.
 * @param {number} activeFlag - The new status flag (1 for active, 2 for suspend).
 * @param {string} notes - Remarks for the status change.
 * @returns {Promise<any>} - The API response.
 */
export const updateDriverStatus = async (driverMobile, operatorMobile, activeFlag, notes) => {
  if (!driverMobile || !operatorMobile || activeFlag === undefined) {
    throw new Error("Driver mobile, operator mobile, and active flag are required for status update.");
  }
  const payload = {
    driver_mobile: driverMobile,
    operator_mobile: operatorMobile,
    active_flag: activeFlag,
    notes: notes || "",
  };
  return apiCall({ method: 'PUT', url: `${DRIVER_BASE}/statusupdate`, data: payload });
};
