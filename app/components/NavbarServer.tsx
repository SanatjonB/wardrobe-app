import Navbar from "./Navbar";
import { supabaseServerClient } from "@/lib/supabase/server";

export default async function NavbarServer() {
  const supabase = await supabaseServerClient();
  const { data } = await supabase.auth.getUser();

  return <Navbar isAuthed={!!data.user} />;
}
