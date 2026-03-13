import axios from 'axios';
import { toast } from 'react-toastify';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-api-base-url.com/api';
// console.log("Api BAse URL: ", API_BASE_URL);


export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});


/**
 * Centralized API call function.
 * @param {string} method - HTTP method (get, post, put, delete, etc.).
 * @param {string} url - The endpoint URL (will be appended to baseURL).
 * @param {object} [data] - The request payload for POST, PUT, PATCH requests.
 * @param {object} [params] - The URL parameters for GET requests.
 * @param {object} [headers] - Custom headers for the request.
 * @returns {Promise<any>} - A promise that resolves with the API response data or rejects with an error.
 */
export const apiCall = async ({ method, url, data, params, headers }) => {
  try {
    const response = await apiClient({
      method,
      url,
      data,
      params,
      headers,
    });

    const responseData = response.data;

    if (responseData && responseData.message) {
      toast.success(responseData.message);
    } else if (method.toLowerCase() !== 'get' && response.status >= 200 && response.status < 300) {
      toast.success('Operation successful!');
    }

    return responseData;
  } catch (error) {
    let errorMessage = 'An unexpected error occurred.';

    if (error.response) {
      const { status, data: errorData } = error.response;
      errorMessage = errorData?.message || errorData?.error || `Request failed with status code ${status}`;

      if (status === 401) {
        toast.error('Unauthorized. Please log in again.');
      } else if (status === 403) {
        toast.error('Forbidden. You do not have permission to perform this action.');
      } else if (status === 404) {
        toast.error(`Resource not found at ${error.config.url}.`);
      } else if (status >= 400 && status < 500) {
        toast.error(errorMessage);
      } else if (status >= 500) {
        toast.error('Server error. Please try again later.');
      }
    } else if (error.request) {
      errorMessage = 'No response from server. Please check your network connection.';
      toast.error(errorMessage);
    } else {
      errorMessage = error.message;
      toast.error(errorMessage);
    }

    console.error('API Call Error:', error.config?.method, error.config?.url, error);
    throw error;
  }
};