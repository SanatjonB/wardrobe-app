import { supabaseServerClient } from "@/lib/supabase/server";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // 👈 FIX HERE

  const supabase = supabaseServerClient();

  const { error } = await supabase.from("garments").delete().eq("id", id);

  if (error) return Response.json({ error }, { status: 500 });

  return Response.json({ success: true });
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // 👈 FIX HERE

  const body = await request.json();
  const supabase = supabaseServerClient();

  const { error } = await supabase.from("garments").update(body).eq("id", id);

  if (error) return Response.json({ error }, { status: 500 });

  return Response.json({ success: true });
}
