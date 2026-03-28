"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES } from "@/lib/exercises";

interface Progress { category: string; stars: number; best_streak: number; times_played: number; }

const TROPHIES = [
  { id: "first", emoji: "🌟", name: "Primer Paso", desc: "Completa tu primera categoría", check: (p: Progress[]) => p.length >= 1 },
  { id: "half", emoji: "🏅", name: "A Medio Camino", desc: `Completa ${Math.ceil(CATEGORIES.length / 2)} categorías`, check: (p: Progress[]) => p.length >= Math.ceil(CATEGORIES.length / 2) },
  { id: "all", emoji: "🏆", name: "Maestro DELE", desc: "Completa todas las categorías", check: (p: Progress[]) => p.length >= CATEGORIES.length },
  { id: "perfect1", emoji: "💎", name: "Perfección", desc: "3 estrellas en una categoría", check: (p: Progress[]) => p.some((x) => x.stars === 3) },
  { id: "perfectAll", emoji: "👑", name: "¡Dale Dele!", desc: "3 estrellas en TODAS las categorías", check: (p: Progress[]) => p.filter((x) => x.stars === 3).length >= CATEGORIES.length },
  { id: "streak5", emoji: "🔥", name: "En Racha", desc: "5 respuestas correctas seguidas", check: (p: Progress[]) => p.some((x) => x.best_streak >= 5) },
  { id: "streak10", emoji: "⚡", name: "Imparable", desc: "10 respuestas correctas seguidas", check: (p: Progress[]) => p.some((x) => x.best_streak >= 10) },
  { id: "practice10", emoji: "📚", name: "Estudiante", desc: "Juega 10 veces en total", check: (p: Progress[]) => p.reduce((s, x) => s + (x.times_played || 0), 0) >= 10 },
  { id: "practice50", emoji: "🎓", name: "Graduado", desc: "Juega 50 veces en total", check: (p: Progress[]) => p.reduce((s, x) => s + (x.times_played || 0), 0) >= 50 },
  { id: "polyglot", emoji: "🌍", name: "Bilingüe", desc: "Juega 100 veces en total", check: (p: Progress[]) => p.reduce((s, x) => s + (x.times_played || 0), 0) >= 100 },
];

export default function TrofeosPage() {
  const supabase = createClient();
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadProgress(); }, []);
  const loadProgress = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    const { data } = await supabase.from("daledele_progress").select("*").eq("user_id", user.id);
    setProgress(data ?? []); setLoading(false);
  };

  const totalStars = progress.reduce((s, p) => s + p.stars, 0);
  const unlocked = TROPHIES.filter((t) => t.check(progress)).length;

  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold spanish-shimmer mb-1">Trofeos</h1>
        <p className="text-sm text-muted">{unlocked}/{TROPHIES.length} desbloqueados · ⭐ {totalStars}/{CATEGORIES.length * 3}</p>
      </div>
      {loading ? <p className="text-center text-muted text-sm py-8">Cargando...</p> : (
        <div className="space-y-3">
          {TROPHIES.map((t) => {
            const u = t.check(progress);
            return (
              <div key={t.id} className={`bg-surface rounded-xl p-4 border flex items-center gap-4 ${u ? "border-spanish/30" : "border-border opacity-40"}`}>
                <span className={`text-3xl ${u ? "" : "grayscale"}`}>{t.emoji}</span>
                <div><h3 className="font-medium text-foreground text-sm">{t.name}</h3><p className="text-xs text-muted">{t.desc}</p></div>
                {u && <span className="ml-auto text-spanish text-sm">✓</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
