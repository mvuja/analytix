import axios from "axios";

// Keep all dashboard API requests on one configured Axios client
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000",
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  headers: {
    Accept: "application/json",
  },
});

// Sanctum issues the CSRF cookie before state-changing auth requests
export async function csrf() {
  await api.get("/sanctum/csrf-cookie");
}

type ApiErrorBody = {
  message?: string;
  errors?: Record<string, string[]>;
};

// Prefer Laravel's field-level validation message when it is available
export function getApiErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError<ApiErrorBody>(error)) {
    return fallback;
  }

  const errors = error.response?.data?.errors;
  const firstFieldError = errors ? Object.values(errors).flat()[0] : null;

  return firstFieldError ?? error.response?.data?.message ?? fallback;
}
