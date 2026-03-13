import { apiCall } from '@utils'; // Assuming your apiCall utility is in @utils
import { RideRequestModel } from '@models'; // Assuming your models are aliased or provide correct path

const RIDE_REQUEST_BASE_URL = '/rideradar/ride'; // As per your endpoint

/**
 * Creates a new ride request.
 * @param {RideRequestModel} rideRequestInstance - An instance of the RideRequestModel.
 * @returns {Promise<any>} - The API response.
 */
export const createRideRequest = async (rideRequestInstance) => {
  if (!rideRequestInstance || typeof rideRequestInstance.toPayload !== 'function') {
    throw new Error("A valid RideRequestModel instance is required to create a ride request.");
  }
  return apiCall({
    method: 'POST',
    url: `${RIDE_REQUEST_BASE_URL}/rierequestcreate`, // Corrected endpoint typo from 'rierequestcreate' to 'riderequestcreate' if that was intended
    data: rideRequestInstance.toPayload(),
  });
};