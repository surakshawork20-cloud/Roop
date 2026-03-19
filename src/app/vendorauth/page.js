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

if(error){
alert(error.message);
setLoading(false);
return;
}

const user = data.user;

if(user){

await supabase
.from("profiles")
.update({ is_vendor: true })
.eq("id", user.id);

}

// wait for session
await supabase.auth.getSession();

router.replace("/vendor");

}

/* SIGNUP */

async function signup(){

setLoading(true);

const { data, error } = await supabase.auth.signUp({
email,
password
});

if(error){

if(error.message.includes("already registered")){
setLoading(false);
alert("Account already exists. Please login.");
setIsSignup(false);
return;
}

alert(error.message);
return;
}

const user = data.user;

if(user){

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

}

// wait for session
await supabase.auth.getSession();

router.replace("/vendor");

}

return(

    <>

{loading && <Loader fullscreen />}

<div className="min-h-screen flex items-center justify-center bg-white">

<div className="w-[900px] h-[520px] bg-[#F4EDE7] rounded-xl shadow-xl overflow-hidden flex">

{/* LEFT PANEL */}

<div className="w-1/2 bg-[#691926] text-[#F4EDE7] flex flex-col items-center justify-center p-10">

<Image
src="/roop_logo.png"
alt="ROOP"
width={170}
height={80}
/>

<h2 className="text-[#F4EDE7] text-3xl mt-6 font-semibold">
Welcome Artist
</h2>

<p className="text-sm-[#F4EDE7] mt-3 text-center max-w-xs">
If you are an Artist, get onboarded on ROOP to experience quicker bookings and faster growth
</p>

<button
onClick={()=>setIsSignup(!isSignup)}
className="mt-8 border border-white px-6 py-2 rounded hover:bg-white hover:text-[#691926] transition"
>
{isSignup ? "Login Instead" : "Create Account"}
</button>

</div>


{/* RIGHT PANEL */}

<div className="bg-[#F4EDE7] w-1/2 flex items-center justify-center">

<div className="w-[320px]">

<h2 className="text-2xl font-semibold text-[#691926] mb-6 text-center">
{isSignup ? "Create Artist Account" : "Artist Login"}
</h2>

<input
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
className="border p-3 w-full rounded mb-4 bg-white text-black placeholder-gray-500"
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
className="bg-[#691926] text-white w-full py-3 rounded hover:opacity-90 transition flex items-center justify-center"
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