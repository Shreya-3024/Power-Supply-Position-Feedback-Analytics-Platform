// Dynamic API URL - works for local dev and production deployment
const getApiBaseUrl = () => {
  // 1. Use VITE env variable if set (Recommended for production)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // 2. Default: local development
  return 'http://localhost:5001/api';
};

export const API_URL = getApiBaseUrl();
export const API_BASE_URL = API_URL.replace('/api', '');
