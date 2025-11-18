import { supabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = supabaseServerClient();
  const { searchParams } = new URL(request.url);

  const user_id = searchParams.get("user_id");

  if (!user_id) {
    return Response.json({ error: "user_id is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("wear_events")
    .select("garment_id")
    .eq("user_id", user_id);

  if (error) {
    return Response.json({ error }, { status: 500 });
  }

  const wearCounts: Record<string, number> = {};

  data.forEach((event) => {
    wearCounts[event.garment_id] = (wearCounts[event.garment_id] || 0) + 1;
  });

  return Response.json(wearCounts);
}
