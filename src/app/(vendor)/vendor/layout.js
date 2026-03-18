"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/vendor/Sidebar";
import Navbar from "@/components/vendor/Navbar";

export default function VendorLayout({ children }) {

  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const checkVendor = async () => {

      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/vendorauth");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_vendor")
        .eq("id", data.user.id)
        .single();

      if (!profile?.is_vendor) {
        router.push("/");
        return;
      }

      setLoading(false);

    };

    checkVendor();

  }, []);

  if (loading) return null;

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