"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Navbar() {

  const router = useRouter();

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <button
      onClick={logout}
      className="text-sm text-gray-600 hover:text-red-600"
    >
      Logout
    </button>
  );
}