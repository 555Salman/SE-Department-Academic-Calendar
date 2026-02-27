import { create } from 'zustand';
import type { AuthState, User, UserRole } from '../types';
import { getCurrentUser, setCurrentUser, clearSession } from '../utils/storage';
import { verifyCredentials, findUserByEmail } from '../data/mockData';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: getCurrentUser(),
  isAuthenticated: !!getCurrentUser(),

  login: async (email: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verify credentials
    if (!verifyCredentials(email, password)) {
      return false;
    }

    // Find user
    const user = findUserByEmail(email);
    if (!user) {
      return false;
    }

    // Store user and update state
    setCurrentUser(user);
    set({ user, isAuthenticated: true });
    return true;
  },

  register: async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if email already exists
    const existingUser = findUserByEmail(userData.email || '');
    if (existingUser) {
      return false;
    }

    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name || '',
      email: userData.email || '',
      role: userData.role || 'STUDENT',
      department: userData.department,
      year: userData.year,
      semester: userData.semester,
      group: userData.group,
    };

    // In a real app, would save to backend
    // For demo, just log in the user
    setCurrentUser(newUser);
    set({ user: newUser, isAuthenticated: true });
    return true;
  },

  logout: () => {
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
