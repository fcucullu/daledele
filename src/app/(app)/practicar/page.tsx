"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Star, Bell } from "lucide-react";
import { CATEGORIES } from "@/lib/exercises";

export default function PracticarPage() {
  const supabase = createClient();
  const [progress, setProgress] = useState<Record<string, { stars: number; times_played: number }>>({});
  const [pushStatus, setPushStatus] = useState<"unknown" | "granted" | "denied" | "unsupported">("unknown");

  useEffect(() => {
    loadProgress();
    checkPushStatus();
  }, []);

  const loadProgress = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("daledele_progress").select("*").eq("user_id", user.id);
    const map: Record<string, any> = {};
    data?.forEach((p) => { map[p.category] = p; });
    setProgress(map);
  };

  const checkPushStatus = () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
      setPushStatus("unsupported"); return;
    }
    if (Notification.permission === "granted") setPushStatus("granted");
    else if (Notification.permission === "denied") setPushStatus("denied");
  };

  const enableNotifications = async () => {
    const result = await Notification.requestPermission();
    if (result !== "granted") { setPushStatus("denied"); return; }

    try {
      const reg = await navigator.serviceWorker.ready;
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) return;

      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: vapidKey });
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await fetch("/api/push", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, subscription: sub.toJSON() }),
      });

      setPushStatus("granted");
    } catch {}
  };

  return (
    <div>
      <div className="text-center mb-8">
        <div className="text-5xl mb-2">🦐</div>
        <h1 className="text-3xl font-bold spanish-shimmer mb-1">DaleDele</h1>
        <p className="text-sm text-muted">Practica español nivel DELE B2</p>
      </div>

      {/* Push notification opt-in */}
      {pushStatus === "unknown" && (
        <button onClick={enableNotifications}
          className="w-full mb-4 bg-spanish/10 border border-spanish/30 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-spanish" />
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">Recordatorios de práctica</p>
              <p className="text-xs text-muted">Recibe una notificación cada 12 horas</p>
            </div>
          </div>
          <span className="text-spanish text-sm font-medium">Activar</span>
        </button>
      )}

      {pushStatus === "granted" && (
        <div className="w-full mb-4 bg-green-500/10 border border-green-500/20 rounded-xl p-3 flex items-center gap-3">
          <Bell className="w-4 h-4 text-green-400" />
          <p className="text-xs text-green-400">Recordatorios activados ✓</p>
        </div>
      )}

      <div className="space-y-3">
        {CATEGORIES.map((cat) => {
          const p = progress[cat.id];
          const stars = p?.stars || 0;
          const played = p?.times_played || 0;

          return (
            <Link key={cat.id} href={`/practicar/${cat.id}`}
              className="block bg-surface rounded-xl p-4 border border-border hover:border-spanish/30 transition-all active:scale-[0.98]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{cat.emoji}</span>
                  <div>
                    <h3 className="font-semibold text-foreground">{cat.name}</h3>
                    <p className="text-xs text-muted">{cat.description}{played > 0 ? ` · ${played}x` : ""}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 items-center">
                  {[1, 2, 3].map((s) => (
                    <Star key={s} className={`w-4 h-4 ${s <= stars ? "text-spanish fill-spanish" : "text-border"}`} />
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <Link href="/practicar/desafio"
        className="block mt-6 bg-spanish/10 border border-spanish/30 rounded-2xl p-4 text-center hover:bg-spanish/20 transition-colors">
        <span className="text-2xl block mb-1">🎯</span>
        <span className="font-bold text-spanish">Modo Desafío</span>
        <p className="text-xs text-muted mt-1">10 preguntas aleatorias de todas las categorías</p>
      </Link>
    </div>
  );
}
