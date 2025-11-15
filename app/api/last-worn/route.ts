import { supabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = supabaseServerClient();
  const { searchParams } = new URL(request.url);

  const user_id = searchParams.get("user_id");
  if (!user_id) {
    return Response.json({ error: "user_id is required" }, { status: 400 });
  }

  // Get last worn for each garment
  const { data, error } = await supabase
    .from("wear_events")
    .select("garment_id, worn_at")
    .eq("user_id", user_id)
    .order("worn_at", { ascending: false });

  if (error) return Response.json({ error }, { status: 500 });

  // Convert to dictionary: { garment_id: lastWornDate }
  const lastWornMap: Record<string, string> = {};

  data.forEach((event) => {
    if (!lastWornMap[event.garment_id]) {
      lastWornMap[event.garment_id] = event.worn_at;
    }
  });

  return Response.json(lastWornMap);
}
