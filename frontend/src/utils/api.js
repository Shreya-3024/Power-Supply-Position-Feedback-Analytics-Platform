import { API_BASE_URL } from '../config';

const BASE_URL = API_BASE_URL;

// API functions
export const api = {
  // Submit new complaint
  submitComplaint: async (data) => {
    try {
      const response = await fetch(`${BASE_URL}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      console.error('Error submitting complaint:', error);
      throw error;
    }
  },

  // Get all complaints with filters
  getComplaints: async (filters) => {
    try {
      const queryString = new URLSearchParams(filters).toString();
      const response = await fetch(`${BASE_URL}/feedback?${queryString}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching complaints:', error);
      throw error;
    }
  },

  // Get complaint by ID
  getComplaintById: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/feedback/${id}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching complaint:', error);
      throw error;
    }
  },

  // Track complaints by phone
  trackByPhone: async (phone) => {
    try {
      const response = await fetch(`${BASE_URL}/feedback/phone/${phone}`);
      return await response.json();
    } catch (error) {
      console.error('Error tracking complaints:', error);
      throw error;
    }
  },

  // Update complaint status (Admin)
  updateComplaint: async (id, updates) => {
    try {
      const response = await fetch(`${BASE_URL}/feedback/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updates)
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating complaint:', error);
      throw error;
    }
  },

  // Delete complaint (Admin)
  deleteComplaint: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/feedback/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Error deleting complaint:', error);
      throw error;
    }
  },

  // Get statistics
  getStats: async () => {
    try {
      const response = await fetch(`${BASE_URL}/analytics/dashboard`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  },

  // Admin login
  adminLogin: async (email, password) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return await response.json();
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }
};
