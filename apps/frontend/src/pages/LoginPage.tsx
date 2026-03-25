import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export function LoginPage() {
  const user = useAuthStore((s) => s.user);
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();
  const loc = useLocation();
  const from = (loc.state as { from?: string } | null)?.from ?? "/dashboard";

  if (user) return <Navigate to={from} replace />;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearError();
    try {
      if (mode === "login") await login(email, password);
      else await register(email, password);
      nav(from, { replace: true });
    } catch {
      /* error в store */
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <h1 className="text-2xl font-semibold text-white">Вход</h1>
        <p className="mt-1 text-sm text-slate-400">MVP конструктора лендингов</p>

        <div className="mt-6 flex rounded-lg bg-slate-800 p-1">
          <button
            type="button"
            className={`flex-1 rounded-md py-2 text-sm font-medium ${
              mode === "login" ? "bg-slate-700 text-white" : "text-slate-400"
            }`}
            onClick={() => {
              setMode("login");
              clearError();
            }}
          >
            Логин
          </button>
          <button
            type="button"
            className={`flex-1 rounded-md py-2 text-sm font-medium ${
              mode === "register" ? "bg-slate-700 text-white" : "text-slate-400"
            }`}
            onClick={() => {
              setMode("register");
              clearError();
            }}
          >
            Регистрация
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="auth-email" className="block text-sm text-slate-400">
              Email
            </label>
            <input
              id="auth-email"
              type="email"
              required
              autoComplete="email"
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="auth-password" className="block text-sm text-slate-400">
              Пароль
            </label>
            <input
              id="auth-password"
              type="password"
              required
              minLength={6}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-2.5 font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? "…" : mode === "login" ? "Войти" : "Создать аккаунт"}
          </button>
        </form>
      </div>
    </div>
  );
}
