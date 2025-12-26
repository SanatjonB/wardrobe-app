import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabase/server";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const supabase = await supabaseServerClient();

  const { error } = await supabase
    .from("garments")
    .update({ is_active: false })
    .eq("id", id);

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function PUT(req: Request, { params }: Ctx) {
  const { id } = await params;
  const supabase = await supabaseServerClient();
  const body = await req.json();

  const { error } = await supabase.from("garments").update(body).eq("id", id);

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ success: true });
}
