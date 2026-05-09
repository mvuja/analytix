import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { getApiErrorMessage } from "../../lib/api";
import { isDemoMode } from "../../lib/demoMode";
import { useAuthStore } from "../../stores/authStore";

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [email, setEmail] = useState("demo@analytix.dev");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await login({ email, password });
      navigate("/overview");
    } catch (error) {
      setError(getApiErrorMessage(error, "Unable to sign in with those credentials."));
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 dark:bg-slate-950">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-panel dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {isDemoMode ? "Hosted demo mode uses local sample data so you can explore the dashboard." : "Use the seeded demo account or create your own workspace user."}
        </p>
        <div className="mt-6 space-y-4">
          <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
          <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
          {error && <p className="text-sm font-medium text-coral">{error}</p>}
          <Button className="w-full" disabled={isLoading}>{isLoading ? "Signing in..." : "Sign in"}</Button>
        </div>
        <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
          New here? <Link to="/register" className="font-semibold text-slate-950 dark:text-mint">Create an account</Link>
        </p>
      </form>
    </main>
  );
}
