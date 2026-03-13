import { apiCall } from '@/utils/api';

const BOOKING_BASE = '/rideradar/bookings';

/**
 * Fetches the list of bookings for a specific operator.
 * @param {string} operatorMobile - The mobile number of the operator.
 * @returns {Promise<{ total: number, limit: number, offset: number, booking_summary: object, bookings: Array<object> }>} 
 *          - A promise that resolves with the API response object.
 */
export const fetchBookingList = async (operatorMobile) => {
  if (!operatorMobile) {
    console.error("Operator mobile number is required to fetch booking list.");
    // Return a structure consistent with the expected API response on error
    return { total: 0, limit: 0, offset: 0, booking_summary: {}, bookings: [] };
  }
  const responseData = await apiCall({
    method: 'GET',
    url: `${BOOKING_BASE}/bookinglist/${operatorMobile}`,
  });
  // Ensure a consistent return structure
  return responseData || { total: 0, limit: 0, offset: 0, booking_summary: {}, bookings: [] };
};

/**
 * Fetches detailed information for a specific booking.
 * @param {string|number} rideId - The ID of the ride/booking.
 * @returns {Promise<BookingData>} - The API response containing booking details.
 */
export const fetchBookingDetails = async (rideId) => {
  if (!rideId) {
    throw new Error("Ride ID is required to fetch booking details.");
  }
  return apiCall({
    method: 'GET',
    url: `${BOOKING_BASE}/bookingdetails/${rideId}`,
  });
};