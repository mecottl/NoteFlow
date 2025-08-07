import { getApiBaseUrl } from './environment.js';

// URL base de la API
export const API_BASE_URL = getApiBaseUrl();

// URLs específicas de la API
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
  },
  NOTES: {
    CREATE: `${API_BASE_URL}/notes`,
    GET_ALL: (userId) => `${API_BASE_URL}/notes/user/${userId}`,
    GET_ONE: (id) => `${API_BASE_URL}/notes/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/notes/${id}`,
    DELETE: (id) => `${API_BASE_URL}/notes/${id}`,
  },
  PREDICT: {
    SUGGEST: `${API_BASE_URL}/predict`,
  },
  HEALTH: `${API_BASE_URL}`,
};

export default API_ENDPOINTS; 