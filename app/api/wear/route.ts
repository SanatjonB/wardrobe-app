import { supabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = supabaseServerClient();
  const body = await request.json();

  const { user_id, garment_id } = body;

  if (!user_id || !garment_id) {
    return Response.json(
      { error: "user_id and garment_id are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("wear_events")
    .insert({
      user_id,
      garment_id,
    })
    .select("*")
    .single();

  if (error) {
    return Response.json({ error }, { status: 500 });
  }

  return Response.json({ success: true, event: data });
}
