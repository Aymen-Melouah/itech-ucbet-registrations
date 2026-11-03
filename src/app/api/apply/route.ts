import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  throw new Error("Missing Supabase server environment variables");
}

const supabase = createClient(
  supabaseUrl,
  supabaseSecretKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }
);

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const row = {
    lang: b.lang === "ar" ? "ar" : "en",
    full_name: str(b.name),
    email: str(b.email),
    phone: str(b.phone),
    faculty: str(b.faculty),
    department: str(b.department),
    level: str(b.level),
    letter: str(b.letter),
  };

  // Same rules as the form, checked again on the server.
  const valid =
    row.full_name.length >= 3 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(row.email) &&
    /^(?:\+213|00213|0)[567]\d{8}$/.test(row.phone.replace(/[\s.\-()]/g, "")) &&
    row.faculty &&
    row.department &&
    ["L1", "L2", "L3", "M1", "M2"].includes(row.level) &&
    row.letter.length >= 100 &&
    row.letter.length <= 1500;

  if (!valid) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  const { error } = await supabase.from("applications").insert(row);
  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not save" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}