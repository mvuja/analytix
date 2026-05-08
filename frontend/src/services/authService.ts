import { api, csrf } from "../lib/api";
import type { AuthPayload, RegisterPayload, User } from "../types/auth";

type AuthResponse = {
  user: User;
};

export const authService = {
  async login(payload: AuthPayload) {
    await csrf();
    const { data } = await api.post<AuthResponse>("/api/auth/login", payload);
    return data.user;
  },
  async register(payload: RegisterPayload) {
    await csrf();
    const { data } = await api.post<AuthResponse>("/api/auth/register", payload);
    return data.user;
  },
  async me() {
    const { data } = await api.get<AuthResponse>("/api/auth/me");
    return data.user;
  },
  async logout() {
    await api.post("/api/auth/logout");
  },
};
