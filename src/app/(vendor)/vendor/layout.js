"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/vendor/Sidebar";
import Navbar from "@/components/vendor/Navbar";
import RoleGuard from "@/components/RoleGuard";

export default function VendorLayout({ children }) {

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(undefined); // IMPORTANT

useEffect(() => {
  const storedRole = localStorage.getItem("activeRole");

  if (!storedRole) {
    setRole(null); // explicitly invalid
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

<div className="min-h-screen flex flex-col bg-[#FAF7F5]">

    {/* FULL WIDTH NAVBAR */}
    <div className="h-16 bg-[#691926]">
      <Navbar />
    </div>

    {/* BELOW NAVBAR */}
    <div className="flex flex-1">

      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        <Sidebar />
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {children}
      </div>

    </div>

  </div>

  );
}