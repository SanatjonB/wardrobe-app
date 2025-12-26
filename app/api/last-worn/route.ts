import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await supabaseServerClient();
    const { searchParams } = new URL(request.url);

    const user_id = searchParams.get("user_id");
    if (!user_id) {
      return NextResponse.json(
        { error: "user_id is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("wear_events")
      .select("garment_id,worn_at")
      .eq("user_id", user_id)
      .order("worn_at", { ascending: false });

    if (error) return NextResponse.json({ error }, { status: 500 });

    const map: Record<string, string> = {};
    for (const row of data ?? []) {
      if (!map[row.garment_id]) map[row.garment_id] = row.worn_at;
    }

    return NextResponse.json(map);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return NextResponse.json(
      { error: "Unhandled error", details: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}
