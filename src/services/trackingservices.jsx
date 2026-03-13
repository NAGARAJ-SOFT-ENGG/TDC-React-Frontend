import { apiCall } from '@/utils/api';

const TRACKING_BASE_URL = '/rideradar/tracking';

/**
 * Fetches the list of ongoing rides for a specific operator.
 * @param {string} operatorMobile - The mobile number of the operator.
 * @returns {Promise<{ ongoing_rides: Array<object> }>} 
 *          - A promise that resolves with the API response object, 
 *            which includes an 'ongoing_rides' array.
 */
export const fetchOngoingRideList = async (operatorMobile) => {
  if (!operatorMobile) {
    console.error("Operator mobile number is required to fetch ongoing ride list.");
    return { ongoing_rides: [] }; // Return empty array on error or missing param
  }
  const responseData = await apiCall({
    method: 'GET',
    url: `${TRACKING_BASE_URL}/ongoingridelist/${operatorMobile}`,
  });
  return responseData || { ongoing_rides: [] }; // Ensure a consistent return structure
};

/**
 * Fetches the detailed information for a specific ride.
 * @param {string|number} rideId - The ID of the ride.
 * @returns {Promise<object>} - A promise that resolves with the API response object containing ride details.
 */
export const fetchRideDetails = async (rideId) => {
  if (!rideId) {
    console.error("Ride ID is required to fetch ride details.");
    return null; // Or throw an error, or return a specific error structure
  }
  return apiCall({
    method: 'GET',
    url: `${TRACKING_BASE_URL}/ridedetails/${rideId}`,
  });
};