import { apiCall } from '@/utils/api';
import { VehiclePricingModel } from '@/models'; // Updated import

const VEHICLE_BASE = '/rideradar/vehicle'


/**
 * Fetches the vehicle pricing list for a given operator.
 * @param {string} operatorMobile - The mobile number of the operator.
 * @returns {Promise<{ total: number, limit: number, offset: number, vehicles: VehiclePricingModel[] }>}
 */
export const getVehiclePricingList = async (operatorMobile) => {
  if (!operatorMobile) {
    console.error("Operator mobile number is required to fetch vehicle pricing.");
    return { total: 0, limit: 0, offset: 0, vehicles: [] };
  }

  const data = await apiCall({
    method: 'GET',
    url: `${VEHICLE_BASE}/vehiclepricinglist/`,
    params: { operator_mobile: operatorMobile },
  });

  const { total = 0, limit = 0, offset = 0, vehicle_pricing = [] } = data || {};

  return {
    total,
    limit,
    offset,
    vehicles: vehicle_pricing.map(item => new VehiclePricingModel(item)), // Use new model
  };
};

/**
 * Updates an existing vehicle pricing configuration.
 * @param {VehiclePricingModel} pricingModel - An instance of VehiclePricingModel.Must include operatorMobile and vehicleType for identification.
 * @returns {Promise<any>} - The API response.
 */
export const updateVehiclePricing = async (pricingModel) => {
  if (!pricingModel || typeof pricingModel.toJSON !== 'function' || !pricingModel.operatorMobile || !pricingModel.vehicleType) {
    throw new Error("Operator mobile and vehicle type are required to update pricing.");
  }

  return apiCall({
    method: 'PUT',
    url: `${VEHICLE_BASE}/vehiclepricingupdate`,
    data: pricingModel.toJSON(),
  });
};

/**
 * Onboards a new vehicle pricing configuration.
 * @param {VehiclePricingModel} pricingModel - An instance of VehiclePricingModel.
 * @returns {Promise<any>} - The API response.
 */
export const onboardVehiclePricing = async (pricingModel) => {
  // Ensure pricingModel is an instance of VehiclePricing or has the toJSON method
  if (!pricingModel || typeof pricingModel.toJSON !== 'function' || !pricingModel.operatorMobile || !pricingModel.vehicleType) {
    throw new Error("Operator mobile and vehicle type are required to onboard pricing, and a valid pricing model must be provided.");
  }
  return apiCall({
    method: 'POST',
    url: `${VEHICLE_BASE}/vehiclepricingonboard`,
    data: pricingModel.toJSON(),
  });
};

/**
 * Deletes (suspends with active_flag 0) a specific vehicle pricing entry.
 * @param {string} operatorMobile - The mobile number of the operator.
 * @param {string} vehicleType - The type of the vehicle whose pricing is to be deleted.
 * @returns {Promise<any>} - The API response.
 */
export const deleteVehiclePricing = async (operatorMobile, vehicleType) => {
  if (!operatorMobile || !vehicleType) {
    throw new Error("Operator mobile and vehicle type are required to delete pricing.");
  }
  const payload = {
    operator_mobile: operatorMobile,
    vehicle_type: vehicleType,
    active_flag: 0,
  };
  return apiCall({
    method: 'PUT', // Or 'POST', depending on your API for this endpoint
    url: `${VEHICLE_BASE}/vehiclepricingsuspend`, // Using the provided endpoint
    data: payload,
  });
};
