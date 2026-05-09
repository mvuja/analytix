import { api, csrf } from "../lib/api";
import { demoUser } from "../data/demoAnalytics";
import { demoDelay, isDemoMode } from "../lib/demoMode";
import type { AuthPayload, RegisterPayload, User } from "../types/auth";

type AuthResponse = {
  user: User;
};

// Auth calls stay small here so stores can focus on app state
export const authService = {
  async login(payload: AuthPayload) {
    if (isDemoMode) {
      await demoDelay();
      return { ...demoUser, email: payload.email || demoUser.email };
    }

    await csrf();
    const { data } = await api.post<AuthResponse>("/api/auth/login", payload);
    return data.user;
  },
  async register(payload: RegisterPayload) {
    if (isDemoMode) {
      await demoDelay();
      return { ...demoUser, name: payload.name || demoUser.name, email: payload.email || demoUser.email };
    }

    // Registration also creates a logged-in Sanctum session
    await csrf();
    const { data } = await api.post<AuthResponse>("/api/auth/register", payload);
    return data.user;
  },
  async me() {
    if (isDemoMode) {
      await demoDelay();
      return demoUser;
    }

    const { data } = await api.get<AuthResponse>("/api/auth/me");
    return data.user;
  },
  async logout() {
    if (isDemoMode) {
      await demoDelay();
      return;
    }

    await api.post("/api/auth/logout");
  },
};
