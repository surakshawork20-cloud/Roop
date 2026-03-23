"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function RoleGuard({ children, allowedRoles = [] }) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  // ✅ Step 1: Get role
  useEffect(() => {
    const storedRole = localStorage.getItem("activeRole");
    setRole(storedRole);
  }, []);

  // ✅ Step 2: Validate
  useEffect(() => {
    if (role === null) return;

    const checkAccess = async () => {
      // ❌ No role → login
      if (!role) {
        router.replace("/customer/auth/login");
        return;
      }

      // ❌ Role not allowed → redirect properly
      if (allowedRoles.length && !allowedRoles.includes(role)) {
        if (role === "vendor") {
          router.replace("/vendor");
        } else {
          router.replace("/");
        }
        return;
      }

      // ✅ Check session
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.replace("/customer/auth/login");
        return;
      }

      // ✅ All good
      setLoading(false);
    };

    checkAccess();
  }, [role, allowedRoles, router]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return children;
}