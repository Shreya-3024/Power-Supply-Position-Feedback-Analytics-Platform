// Dynamic API URL - works for local dev, CodeSandbox, and Render deployment
const getApiBaseUrl = () => {
  // 1. Use VITE env variable if set (production builds on Render)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;

    // 2. CodeSandbox environment
    if (hostname.includes('codesandbox.io') || hostname.includes('csb.app')) {
      const protocol = window.location.protocol;
      return `${protocol}//${hostname.replace('-3000', '-5001')}/api`;
    }

    // 3. Render deployment (frontend and backend on different subdomains)
    if (hostname.includes('onrender.com')) {
      return `https://power-supply-backend.onrender.com/api`;
    }
  }

  // 4. Default: local development
  return 'http://localhost:5001/api';
};

export const API_URL = getApiBaseUrl();
export const API_BASE_URL = API_URL.replace('/api', '');
