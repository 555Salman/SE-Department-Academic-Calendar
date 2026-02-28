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

  register: async (): Promise<boolean> => {
    // Account activation is handled by the backend signup flow:
    // Admin pre-registers the email, then the user activates via /signup.
    return false;
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
