import { create } from 'zustand';
import axios from 'axios';
import type { AuthState, User, UserRole } from '../types';
import { getCurrentUser, setCurrentUser, clearSession } from '../utils/storage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: getCurrentUser(),
  isAuthenticated: !!getCurrentUser(),

  login: async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token, user: backendUser } = response.data;

      // Map backend user shape to frontend User type
      const user: User = {
        id: String(backendUser.id),
        name: `${backendUser.first_name ?? ''} ${backendUser.last_name ?? ''}`.trim(),
        email: backendUser.email,
        role: backendUser.role as UserRole,
        department: backendUser.department,
      };

      // Persist token and user
      localStorage.setItem('token', token);
      setCurrentUser(user);
      set({ user, isAuthenticated: true });
      return true;
    } catch {
      return false;
    }
  },

  register: async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    try {
      // Split name into first/last for the backend
      const nameParts = (userData.name || '').trim().split(' ');
      const first_name = nameParts[0] || '';
      const last_name = nameParts.slice(1).join(' ') || '';

      await axios.post(`${API_URL}/auth/signup`, {
        email: userData.email,
        first_name,
        last_name,
        password: userData.password,
      });
      return true;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        // Propagate server message so UI can show it
        throw new Error(err.response?.data?.message || 'Registration failed');
      }
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    clearSession();
    set({ user: null, isAuthenticated: false });
  },

  setUser: (user: User) => {
    setCurrentUser(user);
    set({ user, isAuthenticated: true });
  },

  switchRole: (role: UserRole) => {
    const currentUser = get().user;
    if (!currentUser) return;
    const updatedUser = { ...currentUser, role };
    setCurrentUser(updatedUser);
    set({ user: updatedUser });
  },
}));
