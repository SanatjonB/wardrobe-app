import { supabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await supabaseServerClient();
  const { searchParams } = new URL(request.url);

  const user_id = searchParams.get("user_id");
  if (!user_id) {
    return Response.json({ error: "user_id is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("garments")
    .select("*")
    .eq("user_id", user_id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) return Response.json({ error }, { status: 500 });
  return Response.json(data ?? []);
}

export async function POST(request: Request) {
  const supabase = await supabaseServerClient();
  const body = await request.json();

  const requiredFields = ["user_id", "name", "category_id", "image_url"];
  for (const field of requiredFields) {
    if (!body[field]) {
      return Response.json({ error: `${field} is required` }, { status: 400 });
    }
  }

  const { data, error } = await supabase
    .from("garments")
    .insert({
      user_id: body.user_id,
      name: body.name,
      category_id: body.category_id,
      brand: body.brand || null,
      color: body.color || null,
      size: body.size || null,
      season: body.season || null,
      image_url: body.image_url,
      purchase_date: body.purchase_date || null,
      purchase_price: body.purchase_price || null,
    })
    .select("*")
    .single();

  if (error) return Response.json({ error }, { status: 500 });
  return Response.json(data, { status: 201 });
}
