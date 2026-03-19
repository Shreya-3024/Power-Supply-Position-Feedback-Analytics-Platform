// Frontend API Configuration
// Automatically detects environment to use correct backend URL

const getApiBaseUrl = () => {
  // 1. Use VITE env variable if explicitly set (Render production builds)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // 2. Development mode - use localhost
  if (import.meta.env.DEV) {
    return 'http://localhost:5001/api';
  }

  // 3. Render deployment auto-detect
  if (typeof window !== 'undefined' && window.location.hostname.includes('onrender.com')) {
    return 'https://power-supply-backend.onrender.com/api';
  }

  // 4. Fallback to current domain
  return `${window.location.origin}/api`;
};

export const API_BASE_URL = getApiBaseUrl();
