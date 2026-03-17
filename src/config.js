// Frontend API Configuration
// Automatically detects environment to use correct backend URL

const getApiBaseUrl = () => {
  // Development
  if (process.env.NODE_ENV === 'development' || import.meta.env.DEV) {
    return 'http://localhost:5001/api';
  }
  
  // Production - can be overridden by environment variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Fallback to current domain
  return `${window.location.origin}/api`;
};

export const API_BASE_URL = getApiBaseUrl();
