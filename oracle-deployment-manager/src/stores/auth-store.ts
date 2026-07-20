'use client';

import { create } from 'zustand';

export type UserRole = 'admin' | 'user';

interface AuthState {
  isLoggedIn: boolean;
  role: UserRole | null;
  username: string;
  login: (username: string, role: UserRole) => void;
  logout: () => void;
  canEdit: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: false,
  role: null,
  username: '',

  login: (username, role) => {
    set({ isLoggedIn: true, role, username });
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-role', role);
      localStorage.setItem('auth-username', username);
    }
  },

  logout: () => {
    set({ isLoggedIn: false, role: null, username: '' });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-role');
      localStorage.removeItem('auth-username');
    }
  },

  canEdit: () => {
    return get().role === 'admin';
  },
}));

export function loadAuthFromStorage(): { role: UserRole | null; username: string } {
  if (typeof window === 'undefined') return { role: null, username: '' };
  try {
    const role = localStorage.getItem('auth-role') as UserRole | null;
    const username = localStorage.getItem('auth-username') || '';
    return { role, username };
  } catch {
    return { role: null, username: '' };
  }
}
