import { apiCall } from '@/utils/api';

const BASE_URL = '/rideradar/vehicle';

/**
 * Fetches the list of available vehicle types by deriving them from the vehicle model list.
 * @returns {Promise<Array<{value: string, label: string}>>} - A promise that resolves with an array of unique vehicle type objects,
 * formatted for a Select dropdown.
 */
export const fetchVehicleTypes = async () => {
  const responseData = await apiCall({
    method: 'GET',
    url: `${BASE_URL}/vehiclemodellist/`,
  });

  if (responseData && Array.isArray(responseData.vehicle_models)) {
    const types = responseData.vehicle_models.map(model => model.vehicle_type);
    const uniqueTypes = [...new Set(types)].filter(Boolean); // Get unique types and remove any null/undefined
    return uniqueTypes.map(type => ({
      value: type,
      label: type, // You might want to format this label later (e.g., add spaces)
    }));
  }
  return []; // Return empty array if data is not in the expected format or if apiCall itself throws and is caught elsewhere
};