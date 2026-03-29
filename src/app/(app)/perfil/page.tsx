"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut, Bell, BellOff } from "lucide-react";
import { CATEGORIES } from "@/lib/exercises";

interface Progress {
  category: string;
  stars: number;
  best_streak: number;
  times_played: number;
  last_score: number;
}

export default function PerfilPage() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [pushStatus, setPushStatus] = useState<"unknown" | "granted" | "denied" | "unsupported">("unknown");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    checkPush();
  }, []);

  const loadData = async () => {
    const { data: { user: u } } = await supabase.auth.getUser();
    setUser(u);
    if (!u) { setLoading(false); return; }

    const { data } = await supabase.from("daledele_progress").select("*").eq("user_id", u.id);
    setProgress(data ?? []);
    setLoading(false);
  };

  const checkPush = async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
      setPushStatus("unsupported"); return;
    }
    if (Notification.permission === "denied") { setPushStatus("denied"); return; }
    // Check if there's an active push subscription (not just permission)
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      setPushStatus(sub ? "granted" : "unknown");
    } catch {
      setPushStatus("unknown");
    }
  };

  const [pushError, setPushError] = useState<string | null>(null);
  const [pushLoading, setPushLoading] = useState(false);

  const enablePush = async () => {
    setPushError(null);
    setPushLoading(true);
    try {
      // Step 1: Request permission
      setPushError("Paso 1: pidiendo permiso...");
      const result = await Notification.requestPermission();
      if (result !== "granted") { setPushStatus("denied"); setPushError(`Permiso: ${result}`); setPushLoading(false); return; }

      // Step 2: Get service worker
      setPushError("Paso 2: esperando service worker...");
      const reg = await Promise.race([
        navigator.serviceWorker.ready,
        new Promise((_, reject) => setTimeout(() => reject(new Error("SW timeout (5s)")), 5000))
      ]) as ServiceWorkerRegistration;

      // Step 3: Subscribe to push
      setPushError("Paso 3: suscribiendo push...");
      const vapidKey = "BGzjcgYA1QRmRKc-mZ8REkjyz3mbmZJVzZGmgxQ780ZWV5Glj3JbXcIoProXoStyGXH5LYVn2d5eR8sJH_QxrMI";
      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: vapidKey });
      }

      // Step 4: Register in DB
      setPushError("Paso 4: guardando en servidor...");
      if (!user) { setPushError("Usuario no autenticado"); setPushLoading(false); return; }
      const res = await fetch("/api/push", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, subscription: sub.toJSON() }),
      });

      if (!res.ok) { setPushError(`Error del servidor: ${res.status}`); setPushLoading(false); return; }

      setPushError(null);
      setPushStatus("granted");
    } catch (err: any) {
      setPushError(`Error: ${err.message || "desconocido"}`);
    }
    setPushLoading(false);
  };

  const disablePush = async () => {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await sub.unsubscribe();
        if (user) {
          await supabase.from("daledele_push_subs").delete().eq("user_id", user.id);
        }
      }
    } catch {}
    setPushStatus("unknown");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // Stats calculations
  const totalPlayed = progress.reduce((s, p) => s + p.times_played, 0);
  const totalStars = progress.reduce((s, p) => s + p.stars, 0);
  const maxStars = CATEGORIES.length * 3;
  const categoriesCompleted = progress.length;
  const bestStreak = progress.reduce((max, p) => Math.max(max, p.best_streak), 0);

  // Per-category accuracy — cap at 100%
  const categoryStats = CATEGORIES.map(cat => {
    const p = progress.find(pr => pr.category === cat.id);
    if (!p) return { ...cat, accuracy: null, played: 0, stars: 0 };
    const accuracy = p.last_score ? Math.min(100, Math.round((p.last_score / 10) * 100)) : null;
    return { ...cat, accuracy, played: p.times_played, stars: p.stars };
  });

  // Sort by accuracy ascending (weakest first), unplayed at bottom
  const sortedStats = [...categoryStats].sort((a, b) => {
    if (a.accuracy === null && b.accuracy === null) return 0;
    if (a.accuracy === null) return 1;
    if (b.accuracy === null) return -1;
    return a.accuracy - b.accuracy;
  });

  const weakest = sortedStats.filter(c => c.accuracy !== null);

  const displayName = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "Usuario";

  return (
    <div>
      <div className="text-center mb-6">
        <div className="text-5xl mb-2">👤</div>
        <h1 className="text-2xl font-bold text-foreground">{displayName}</h1>
        <p className="text-xs text-muted">{user?.email}</p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-surface rounded-xl p-3 border border-border text-center">
          <p className="text-2xl font-bold text-spanish">{totalPlayed}</p>
          <p className="text-xs text-muted">Partidas jugadas</p>
        </div>
        <div className="bg-surface rounded-xl p-3 border border-border text-center">
          <p className="text-2xl font-bold text-spanish">{totalStars}/{maxStars}</p>
          <p className="text-xs text-muted">Estrellas</p>
        </div>
        <div className="bg-surface rounded-xl p-3 border border-border text-center">
          <p className="text-2xl font-bold text-spanish">{categoriesCompleted}/{CATEGORIES.length}</p>
          <p className="text-xs text-muted">Categorías completadas</p>
        </div>
        <div className="bg-surface rounded-xl p-3 border border-border text-center">
          <p className="text-2xl font-bold text-spanish">🔥 {bestStreak}</p>
          <p className="text-xs text-muted">Mejor racha</p>
        </div>
      </div>

      {/* Accuracy per category */}
      <div className="bg-surface rounded-xl border border-border p-4 mb-4">
        <h2 className="text-sm font-semibold text-foreground mb-3">Acierto por categoría</h2>
        {loading ? <p className="text-xs text-muted">Cargando...</p> : (
          <div className="space-y-2">
            {sortedStats.map(cat => (
              <div key={cat.id} className="flex items-center gap-3">
                <span className="text-lg">{cat.emoji}</span>
                <span className="text-xs text-foreground flex-1">{cat.name}</span>
                {cat.accuracy !== null ? (
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{
                        width: `${cat.accuracy}%`,
                        backgroundColor: cat.accuracy >= 80 ? '#10B981' : cat.accuracy >= 50 ? '#F59E0B' : '#EF4444'
                      }} />
                    </div>
                    <span className={`text-xs font-medium w-8 text-right ${
                      cat.accuracy >= 80 ? 'text-green-400' : cat.accuracy >= 50 ? 'text-yellow-400' : 'text-red-400'
                    }`}>{cat.accuracy}%</span>
                  </div>
                ) : (
                  <span className="text-xs text-muted">Sin datos</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Weakest area suggestion */}
      {weakest.length > 0 && weakest[0].accuracy !== null && weakest[0].accuracy < 80 && (
        <div className="bg-spanish/10 border border-spanish/30 rounded-xl p-3 mb-4">
          <p className="text-sm text-foreground">💡 <strong>Sugerencia:</strong> Practica más <strong>{weakest[0].name}</strong> — es tu categoría más débil ({weakest[0].accuracy}% de acierto).</p>
        </div>
      )}

      {/* Notifications */}
      <div className="bg-surface rounded-xl border border-border p-4 mb-4">
        <h2 className="text-sm font-semibold text-foreground mb-3">Notificaciones</h2>
        {pushStatus === "granted" ? (
          <button onClick={disablePush} className="flex items-center gap-3 w-full">
            <Bell className="w-4 h-4 text-green-400" />
            <div className="text-left flex-1">
              <p className="text-sm text-green-400">Recordatorios activados ✓</p>
              <p className="text-xs text-muted">Notificación diaria a las 22:00</p>
            </div>
            <span className="text-red-400 text-xs font-medium">Desactivar</span>
          </button>
        ) : pushStatus === "denied" ? (
          <div className="flex items-center gap-3">
            <BellOff className="w-4 h-4 text-muted" />
            <p className="text-xs text-muted">Notificaciones bloqueadas. Actívalas desde la configuración del navegador.</p>
          </div>
        ) : pushStatus === "unsupported" ? (
          <p className="text-xs text-muted">Tu navegador no soporta notificaciones push.</p>
        ) : (
          <button onClick={enablePush} disabled={pushLoading} className="flex items-center gap-3 w-full">
            <Bell className="w-4 h-4 text-spanish" />
            <div className="text-left flex-1">
              <p className="text-sm text-foreground">Activar recordatorios</p>
              <p className="text-xs text-muted">Una notificación diaria a las 22:00</p>
            </div>
            <span className="text-spanish text-sm font-medium">{pushLoading ? "Activando..." : "Activar"}</span>
          </button>
        )}
        {pushError && (
          <p className="text-xs text-red-400 mt-2">Error: {pushError}</p>
        )}
        <p className="text-[10px] text-muted/40 mt-1">Estado: {pushStatus} | SW: {"serviceWorker" in navigator ? "sí" : "no"} | Push: {"PushManager" in window ? "sí" : "no"}</p>
      </div>

      {/* Sign out */}
      <button onClick={handleSignOut}
        className="w-full bg-surface rounded-xl border border-border p-4 flex items-center gap-3 text-red-400">
        <LogOut className="w-4 h-4" />
        <span className="text-sm font-medium">Cerrar sesión</span>
      </button>
    </div>
  );
}
