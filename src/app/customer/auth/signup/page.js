"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Loader from "@/components/Loader";

export default function CustomerSignup() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signup() {
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      if (error.message.includes("already registered")) {
        setLoading(false);
        alert("Account exists. Please login.");
        router.push("/customer/auth/login");
        return;
      }

      alert(error.message);
      setLoading(false);
      return;
    }

    const user = data.user;

    // ⚠️ If email confirmation is enabled
    if (!user) {
      alert("Check your email to confirm signup.");
      setLoading(false);
      return;
    }

    // ✅ Upsert profile
    await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          email: user.email,
          is_customer: true,
        },
        { onConflict: "id" }
      );

    // ✅ Ensure session is ready
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      alert("Session not ready. Please login.");
      setLoading(false);
      router.push("/customer/auth/login");
      return;
    }

    // ✅ Set role FIRST
    localStorage.setItem("activeRole", "customer");

    // ✅ Small delay (prevents race condition)
    setTimeout(() => {
      router.replace("/");
    }, 100);
  }

  return (
    <>
      {loading && <Loader fullscreen />}

<div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6">

<div className="w-full max-w-4xl min-h-[520px] bg-[#F4EDE7] rounded-xl shadow-xl overflow-hidden flex flex-col md:flex-row">

{/* LEFT PANEL */}

<div className="w-full md:w-1/2 bg-[#691926] text-[#F4EDE7] flex flex-col items-center justify-center px-6 py-10 sm:px-10">
            <Image
              src="/roop_logo.png"
              alt="ROOP"
              width={170}
              height={80}
            />

            <h2 className="text-2xl sm:text-3xl mt-6 font-semibold text-center">
              Join ROOP
            </h2>

            <p className="text-sm mt-3 text-center max-w-xs">
              Discover and book amazing makeup artists.
            </p>

            <button
              onClick={() => router.push("/customer/auth/login")}
              className="mt-6 sm:mt-8 border border-white px-5 py-2 rounded hover:bg-white hover:text-[#691926] transition"
            >
              Login Instead
            </button>
          </div>

          {/* RIGHT FORM */}
<div className="bg-[#F4EDE7] w-full md:w-1/2 flex items-center justify-center px-6 py-12 sm:py-16">

<div className="w-full max-w-sm mx-auto flex flex-col justify-center">

              <h2 className="text-2xl font-semibold text-[#691926] mb-8 text-center">
                Create Account
              </h2>

              <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-3 w-full rounded mb-4 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#691926]/30"
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-3 w-full rounded mb-6 bg-white text-black placeholder-gray-5000"
              />

              <button
                onClick={signup}
                disabled={loading}
                className="bg-[#691926] text-white w-full py-3 rounded active:scale-[0.98] transition flex items-center justify-center"
              >
                Create Account
              </button>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}