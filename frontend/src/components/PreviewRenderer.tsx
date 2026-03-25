import type { PageContent } from "@/types";

export function PreviewRenderer({ content }: { content: PageContent }) {
  return (
    <div className="space-y-8">
      {content.blocks.map((b, i) => {
        if (b.type === "hero") {
          return (
            <section
              key={i}
              className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 px-8 py-16 text-center shadow-xl"
            >
              <h1 className="text-4xl font-bold tracking-tight text-white">{b.title}</h1>
              <p className="mt-4 text-lg text-indigo-100">{b.subtitle}</p>
            </section>
          );
        }
        if (b.type === "text") {
          return (
            <section key={i} className="prose prose-invert max-w-none">
              <p className="whitespace-pre-wrap text-slate-200 leading-relaxed">{b.body}</p>
            </section>
          );
        }
        return null;
      })}
    </div>
  );
}
