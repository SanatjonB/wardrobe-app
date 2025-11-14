import { supabaseServerClient } from "@/lib/supabase/server";

// =========================
// GET /api/garments
// List all garments for a user
// =========================
export async function GET(request: Request) {
  const supabase = supabaseServerClient();
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

  return Response.json(data);
}

// =========================
// POST /api/garments
// Create a new garment
// =========================
export async function POST(request: Request) {
  const supabase = supabaseServerClient();
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

// =========================
// PUT /api/garments?id=123
// Update garment
// =========================
export async function PUT(request: Request) {
  const supabase = supabaseServerClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json({ error: "id is required" }, { status: 400 });
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from("garments")
    .update(body)
    .eq("id", id)
    .select("*")
    .single();

  if (error) return Response.json({ error }, { status: 500 });

  return Response.json(data);
}

// =========================
// DELETE /api/garments?id=123
// Soft delete (is_active = false)
// =========================
export async function DELETE(request: Request) {
  const supabase = supabaseServerClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json({ error: "id is required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("garments")
    .update({ is_active: false })
    .eq("id", id);

  if (error) return Response.json({ error }, { status: 500 });

  return Response.json({ message: "Garment deleted" });
}
