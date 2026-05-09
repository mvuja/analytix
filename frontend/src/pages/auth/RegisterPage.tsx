import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { getApiErrorMessage } from "../../lib/api";
import { useAuthStore } from "../../stores/authStore";

export function RegisterPage() {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await register({ name, email, password });
      navigate("/overview");
    } catch (error) {
      setError(getApiErrorMessage(error, "Could not create the account. Check the fields and try again."));
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 dark:bg-slate-950">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-panel dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Create account</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Start with a clean dashboard and the demo analytics workspace.</p>
        <div className="mt-6 space-y-4">
          <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" />
          <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
          <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
          {error && <p className="text-sm font-medium text-coral">{error}</p>}
          <Button className="w-full" disabled={isLoading}>{isLoading ? "Creating..." : "Create account"}</Button>
        </div>
        <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
          Already registered? <Link to="/login" className="font-semibold text-slate-950 dark:text-mint">Sign in</Link>
        </p>
      </form>
    </main>
  );
}
