"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Loader from "@/components/Loader";

export default function Navbar({ setSidebarOpen }) {

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <>
      {loading && <Loader fullscreen />}

      <nav className="bg-[#691926] text-white w-full">

        <div className="w-full px-6 py-3 flex items-center justify-between">

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-xl"
          >
            ☰
          </button>

          {/* LOGO */}
          <Link href="/" className="flex items-center mx-auto md:mx-0">
            <Image
              src="/roop_logo.png"
              alt="ROOP"
              width={150}
              height={40}
              className="h-9 w-auto"
            />
          </Link>

          {/* LOGOUT */}
          <button
            onClick={logout}
            disabled={loading}
            className="text-sm font-medium hover:text-[#ded1ba]"
          >
            Logout
          </button>

        </div>

      </nav>
    </>
  );
}