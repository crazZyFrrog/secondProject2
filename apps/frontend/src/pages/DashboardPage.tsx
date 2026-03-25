import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useProjectsStore } from "@/stores/projectsStore";

export function DashboardPage() {
  const load = useProjectsStore((s) => s.load);
  const items = useProjectsStore((s) => s.items);
  const loading = useProjectsStore((s) => s.loading);
  const error = useProjectsStore((s) => s.error);
  const create = useProjectsStore((s) => s.create);
  const remove = useProjectsStore((s) => s.remove);

  const [name, setName] = useState("");

  useEffect(() => {
    void load();
  }, [load]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await create(name.trim());
    setName("");
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Проекты</h1>
      <p className="mt-1 text-slate-400">Создавайте и редактируйте лендинги</p>

      <form onSubmit={onCreate} className="mt-8 flex flex-wrap gap-2">
        <input
          placeholder="Название проекта"
          className="min-w-[200px] flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-indigo-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-500"
        >
          Создать
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      {loading && <p className="mt-6 text-slate-500">Загрузка…</p>}

      <ul className="mt-8 space-y-3">
        {items.map((p) => (
          <li
            key={p.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3"
          >
            <span className="font-medium text-white">{p.name}</span>
            <div className="flex flex-wrap gap-2">
              <Link
                to={`/editor/${p.id}`}
                className="rounded-md bg-slate-800 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-700"
              >
                Редактор
              </Link>
              <Link
                to={`/preview/${p.id}`}
                className="rounded-md bg-slate-800 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-700"
              >
                Превью
              </Link>
              <button
                type="button"
                onClick={() => void remove(p.id)}
                className="rounded-md border border-red-900/50 px-3 py-1.5 text-sm text-red-300 hover:bg-red-950/40"
              >
                Удалить
              </button>
            </div>
          </li>
        ))}
      </ul>

      {!loading && items.length === 0 && (
        <p className="mt-8 text-slate-500">Пока нет проектов — создайте первый.</p>
      )}
    </div>
  );
}
