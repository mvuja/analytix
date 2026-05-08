import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { OverviewPage } from "./pages/dashboard/OverviewPage";
import { RealtimePage } from "./pages/dashboard/RealtimePage";
import { PagesPage } from "./pages/dashboard/PagesPage";
import { SettingsPage } from "./pages/dashboard/SettingsPage";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { useAuthStore } from "./stores/authStore";
import { useUiStore } from "./stores/uiStore";

export function App() {
  const bootstrap = useAuthStore((state) => state.bootstrap);
  const resolvedTheme = useUiStore((state) => state.resolvedTheme);
  const setSystemTheme = useUiStore((state) => state.setSystemTheme);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const syncSystemTheme = () => setSystemTheme(media.matches ? "dark" : "light");

    syncSystemTheme();
    media.addEventListener("change", syncSystemTheme);

    return () => media.removeEventListener("change", syncSystemTheme);
  }, [setSystemTheme]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  }, [resolvedTheme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/overview" replace />} />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="realtime" element={<RealtimePage />} />
          <Route path="pages" element={<PagesPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
