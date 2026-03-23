"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Loader from "@/components/Loader";

export default function VendorAuth() {

const router = useRouter();
const [isSignup,setIsSignup] = useState(false);
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [loading,setLoading] = useState(false);

/* LOGIN */

async function login(){

        setLoading(true);

        const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
        });
        await supabase.auth.getSession();

        if(error){
        alert(error.message);
        setLoading(false);
        return;
        }

        const { data: userData } = await supabase.auth.getUser();

            if (!userData.user) {
            alert("Login failed. Try again.");
            setLoading(false);
            return;
            }

       await supabase
            .from("profiles")
            .update({ is_vendor: true })
            .eq("id", userData.user.id);

            // ✅ Set role FIRST
            localStorage.setItem("activeRole", "vendor");

            // ✅ Small delay (VERY IMPORTANT)
            setTimeout(() => {
            localStorage.setItem("activeRole", "vendor");
            router.replace("/vendor");
            }, 100);

}

/* SIGNUP */

async function signup(){

setLoading(true);

const { data, error } = await supabase.auth.signUp({
  email,
  password
});

if (error) {
  if (error.message.includes("already registered")) {
    setLoading(false);
    alert("Account already exists. Please login.");
    setIsSignup(false);
    return;
  }

  alert(error.message);
  setLoading(false);
  return;
}

const user = data.user;

// ⚠️ Handle email confirmation case
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
      is_vendor: true
    },
    { onConflict: "id" }
  );

// ✅ Ensure session
const { data: userData } = await supabase.auth.getUser();

if (!userData.user) {
  alert("Session not ready. Try login.");
  setLoading(false);
  return;
}

// ✅ Set role
localStorage.setItem("activeRole", "vendor");

// ✅ Delay redirect
setTimeout(() => {
localStorage.setItem("activeRole", "vendor");
router.replace("/vendor");
}, 100);

}

return(

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
Welcome Artist
</h2>
<p className="text-sm mt-3 text-center max-w-xs">
If you are an Artist, get onboarded on ROOP to experience quicker bookings and faster growth
</p>

<button
onClick={()=>setIsSignup(!isSignup)}
className="mt-6 sm:mt-8 border border-white px-5 py-2 rounded hover:bg-white hover:text-[#691926] transition"
>
{isSignup ? "Login Instead" : "Create Account"}
</button>

</div>


{/* RIGHT PANEL */}
<div className="bg-[#F4EDE7] w-full md:w-1/2 flex items-center justify-center px-6 py-12 sm:py-16">

<div className="w-full max-w-sm mx-auto flex flex-col justify-center">

<h2 className="text-2xl font-semibold text-[#691926] mb-8 text-center">
{isSignup ? "Create Artist Account" : "Artist Login"}
</h2>

<input
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
className="border p-3 w-full rounded mb-4 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#691926]/30"
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
className="border p-3 w-full rounded mb-6 bg-white text-black placeholder-gray-500"
/>

<button
onClick={isSignup ? signup : login}
disabled={loading}
className="bg-[#691926] text-white w-full py-3 rounded active:scale-[0.98] transition flex items-center justify-center"
>
{loading ? <Loader /> : (isSignup ? "Create Account" : "Login")}
</button>

</div>

</div>

</div>

</div>
</>
);

}