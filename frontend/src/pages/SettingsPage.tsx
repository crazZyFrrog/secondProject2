import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";

export function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const refreshProfile = useAuthStore((s) => s.refreshProfile);
  const [email, setEmail] = useState(user?.email ?? "");
  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user?.email]);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    setLoading(true);
    try {
      await refreshProfile(email.trim());
      setMsg("Профиль обновлён");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-semibold text-white">Настройки</h1>
      <p className="mt-1 text-slate-400">Профиль (email)</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="settings-email" className="block text-sm text-slate-400">
            Email
          </label>
          <input
            id="settings-email"
            type="email"
            required
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {err && <p className="text-sm text-red-400">{err}</p>}
        {msg && <p className="text-sm text-emerald-400">{msg}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {loading ? "Сохранение…" : "Сохранить"}
        </button>
      </form>
    </div>
  );
}
