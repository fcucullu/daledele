import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";

function getSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

function setupVapid() {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:francisco@franciscocucullu.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );
}

// PUT: register push subscription
export async function PUT(request: Request) {
  const { userId, subscription } = await request.json();
  if (!userId || !subscription) return NextResponse.json({ error: "Missing data" }, { status: 400 });

  const supabase = getSupabase();
  await supabase.from("daledele_push_subs").upsert({
    user_id: userId,
    endpoint: subscription.endpoint,
    keys_p256dh: subscription.keys.p256dh,
    keys_auth: subscription.keys.auth,
  }, { onConflict: "endpoint" });

  return NextResponse.json({ ok: true });
}

// POST: send push to all subscribers (used by cron)
export async function POST(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && !process.env.VERCEL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  setupVapid();
  const supabase = getSupabase();
  const { data: subs } = await supabase.from("daledele_push_subs").select("*");

  if (!subs || subs.length === 0) return NextResponse.json({ sent: 0 });

  const messages = [
    "¡Hora de practicar español! 🇪🇸",
    "¡Dale, que el subjuntivo no se aprende solo! 🎭",
    "¿Estaba o estuvo? Practica ahora 🔄",
    "Tu racha de español te espera 🔥",
    "¡No dejes que el DELE te gane! 💪",
  ];
  const body = messages[Math.floor(Math.random() * messages.length)];

  const payload = JSON.stringify({
    title: "DaleDele 🦐",
    body,
    icon: "/icons/icon-192.png",
    url: "/practicar",
  });

  let sent = 0;
  for (const sub of subs) {
    try {
      await webpush.sendNotification({
        endpoint: sub.endpoint,
        keys: { p256dh: sub.keys_p256dh, auth: sub.keys_auth },
      }, payload);
      sent++;
    } catch (err: any) {
      if (err.statusCode === 404 || err.statusCode === 410) {
        await supabase.from("daledele_push_subs").delete().eq("id", sub.id);
      }
    }
  }

  return NextResponse.json({ sent });
}
