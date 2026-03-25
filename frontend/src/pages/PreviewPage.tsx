import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PreviewRenderer } from "@/components/PreviewRenderer";
import { api } from "@/lib/api";
import type { PageContent, Project } from "@/types";

export function PreviewPage() {
  const { id } = useParams();
  const pid = Number(id);
  const [project, setProject] = useState<Project | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isFinite(pid)) return;
    let cancelled = false;
    (async () => {
      try {
        const p = await api.project(pid);
        if (!cancelled) setProject(p);
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : "Ошибка");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pid]);

  if (!Number.isFinite(pid)) return <p className="text-slate-400">Некорректный id</p>;
  if (err) return <p className="text-red-400">{err}</p>;
  if (!project) return <p className="text-slate-400">Загрузка…</p>;

  const content = project.content as PageContent;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-white">{project.name}</h1>
        <Link
          to={`/editor/${project.id}`}
          className="text-sm text-indigo-400 hover:text-indigo-300"
        >
          ← В редактор
        </Link>
      </div>
      <PreviewRenderer content={content} />
    </div>
  );
}
