const CODESANDBOX_API_URL = window.location.hostname.includes('codesandbox') 
  ? `${window.location.protocol}//${window.location.host.replace('-3000', '-5001')}`
  : (process.env.VITE_API_URL || 'http://localhost:5001/api');

export const API_BASE_URL = CODESANDBOX_API_URL;
export const API_URL = `${CODESANDBOX_API_URL}/api`;
