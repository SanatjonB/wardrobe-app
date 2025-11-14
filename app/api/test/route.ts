import { supabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = supabaseServerClient();

  const { data, error } = await supabase.from("categories").select("*");

  if (error) {
    return Response.json({ error }, { status: 500 });
  }

  return Response.json(data);
}
