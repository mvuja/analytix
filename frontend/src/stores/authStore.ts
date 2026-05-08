import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "../services/authService";
import type { AuthPayload, RegisterPayload, User } from "../types/auth";

type AuthState = {
  user: User | null;
  isBootstrapped: boolean;
  isLoading: boolean;
  login: (payload: AuthPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  bootstrap: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isBootstrapped: false,
      isLoading: false,
      async login(payload) {
        set({ isLoading: true });
        try {
          const user = await authService.login(payload);
          set({ user });
        } finally {
          set({ isLoading: false });
        }
      },
      async register(payload) {
        set({ isLoading: true });
        try {
          const user = await authService.register(payload);
          set({ user });
        } finally {
          set({ isLoading: false });
        }
      },
      async logout() {
        await authService.logout();
        set({ user: null });
      },
      async bootstrap() {
        if (get().isBootstrapped) return;
        try {
          const user = await authService.me();
          set({ user });
        } catch {
          set({ user: null });
        } finally {
          set({ isBootstrapped: true });
        }
      },
    }),
    {
      name: "analytix-auth",
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
