import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PreviewRenderer } from "@/components/PreviewRenderer";
import { api } from "@/lib/api";
import { useEditorStore } from "@/stores/editorStore";
import type { PageContent } from "@/types";

export function EditorPage() {
  const { id } = useParams();
  const pid = Number(id);
  const load = useEditorStore((s) => s.load);
  const draft = useEditorStore((s) => s.draft);
  const project = useEditorStore((s) => s.project);
  const saving = useEditorStore((s) => s.saving);
  const err = useEditorStore((s) => s.error);
  const updateHero = useEditorStore((s) => s.updateHero);
  const updateText = useEditorStore((s) => s.updateText);
  const save = useEditorStore((s) => s.save);
  const reset = useEditorStore((s) => s.reset);

  const [aiOut, setAiOut] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (!Number.isFinite(pid)) return;
    void load(pid);
    return () => reset();
  }, [pid, load, reset]);

  async function onAi() {
    setAiLoading(true);
    setAiOut("");
    try {
      const r = await api.aiGenerate("Сгенерируй текст для лендинга");
      setAiOut(r.text);
    } catch {
      setAiOut("Ошибка запроса");
    } finally {
      setAiLoading(false);
    }
  }

  if (!Number.isFinite(pid)) {
    return <p className="text-slate-400">Некорректный id</p>;
  }

  if (!draft || !project) {
    return <p className="text-slate-400">Загрузка редактора…</p>;
  }

  const content = draft as PageContent;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">{project.name}</h1>
          <p className="text-sm text-slate-400">JSON: hero и text блоки</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to={`/preview/${project.id}`}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
          >
            Превью
          </Link>
          <button
            type="button"
            disabled={saving}
            onClick={() => void save()}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {saving ? "Сохранение…" : "Сохранить"}
          </button>
        </div>
      </div>

      {err && <p className="text-sm text-red-400">{err}</p>}

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <h2 className="text-lg font-medium text-white">Редактирование</h2>
          {content.blocks.map((b, i) => {
            if (b.type === "hero") {
              return (
                <div key={i} className="space-y-3 rounded-lg border border-slate-800 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Hero</p>
                  <input
                    className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                    value={b.title}
                    onChange={(e) => updateHero(i, e.target.value, b.subtitle)}
                  />
                  <input
                    className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                    value={b.subtitle}
                    onChange={(e) => updateHero(i, b.title, e.target.value)}
                  />
                </div>
              );
            }
            if (b.type === "text") {
              return (
                <div key={i} className="space-y-3 rounded-lg border border-slate-800 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Text</p>
                  <textarea
                    rows={5}
                    className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                    value={b.body}
                    onChange={(e) => updateText(i, e.target.value)}
                  />
                </div>
              );
            }
            return null;
          })}

          <div className="rounded-lg border border-dashed border-slate-700 p-4">
            <p className="text-sm text-slate-400">AI (mock)</p>
            <button
              type="button"
              onClick={() => void onAi()}
              disabled={aiLoading}
              className="mt-2 rounded-md bg-violet-600 px-3 py-1.5 text-sm text-white hover:bg-violet-500 disabled:opacity-50"
            >
              {aiLoading ? "…" : "Вызвать /ai/generate"}
            </button>
            {aiOut && <p className="mt-3 text-sm text-slate-300">{aiOut}</p>}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6">
          <h2 className="mb-4 text-lg font-medium text-white">Живое превью</h2>
          <PreviewRenderer content={content} />
        </div>
      </div>
    </div>
  );
}
