import React from "react";
import Link from "next/link";
import ReactMarkdown, { Components as MarkdownComponents } from "react-markdown";
import remarkGfm from "remark-gfm";
import { promises as fs } from "fs";
import path from "path";

const slugToFile: Record<string, string> = {
  manager: "docs/constat-de-depart.md",
  atelier: "docs/atelier-plan-de-vente.md",
  formation: "docs/formation-avant-vente.md",
  next: "docs/next-steps.md",
};

async function readMarkdown(relPath: string): Promise<string> {
  const fullPath = path.join(process.cwd(), "public", relPath);
  try {
    return await fs.readFile(fullPath, "utf-8");
  } catch {
    return "Document introuvable.";
  }
}

export const runtime = "nodejs";

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const relFile = slugToFile[slug];
  const md = relFile ? await readMarkdown(relFile) : "Document introuvable.";

  const mdComponents: MarkdownComponents = {
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold mt-8 mb-4 border-b border-white/10 pb-3 text-white">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-semibold mt-8 mb-3 border-b border-white/10 pb-2 text-white">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold mt-6 mb-2 text-white">{children}</h3>
    ),
    p: ({ children }) => <p className="my-4 leading-relaxed text-white/90">{children}</p>,
    ul: ({ children }) => (
      <ul className="list-disc ml-6 my-4 space-y-2 text-white/90">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal ml-6 my-4 space-y-2 text-white/90">{children}</ol>
    ),
    li: ({ children }) => <li className="marker:text-white/60">{children}</li>,
    strong: ({ children }) => <strong className="text-white">{children}</strong>,
    hr: () => <hr className="my-8 border-white/10" />,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#002B49] via-[#003B5C] to-[#001A26] text-white">
      <main className="max-w-3xl mx-auto p-8 sm:p-12">
        <div className="mb-6">
          <Link
            href={`/?open=${slug}`}
            className="inline-flex items-center gap-2 text-[#00AEEF] hover:text-cyan-300 border border-[#00AEEF]/40 hover:border-cyan-300/50 rounded-xl px-4 py-2 bg-[#00AEEF]/10 transition"
          >
            <span className="text-xl leading-none">←</span>
            Revenir aux cartes
          </Link>
        </div>
        <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#00AEEF] to-cyan-300">
          {slug === "manager"
            ? "Constat De Début de Parcours"
            : slug === "atelier"
            ? "Atelier Plan de Vente"
            : slug === "formation"
            ? "Journée de Formation"
            : slug === "next"
            ? "Next Steps"
            : "Document"}
        </h1>
        <div className="max-w-none text-base">
          <ReactMarkdown components={mdComponents} remarkPlugins={[remarkGfm]}>
            {md}
          </ReactMarkdown>
        </div>
      </main>
    </div>
  );
}


