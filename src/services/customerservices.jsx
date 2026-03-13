import { apiCall } from '@/utils/api';

const CUSTOMER_BASE_URL = '/rideradar/customer';

/**
 * Fetches the list of customers associated with a specific operator.
 * @param {string} operatorMobile - The mobile number of the operator.
 * @returns {Promise<{ customers: Array<object> }>} - A promise that resolves with the API response object,
 *                                                    which includes a 'customers' array.
 */
export const fetchAssociatedCustomers = async (operatorMobile) => {
  if (!operatorMobile) {
    console.error("Operator mobile number is required to fetch associated customers.");
    return { customers: [] }; // Return empty array on error or missing param
  }
  const responseData = await apiCall({
    method: 'GET',
    url: `${CUSTOMER_BASE_URL}/customerassociated/${operatorMobile}`,
  });
  // Ensure a consistent return structure, defaulting to an empty array for customers
  return responseData || { customers: [] };
};

/**
 * Fetches the detailed profile of a specific customer.
 * @param {string} customerMobile - The mobile number of the customer.
 * @returns {Promise<{ customer: object }>} - A promise that resolves with the API response object,
 *                                             which includes a 'customer' object.
 */
export const fetchCustomerProfile = async (customerMobile) => {
  if (!customerMobile) {
    console.error("Customer mobile number is required to fetch their profile.");
    return { customer: null }; // Return null on error or missing param
  }
  return apiCall({
    method: 'GET',
    url: `${CUSTOMER_BASE_URL}/customerprofile/${customerMobile}`,
  });
};

/**
 * Onboards a new customer.
 * @param {CustomerModel} customerModelInstance - An instance of the CustomerModel class.
 * @returns {Promise<any>} - The API response.
 */
export const onboardCustomer = async (customerModelInstance) => {
  if (!customerModelInstance || typeof customerModelInstance.toJSON !== 'function') {
    throw new Error("A valid CustomerModel instance is required to onboard a new customer.");
  }
  return apiCall({
    method: 'POST',
    url: `${CUSTOMER_BASE_URL}/onboarding`,
    data: customerModelInstance.toJSON(),
  });
};

/**
 * Updates an existing customer's profile.
 * The customer_mobile in the payload is used for identification by the backend.
 * @param {CustomerModel} customerModelInstance - An instance of the CustomerModel class.
 * @returns {Promise<any>} - The API response.
 */
export const updateCustomerProfile = async (customerModelInstance) => {
  if (!customerModelInstance || typeof customerModelInstance.toJSON !== 'function' || !customerModelInstance.customer_mobile) {
    throw new Error("A valid CustomerModel instance with customer_mobile is required to update the profile.");
  }
  return apiCall({
    method: 'PUT', // Assuming PUT for updates
    url: `${CUSTOMER_BASE_URL}/profileupdate`, // Ensure this matches your actual update endpoint
    data: customerModelInstance.toJSON(),
  });
};

/**
 * Updates the status of a specific customer.
 * @param {object} payload - The data to send for updating the status.
 * @param {string} payload.operator_mobile - The operator's mobile number.
 * @param {string} payload.customer_mobile - The customer's mobile number.
 * @param {number} payload.active_flag - The new status flag (1 for Active, 2 for Suspend).
 * @param {string} [payload.notes] - Optional notes for the status change.
 * @returns {Promise<any>} - The API response.
 */
export const updateCustomerStatus = async (payload) => {
  if (!payload.operator_mobile || !payload.customer_mobile || payload.active_flag === undefined) {
    throw new Error("Operator mobile, customer mobile, and active flag are required to update customer status.");
  }
  // Ensure the payload matches the API expectation, especially the 'notes' field.
  const apiPayload = {
    operator_mobile: payload.operator_mobile,
    customer_mobile: payload.customer_mobile,
    active_flag: payload.active_flag,
    notes: payload.remarks || payload.notes || "", // Use remarks from modal, or notes if provided, default to empty string
  };
  return apiCall({
    method: 'PUT', // Or 'POST', depending on your API design
    url: `${CUSTOMER_BASE_URL}/activatestatus`,
    data: apiPayload,
  });
};