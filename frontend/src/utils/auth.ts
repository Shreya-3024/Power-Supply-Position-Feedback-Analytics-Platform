// Authentication utility with fallback to localStorage when backend is unavailable
import { API_BASE_URL } from '../config';
const API_URL = `${API_BASE_URL}/auth`;
const USE_BACKEND = true; // Set to true when backend is running

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

// Generate a simple JWT-like token (for demo purposes)
function generateToken(userId: string): string {
  return btoa(JSON.stringify({ userId, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }));
}

// Register user
export async function registerUser(data: RegisterData): Promise<{ user: User; token: string }> {
  if (USE_BACKEND) {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      if (error instanceof Error && error.message.includes('fetch')) {
        console.warn('Backend not available, using localStorage fallback');
        return registerUserLocally(data);
      }
      throw error;
    }
  } else {
    return registerUserLocally(data);
  }
}

// Register user locally (fallback)
function registerUserLocally(data: RegisterData): { user: User; token: string } {
  // Check if user already exists
  const users = JSON.parse(localStorage.getItem('powersupply_users') || '[]');
  
  if (users.find((u: any) => u.email === data.email)) {
    throw new Error('User with this email already exists');
  }

  // Create new user
  const user: User = {
    id: `user_${Date.now()}`,
    name: data.name,
    email: data.email,
    role: 'user'
  };

  // Store user with password (hashed in real app)
  users.push({ ...user, password: data.password });
  localStorage.setItem('powersupply_users', JSON.stringify(users));

  // Generate token
  const token = generateToken(user.id);

  return { user, token };
}

// Login user
export async function loginUser(data: LoginData): Promise<{ user: User; token: string }> {
  if (USE_BACKEND) {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      if (error instanceof Error && error.message.includes('fetch')) {
        console.warn('Backend not available, using localStorage fallback');
        return loginUserLocally(data);
      }
      throw error;
    }
  } else {
    return loginUserLocally(data);
  }
}

// Login user locally (fallback)
function loginUserLocally(data: LoginData): { user: User; token: string } {
  const users = JSON.parse(localStorage.getItem('powersupply_users') || '[]');
  
  const userRecord = users.find(
    (u: any) => u.email === data.email && u.password === data.password
  );

  if (!userRecord) {
    throw new Error('Invalid email or password');
  }

  // Remove password from user object
  const { password, ...user } = userRecord;

  // Generate token
  const token = generateToken(user.id);

  return { user, token };
}

// Verify token
export function verifyToken(token: string): boolean {
  try {
    const decoded = JSON.parse(atob(token));
    return decoded.exp > Date.now();
  } catch {
    return false;
  }
}

// Get current user
export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  if (!userStr || !token) return null;

  if (!verifyToken(token)) {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return null;
  }

  return JSON.parse(userStr);
}

// Logout
export function logout(): void {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
}
