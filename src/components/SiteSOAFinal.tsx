"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, ClipboardList, TrendingUp, X, Users, GraduationCap } from "lucide-react";
import ReactMarkdown, { Components as MarkdownComponents } from "react-markdown";
import remarkGfm from "remark-gfm";

type CardKey = "manager" | "consultants" | "atelier" | "formation" | "next";

type Card = {
  key: CardKey;
  title: string;
  file?: string;
  icon: React.ComponentType<{ className?: string }>;
};

const cards: Card[] = [
  { key: "manager", title: "Constat De Début de Parcours", file: "/docs/constat-de-depart.md", icon: FileText },
  { key: "consultants", title: "Situation Individuelle de Départ", icon: Users },
  { key: "atelier", title: "Atelier Plan de Vente", file: "/docs/atelier-plan-de-vente.md", icon: ClipboardList },
  { key: "formation", title: "Journée de Formation", file: "/docs/formation-avant-vente.md", icon: GraduationCap },
  { key: "next", title: "Next Steps", file: "/docs/next-steps.md", icon: TrendingUp },
];

const consultants = [
  { slug: "christoph", name: "Christoph", file: "/docs/consultants/christoph.md" },
  { slug: "david-sanaphonh", name: "David SANAPHONH", file: "/docs/consultants/david-sanaphonh.md" },
  { slug: "galien", name: "Galien", file: "/docs/consultants/galien.md" },
  { slug: "macha", name: "Macha", file: "/docs/consultants/macha.md" },
  { slug: "raphael-lacan", name: "Raphaël LACAN", file: "/docs/consultants/raphael-lacan.md" },
  { slug: "thibault", name: "Thibault", file: "/docs/consultants/thibault.md" },
];

export default function SiteSOAFinal(): JSX.Element {
  const [active, setActive] = useState<CardKey | null>(null);
  const [content, setContent] = useState<string>("");
  const [activeConsultant, setActiveConsultant] = useState<string | null>(null);
  const [consultantContent, setConsultantContent] = useState<string>("");

  const mdComponents: MarkdownComponents = {
    h1: ({ children }) => (
      <h1 className="text-2xl sm:text-3xl font-bold mt-6 mb-3 border-b border-white/10 pb-2 text-white">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl sm:text-2xl font-semibold mt-6 mb-3 border-b border-white/10 pb-2 text-white">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg sm:text-xl font-semibold mt-5 mb-2 text-white">
        {children}
      </h3>
    ),
    p: ({ children }) => <p className="my-3 leading-relaxed text-white/90">{children}</p>,
    ul: ({ children }) => (
      <ul className="list-disc ml-6 my-4 space-y-1 text-white/90">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal ml-6 my-4 space-y-1 text-white/90">{children}</ol>
    ),
    li: ({ children }) => <li className="marker:text-white/60">{children}</li>,
    strong: ({ children }) => <strong className="text-white">{children}</strong>,
    em: ({ children }) => <em className="italic text-white/90">{children}</em>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-white/20 pl-4 my-4 text-white/80 italic">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="my-6 border-white/10" />,
  };

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  // Ouvre automatiquement la bonne carte si l'URL contient ?open=slug
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const open = params.get("open");
    if (open === "manager" || open === "atelier" || open === "formation" || open === "next") {
      setActive(open as CardKey);
    } else if (open === "consultants") {
      setActive("consultants");
    }
  }, []);

  useEffect(() => {
    async function load() {
      if (!active) return setContent("");
      const file = cards.find((c) => c.key === active)?.file;
      if (!file) return setContent("");
      try {
        const res = await fetch(file);
        const text = await res.text();
        setContent(text);
      } catch {
        setContent("Impossible de charger le document.");
      }
    }
    void load();
  }, [active]);

  useEffect(() => {
    async function loadConsultant() {
      if (!activeConsultant) return setConsultantContent("");
      const file = consultants.find((c) => c.slug === activeConsultant)?.file;
      if (!file) return setConsultantContent("");
      try {
        const res = await fetch(file);
        const text = await res.text();
        setConsultantContent(text);
      } catch {
        setConsultantContent("Impossible de charger la fiche consultant.");
      }
    }
    void loadConsultant();
  }, [activeConsultant]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#002B49] via-[#003B5C] to-[#001A26] text-white">
      <header className="max-w-6xl mx-auto p-10 mb-6 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#00AEEF] to-cyan-300">
          Dossier d’accompagnement — SOA People
        </h1>
        <p className="text-white/70 max-w-3xl mx-auto text-lg">
          Une restitution structurée et élégante, présentée avec une esthétique inspirée de la charte graphique de SOA People.
        </p>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 px-10">
        {cards.map((card, index) => (
          <motion.div
            key={card.key}
            onClick={() => setActive(card.key)}
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(0,174,239,0.45)" }}
            whileTap={{ scale: 0.97 }}
            className="cursor-pointer p-10 rounded-3xl bg-white/5 hover:bg-[#00AEEF]/10 transition border border-white/10 flex flex-col items-start shadow-xl"
          >
            <card.icon className="h-10 w-10 mb-6 text-[#00AEEF]" aria-hidden="true" />
            <h2 className="text-2xl font-semibold mb-3">{card.title}</h2>
            <p className="text-sm text-white/60">Cliquez pour consulter</p>
            <div className="mt-6 text-xs text-white/40">{index + 1}/{cards.length}</div>
          </motion.div>
        ))}
      </main>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="bg-neutral-900 rounded-3xl p-10 max-w-2xl w-full shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActive(null)}
                className="absolute top-6 right-6 text-white/60 hover:text-white"
                aria-label="Fermer"
              >
                <X className="h-7 w-7" />
              </button>
              <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#00AEEF] to-cyan-300">
                {cards.find((c) => c.key === active)?.title}
              </h2>
              {active === "consultants" ? (
                <div className="space-y-3">
                  {consultants.map((c) => (
                    <button
                      key={c.slug}
                      onClick={() => setActiveConsultant(c.slug)}
                      className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-[#00AEEF]/10 transition border border-white/10"
                    >
                      <span className="text-white/90 font-medium">{c.name}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <>
                  <div className="max-h-[60vh] overflow-y-auto pr-2 text-sm sm:text-base">
                    <ReactMarkdown components={mdComponents} remarkPlugins={[remarkGfm]}>
                      {content}
                    </ReactMarkdown>
                  </div>
                  {cards.find((c) => c.key === active)?.file && (
                    <a
                      href={`/doc/${active}`}
                      className="mt-8 inline-block px-6 py-3 rounded-xl bg-[#00AEEF]/20 hover:bg-[#00AEEF]/30 transition border border-[#00AEEF]/40 text-[#00AEEF] font-semibold"
                    >
                      Lire le document complet
                    </a>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sous-modale consultant */}
      <AnimatePresence>
        {activeConsultant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveConsultant(null)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="bg-neutral-900 rounded-3xl p-10 max-w-2xl w-full shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveConsultant(null)}
                className="absolute top-6 right-6 text-white/60 hover:text-white"
                aria-label="Fermer"
              >
                <X className="h-7 w-7" />
              </button>
              <h3 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#00AEEF] to-cyan-300">
                {consultants.find((c) => c.slug === activeConsultant)?.name}
              </h3>
              <div className="max-h-[60vh] overflow-y-auto pr-2 text-sm sm:text-base">
                <ReactMarkdown components={mdComponents} remarkPlugins={[remarkGfm]}>
                  {consultantContent}
                </ReactMarkdown>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mt-20 text-center text-white/50 text-sm p-6">
        © {new Date().getFullYear()} — SOA People
      </footer>
    </div>
  );
}


