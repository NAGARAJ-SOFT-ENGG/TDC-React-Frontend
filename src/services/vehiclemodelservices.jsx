import {apiCall} from '@utils'
import {VehiclemodelModel} from '@models'

const VEHICLE_BASE = '/rideradar/vehicle'
/**
 * Updates an existing vehicle model's details.
 * @param {VehiclemodelModel} vehicleModelInstance - An instance of the VehicleModel class.
 * @returns {Promise<any>} - The API response.
 */
export const updateVehicleModelDetails = async (vehicleModelInstance) => {
  if (!vehicleModelInstance || typeof vehicleModelInstance.toJSON !== 'function') {
    throw new Error("A valid VehicleModel instance is required to update details.");
  }
  return apiCall({
    method: 'PUT',
    url: `${VEHICLE_BASE}/modelupdate`,
    data: vehicleModelInstance.toJSON(),
  });
};

/**
 * Fetches the list of vehicle models and their types.
 * @returns {Promise<object>} - A promise that resolves with the API response object,
 * which includes a 'vehicle_models' array.
 */
export const fetchVehicleModelList = async () => {
  const responseData = await apiCall({
    method: 'GET',
    url: `${VEHICLE_BASE}/vehiclemodellist/`, // Added trailing slash as per your API endpoint
  });
  // Ensure a consistent return structure, defaulting to an empty array for vehicle_models
  return responseData || { total: 0, limit: 0, offset: 0, vehicle_models: [] };
};

/**
 * Onboards a new vehicle model.
 * @param {VehiclemodelModel} vehicleModelInstance - An instance of the VehiclemodelModel class.
 * @returns {Promise<any>} - The API response.
 */
export const onboardVehicleModel = async (vehicleModelInstance) => {
  if (!vehicleModelInstance || typeof vehicleModelInstance.toJSON !== 'function') {
    throw new Error("A valid VehiclemodelModel instance is required to onboard a new model.");
  }
  return apiCall({
    method: 'POST',
    url: `${VEHICLE_BASE}/modelonboard`, // Endpoint for onboarding new models
    data: vehicleModelInstance.toJSON(),
  });
};

/**
 * Deletes (suspends with active_flag 0) a specific vehicle model.
 * @param {string} vehicleModelName - The name of the vehicle model to be deleted.
 * @returns {Promise<any>} - The API response.
 */
export const deleteVehicleModel = async (vehicleModelName) => {
  if (!vehicleModelName) {
    throw new Error("Vehicle model name is required to delete.");
  }
  const payload = {
    vehicle_model: vehicleModelName,
    active_flag: 0, // 0 for delete as per API
  };
  return apiCall({
    method: 'PUT', // Or 'POST', depending on your API for this endpoint
    url: `/rideradar/vehicle/vehiclemodelsuspend`,
    data: payload,
  });
};
