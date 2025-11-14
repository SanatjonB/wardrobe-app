import { supabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = supabaseServerClient();

  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return Response.json({ error: "No file uploaded" }, { status: 400 });
  }

  const fileName = `${Date.now()}-${file.name}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from("garments")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    return Response.json({ error }, { status: 500 });
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("garments").getPublicUrl(fileName);

  return Response.json({ url: publicUrl });
}
