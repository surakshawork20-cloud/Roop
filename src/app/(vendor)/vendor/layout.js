"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/vendor/Sidebar";
import Navbar from "@/components/vendor/Navbar";

export default function VendorLayout({ children }) {

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(undefined);

  // 👇 ADD THIS
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const storedRole = localStorage.getItem("activeRole");

    if (!storedRole) {
      setRole(null);
    } else {
      setRole(storedRole);
    }
  }, []);

  useEffect(() => {
    if (role === undefined) return;

    if (role === null) {
      router.replace("/");
      return;
    }

    const checkVendor = async () => {
      try {
        if (role !== "vendor") {
          router.replace("/");
          return;
        }

        const { data } = await supabase.auth.getUser();

        if (!data.user) {
          router.replace("/vendorauth");
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("is_vendor")
          .eq("id", data.user.id)
          .single();

        if (!profile?.is_vendor) {
          router.replace("/");
          return;
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        router.replace("/");
      }
    };

    checkVendor();
  }, [role]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#F4EDE7]">

      {/* NAVBAR */}
      <Navbar setSidebarOpen={setSidebarOpen} />

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar (NO wrapper div anymore ❌) */}
        <Sidebar
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
}