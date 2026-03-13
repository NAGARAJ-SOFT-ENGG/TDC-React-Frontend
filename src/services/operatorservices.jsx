import { apiCall } from '@utils';
import { OperatorModel } from '../models/operatormodels.jsx';

const OPERATOR_BASE = '/rideradar/operator';
const VEHICLE_BASE = '/rideradar/vehicle';
const DRIVER_BASE = '/rideradar/driver';

/**
 * Onboards a new operator.
 * @param {object} rawFormData - The raw data from the onboarding form.
 * @returns {Promise<any>} - The API response.
 */
export const onboardOperator = async (rawFormData) => {
  const model = new OperatorModel(rawFormData);
  const formDataPayload = model.toFormData();

  return apiCall({
    method: 'POST',
    url: `${OPERATOR_BASE}/onboarding`,
    data: formDataPayload,
  });
};

/**
 * Fetches the list of operator profiles.
 * @returns {Promise<Array<object>>} - A promise that resolves with an array of operator objects.
 */
export const fetchOperatorList = async () => {
  const responseData = await apiCall({
    method: 'GET',
    url: `${OPERATOR_BASE}/profilelist`,
  });
  return responseData.data || responseData || [];
};

/**
 * Fetches live trips for a specific operator.
 * @param {string} operatorMobile - The mobile number of the operator.
 * @returns {Promise<object>} - A promise that resolves with the live trips data.
 * Expected structure: { trip_sections: [], trip_card_data: {} }
 */
export const fetchLiveTrips = async (operatorMobile) => {
  if (!operatorMobile) {
    return { trip_sections: [], trip_card_data: {} };
  }
  const responseData = await apiCall({
    method: 'GET',
    url: `${OPERATOR_BASE}/livetrips`,
    params: { operator_mobile: operatorMobile },
  });
  return responseData || { trip_sections: [], trip_card_data: {} };
};

/**
 * Fetches the detailed profile for a specific operator.
 * @param {string} operatorMobile - The mobile number of the operator.
 * @returns {Promise<object|null>} - A promise that resolves with the operator's profile data or null.
 */
export const fetchOperatorProfile = async (operatorMobile) => {
  if (!operatorMobile) {
    return null;
  }
  const responseData = await apiCall({
    method: 'GET',
    url: `${OPERATOR_BASE}/operatorprofile/${operatorMobile}`,
    
  });
      
  return responseData || null;
};

/**
 * Fetches the list of drivers associated with a specific operator.
 * @param {string} operatorMobile - The mobile number of the operator.
 * @returns {Promise<Array<object>>} - A promise that resolves with an array of driver objects.
 */
export const fetchAssociatedDrivers = async (operatorMobile) => {
  if (!operatorMobile) {
    return [];
  }
  const responseData = await apiCall({
    method: 'GET',
    url: `${DRIVER_BASE}/driverassociated/${operatorMobile}`,
  });
  if (responseData && Array.isArray(responseData.drivers)) {
    return responseData.drivers;
  }
  return [];
};

/**
 * Fetches the list of vehicles associated with a specific operator.
 * @param {string} operatorMobile - The mobile number of the operator.
 * @returns {Promise<Array<object>>} - A promise that resolves with an array of vehicle objects.
 */
export const fetchAssociatedVehicles = async (operatorMobile) => {
  if (!operatorMobile) {
    return [];
  }
  const responseData = await apiCall({
    method: 'GET',
    url: `${VEHICLE_BASE}/vehicleassociated/${operatorMobile}`,
  });
  return responseData.vehicles || responseData.data || responseData || [];
};

/**
 * Fetches the list of buddies for a specific operator.
 * @param {string} operatorMobile - The mobile number of the operator.
 * @returns {Promise<{buddies: Array<object>, summary: object}>} - A promise that resolves with an object containing buddies list and summary.
 */
export const fetchOperatorBuddyList = async (operatorMobile) => {
  if (!operatorMobile) {
    return { buddies: [], summary: { total_trip_shared_count: 0, total_revenue: 0 } };
  }
  const responseData = await apiCall({
    method: 'GET',
    url: `${OPERATOR_BASE}/buddies/${operatorMobile}`,
  });
  return {
    buddies: responseData?.buddies || [],
    summary: responseData?.summary || { total_trip_shared_count: 0, total_revenue: 0 },
  };
};

/**
 * Updates the activation status of an operator.
 * @param {string} operatorMobile - The mobile number of the operator.
 * @param {number} operatorStatus - The new status for the operator (e.g., 1 for active, 2 for suspend).
 * @param {string} notes - The reason/notes for the status change.
 * @returns {Promise<any>} - The API response.
 */
export const updateOperatorActivationStatus = async (operatorMobile, operatorStatus, notes = "") => {
  if (!operatorMobile) {
    throw new Error("Operator mobile number is required.");
  }

  const payload = OperatorModel.toActivationUpdatePayload(operatorMobile, operatorStatus, notes);

  return apiCall({ method: 'PUT', url: `${OPERATOR_BASE}/activatestatus`, data: payload });
};

/**
 * Updates the verification status of an operator.
 * @param {string} operatorMobile - The mobile number of the operator.
 * @param {string} verificationStatus - The new verification status string.
 * @param {string} notes - The reason/notes for the verification status change.
 *  @param {number} active_flag
 * @returns {Promise<any>} - The API response.
 */
export const updateOperatorVerificationStatus = async (operatorMobile, verificationStatus, notes, active_flag) => {
    if (!operatorMobile) {
        throw new Error("Operator mobile number is required for verification update.");
    }
    if (!verificationStatus) {
        throw new Error("Verification status is required.");
    }

  const payload = OperatorModel.toVerificationUpdatePayload(operatorMobile, verificationStatus, active_flag, notes);

  return apiCall({
    method: 'PUT',
    url: `${OPERATOR_BASE}/verificationstatus`,
    data: payload,
  });
};

/**
 * Updates an existing operator's details.
 * @param {object} updateData - The JSON payload for updating operator details.
 *                               This should be generated by OperatorModel.toUpdateJsonPayload().
 * @returns {Promise<any>} - The API response.
 */
export const updateOperatorDetails = async (updateData) => {
  if (!updateData.Mobile_Number) {
    throw new Error("Operator mobile number (Mobile_Number) is required in the payload for an update.");
  }
  return apiCall({
    method: 'PUT', // Or 'POST' if your API uses that for updates
    url: `${OPERATOR_BASE}/update`, // Endpoint for updating operator
    data: updateData,
  });
};

/**
 * Fetches the list of "MyBuddies" for a specific operator (buddies initiated by the operator).
 * @param {string} operatorMobile - The mobile number of the operator.
 * @returns {Promise<{myBuddies: Array<object>, summary: object}>} - A promise that resolves with an object containing "MyBuddies" list and summary.
 */
export const fetchOperatorMyBuddyList = async (operatorMobile) => {
  if (!operatorMobile) {
    return { myBuddies: [], summary: { total_trip_shared_count: 0, total_revenue: 0 } };
  }
  const responseData = await apiCall({
    method: 'GET',
    url: `${OPERATOR_BASE}/mybuddies/${operatorMobile}`, // Endpoint for "MyBuddies"
  });
  return {
    myBuddies: responseData?.operators || [], // Assuming the list is under 'operators' key
    summary: responseData?.summary || { total_trip_shared_count: 0, total_revenue: 0 },
  };
};

/**
 * Fetches the detailed profile for a specific vehicle.
 * @param {string} vehicleNumber - The vehicle number.
 * @returns {Promise<object|null>} - A promise that resolves with the vehicle's profile data or null.
 */
export const fetchVehicleProfile = async (vehicleNumber) => {
  if (!vehicleNumber) {
    console.error("Vehicle number is required to fetch profile.");
    return null;
  }
  const responseData = await apiCall({
    method: 'GET',
    url: `${VEHICLE_BASE}/vehicleprofile/${vehicleNumber}`,
  });
  return responseData || null; // The response is expected to be { vehicle: { ... } }
};

/**
 * Deletes a specific vehicle.
 * @param {string} operatorMobile - The mobile number of the operator performing the action.
 * @param {string} vehicleNumber - The vehicle number to delete.
 * @returns {Promise<any>} - The API response.
 */
export const deleteVehicle = async (operatorMobile, vehicleNumber) => {
  if (!operatorMobile || !vehicleNumber) {
    throw new Error("Operator mobile and vehicle number are required for deletion.");
  }
  const payload = {
    operator_mobile: operatorMobile,
    vehicle_number: vehicleNumber,
  };
  // Assuming the API uses a DELETE method with a request body or parameters
  return apiCall({ method: 'PUT', url: `${VEHICLE_BASE}/vehicledelete`, data: payload });
};

/**
 * Deletes a specific driver.
 * @param {string} operatorMobile - The mobile number of the operator performing the action.
 * @param {string} driverMobile - The mobile number of the driver to delete.
 * @returns {Promise<any>} - The API response.
 */
export const deleteDriver = async (operatorMobile, driverMobile) => {
  if (!operatorMobile || !driverMobile) {
    throw new Error("Operator mobile and driver mobile are required for deletion.");
  }
  const payload = {
    operator_mobile: operatorMobile,
    driver_mobile: driverMobile,
  };
  // Assuming the API uses a DELETE method with a request body or parameters
  return apiCall({ method: 'PUT', url: `${DRIVER_BASE}/driverdelete`, data: payload });
};

/**
 * Updates the status (active/suspend) of a specific vehicle.
 * @param {object} payload - The payload for updating vehicle status.
 * @param {string} payload.vehicle_number - The vehicle number.
 * @param {string} payload.operator_mobile - The mobile number of the operator.
 * @param {number} payload.active_flag - The new status flag (e.g., 1 for active, 2 for suspend).
 * @param {string} payload.notes - Remarks for the status change.
 * @returns {Promise<any>} - The API response.
 */
export const updateVehicleStatus = async (payload) => {
  if (!payload.vehicle_number || !payload.operator_mobile || payload.active_flag === undefined) {
    throw new Error("Vehicle number, operator mobile, and active flag are required for status update.");
  }
  return apiCall({
    method: 'PUT', // Or 'POST' based on your API design
    url: `${VEHICLE_BASE}/statusupdate`,
    data: payload,
  });
};

/**
 * Links or unlinks a buddy operator and sets their priority.
 * @param {object} payload - The payload for linking/unlinking a buddy.
 * @param {number} payload.buddy_priority - The priority of the buddy.
 * @param {string} payload.operator_mobile - The mobile number of the operator initiating the action.
 * @param {string} [payload.operator_name] - The name of the operator initiating the action (optional, for activated_by).
 * @param {string} payload.buddy_mobile - The mobile number of the buddy operator.
 * @param {number} payload.active_flag - 1 to link, 0 to unlink.
 * @param {string} [payload.activated_by] - Who activated/deactivated the link. If not provided, a default will be used.
 * @param {string} [payload.activation_comment=""] - Comment for the action.
 * @returns {Promise<any>} - The API response.
 */
export const updateBuddyLink = async (payload) => {
  if (!payload.operator_mobile || !payload.buddy_mobile || payload.active_flag === undefined || payload.buddy_priority === undefined) {
    throw new Error("Operator mobile, buddy mobile, active flag, and buddy priority are required.");
  }

  // Construct activated_by if operator_name is provided, otherwise use a generic default or rely on backend.
  // For "mobile.name" format, you'd construct it here if both are available.
  // If only mobile is consistently available from the frontend, that might be the most reliable `activated_by` value.
  payload.activated_by = payload.activated_by || payload.operator_name ? `${payload.operator_mobile}.${payload.operator_name}` : payload.operator_mobile;
  payload.activation_comment = payload.activation_comment || (payload.active_flag === 1 ? `Linked by ${payload.activated_by}` : `Unlinked by ${payload.activated_by}`);

  return apiCall({ method: 'PUT', url: `${OPERATOR_BASE}/buddyLink`, data: payload });
};