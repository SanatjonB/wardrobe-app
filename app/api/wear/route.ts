import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await supabaseServerClient();
    const body = await request.json();

    const { user_id, garment_id } = body ?? {};
    if (!user_id || !garment_id) {
      return NextResponse.json(
        { error: "user_id and garment_id are required" },
        { status: 400 }
      );
    }

    // If your DB doesn't auto-set worn_at, uncomment the next line:
    // const worn_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("wear_events")
      .insert({
        user_id,
        garment_id,
        // worn_at,
      })
      .select("*")
      .single();

    if (error) return NextResponse.json({ error }, { status: 500 });

    return NextResponse.json({ success: true, event: data });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return NextResponse.json(
      { error: "Unhandled error", details: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}
