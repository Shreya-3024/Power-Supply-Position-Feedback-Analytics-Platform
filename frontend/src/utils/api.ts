// API Service - Replace BASE_URL with your actual backend endpoint
import { API_BASE_URL } from '../config';
const BASE_URL = API_BASE_URL;

// Mock data for development - Remove when connecting to real backend
const mockComplaints = [
  {
    _id: '1',
    complaintId: 'PWR2025001234',
    name: 'John Doe',
    phone: '+1234567890',
    email: 'john@example.com',
    address: '123 Main Street',
    area: 'Downtown',
    zone: 'Zone A',
    issueType: 'Power Outage',
    description: 'Complete power outage in the area for the last 2 hours',
    priority: 'High',
    status: 'In Progress',
    imageUrl: null,
    assignedTo: 'Tech-101',
    statusHistory: [
      { status: 'Pending', updatedAt: new Date('2025-01-10T10:00:00'), updatedBy: 'System' },
      { status: 'In Progress', updatedAt: new Date('2025-01-10T11:00:00'), updatedBy: 'Admin' }
    ],
    estimatedResolution: new Date('2025-01-10T16:00:00'),
    actualResolution: null,
    createdAt: new Date('2025-01-10T10:00:00'),
    updatedAt: new Date('2025-01-10T11:00:00')
  },
  {
    _id: '2',
    complaintId: 'PWR2025001235',
    name: 'Jane Smith',
    phone: '+1234567891',
    email: 'jane@example.com',
    address: '456 Oak Avenue',
    area: 'Uptown',
    zone: 'Zone B',
    issueType: 'Voltage Fluctuation',
    description: 'Frequent voltage fluctuations damaging appliances',
    priority: 'Medium',
    status: 'Resolved',
    imageUrl: null,
    assignedTo: 'Tech-102',
    statusHistory: [
      { status: 'Pending', updatedAt: new Date('2025-01-09T14:00:00'), updatedBy: 'System' },
      { status: 'In Progress', updatedAt: new Date('2025-01-09T15:00:00'), updatedBy: 'Admin' },
      { status: 'Resolved', updatedAt: new Date('2025-01-09T18:00:00'), updatedBy: 'Tech-102' }
    ],
    estimatedResolution: new Date('2025-01-09T20:00:00'),
    actualResolution: new Date('2025-01-09T18:00:00'),
    createdAt: new Date('2025-01-09T14:00:00'),
    updatedAt: new Date('2025-01-09T18:00:00')
  }
];

let mockId = 1236;

// Generate unique complaint ID
const generateComplaintId = () => {
  const year = new Date().getFullYear();
  const id = String(mockId++).padStart(6, '0');
  return `PWR${year}${id}`;
};

// API functions
export const api = {
  // Submit new complaint
  submitComplaint: async (data: any) => {
    try {
      // In production, replace with actual API call:
      // const response = await fetch(`${BASE_URL}/complaints`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      // return await response.json();

      // Mock implementation
      const newComplaint = {
        _id: String(Date.now()),
        complaintId: generateComplaintId(),
        ...data,
        status: 'Pending',
        statusHistory: [
          { status: 'Pending', updatedAt: new Date(), updatedBy: 'System' }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockComplaints.unshift(newComplaint);
      return { success: true, data: newComplaint };
    } catch (error) {
      console.error('Error submitting complaint:', error);
      throw error;
    }
  },

  // Get all complaints with filters
  getComplaints: async (filters?: any) => {
    try {
      // In production:
      // const queryString = new URLSearchParams(filters).toString();
      // const response = await fetch(`${BASE_URL}/complaints?${queryString}`);
      // return await response.json();

      // Mock implementation
      let filtered = [...mockComplaints];
      
      if (filters?.status) {
        filtered = filtered.filter(c => c.status === filters.status);
      }
      if (filters?.priority) {
        filtered = filtered.filter(c => c.priority === filters.priority);
      }
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(c => 
          c.complaintId.toLowerCase().includes(search) ||
          c.area.toLowerCase().includes(search) ||
          c.issueType.toLowerCase().includes(search)
        );
      }

      return { success: true, data: filtered };
    } catch (error) {
      console.error('Error fetching complaints:', error);
      throw error;
    }
  },

  // Get complaint by ID
  getComplaintById: async (id: string) => {
    try {
      // In production:
      // const response = await fetch(`${BASE_URL}/complaints/${id}`);
      // return await response.json();

      // Mock implementation
      const complaint = mockComplaints.find(c => c.complaintId === id || c._id === id);
      return { success: true, data: complaint };
    } catch (error) {
      console.error('Error fetching complaint:', error);
      throw error;
    }
  },

  // Track complaints by phone
  trackByPhone: async (phone: string) => {
    try {
      // In production:
      // const response = await fetch(`${BASE_URL}/complaints/track/${phone}`);
      // return await response.json();

      // Mock implementation
      const complaints = mockComplaints.filter(c => c.phone === phone);
      return { success: true, data: complaints };
    } catch (error) {
      console.error('Error tracking complaints:', error);
      throw error;
    }
  },

  // Update complaint status (Admin)
  updateComplaint: async (id: string, updates: any) => {
    try {
      // In production:
      // const response = await fetch(`${BASE_URL}/complaints/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updates)
      // });
      // return await response.json();

      // Mock implementation
      const index = mockComplaints.findIndex(c => c._id === id || c.complaintId === id);
      if (index !== -1) {
        if (updates.status) {
          mockComplaints[index].statusHistory.push({
            status: updates.status,
            updatedAt: new Date(),
            updatedBy: 'Admin'
          });
        }
        mockComplaints[index] = {
          ...mockComplaints[index],
          ...updates,
          updatedAt: new Date()
        };
        return { success: true, data: mockComplaints[index] };
      }
      throw new Error('Complaint not found');
    } catch (error) {
      console.error('Error updating complaint:', error);
      throw error;
    }
  },

  // Delete complaint (Admin)
  deleteComplaint: async (id: string) => {
    try {
      // In production:
      // const response = await fetch(`${BASE_URL}/complaints/${id}`, {
      //   method: 'DELETE'
      // });
      // return await response.json();

      // Mock implementation
      const index = mockComplaints.findIndex(c => c._id === id || c.complaintId === id);
      if (index !== -1) {
        mockComplaints.splice(index, 1);
        return { success: true };
      }
      throw new Error('Complaint not found');
    } catch (error) {
      console.error('Error deleting complaint:', error);
      throw error;
    }
  },

  // Get statistics
  getStats: async () => {
    try {
      // In production:
      // const response = await fetch(`${BASE_URL}/stats`);
      // return await response.json();

      // Mock implementation
      const total = mockComplaints.length;
      const pending = mockComplaints.filter(c => c.status === 'Pending').length;
      const inProgress = mockComplaints.filter(c => c.status === 'In Progress').length;
      const resolved = mockComplaints.filter(c => c.status === 'Resolved').length;
      
      // Calculate average resolution time (in hours)
      const resolvedComplaints = mockComplaints.filter(c => c.actualResolution);
      const avgResolutionTime = resolvedComplaints.length > 0
        ? resolvedComplaints.reduce((acc, c) => {
            const created = new Date(c.createdAt).getTime();
            const resolved = new Date(c.actualResolution!).getTime();
            return acc + (resolved - created) / (1000 * 60 * 60); // Convert to hours
          }, 0) / resolvedComplaints.length
        : 0;

      const today = new Date().toDateString();
      const resolvedToday = mockComplaints.filter(c => 
        c.status === 'Resolved' && 
        new Date(c.actualResolution!).toDateString() === today
      ).length;

      return {
        success: true,
        data: {
          total,
          pending,
          inProgress,
          resolved,
          avgResolutionTime: avgResolutionTime.toFixed(1),
          resolvedToday
        }
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  },

  // Admin login
  adminLogin: async (username: string, password: string) => {
    try {
      // In production:
      // const response = await fetch(`${BASE_URL}/auth/login`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ username, password })
      // });
      // return await response.json();

      // Mock implementation (demo credentials: admin / admin123)
      if (username === 'admin' && password === 'admin123') {
        return { 
          success: true, 
          data: { 
            token: 'mock-jwt-token',
            user: { username: 'admin', role: 'admin' }
          } 
        };
      }
      throw new Error('Invalid credentials');
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }
};
