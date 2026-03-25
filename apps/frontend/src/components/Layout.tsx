import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

const link =
  "rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white";
const active = "bg-slate-800 text-white";

export function Layout() {
  const logout = useAuthStore((s) => s.logout);
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/dashboard" className="text-lg font-semibold text-white">
            Landing Builder
          </Link>
          <nav className="flex flex-wrap items-center gap-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `${link} ${isActive ? active : ""}`}
            >
              Проекты
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) => `${link} ${isActive ? active : ""}`}
            >
              Настройки
            </NavLink>
            <button
              type="button"
              onClick={() => logout()}
              className={`${link} border-0 bg-transparent cursor-pointer`}
            >
              Выйти
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
