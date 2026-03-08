"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function VendorAuth() {

const router = useRouter();
const [isSignup,setIsSignup] = useState(false);
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

/* LOGIN */

async function login(){

const { data, error } = await supabase.auth.signInWithPassword({
email,
password
});

if(error){
alert(error.message);
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

const { data, error } = await supabase.auth.signUp({
email,
password
});

if(error){

if(error.message.includes("already registered")){
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

<div className="min-h-screen flex items-center justify-center bg-black">

<div className="w-[900px] h-[520px] bg-white rounded-xl shadow-xl overflow-hidden flex">

{/* LEFT PANEL */}

<div className="w-1/2 bg-[#691926] text-white flex flex-col items-center justify-center p-10">

<Image
src="/roop_logo.png"
alt="ROOP"
width={170}
height={80}
/>

<h2 className="text-3xl mt-6 font-semibold">
Welcome Artist
</h2>

<p className="text-sm mt-3 text-center max-w-xs">
Join ROOP and grow your makeup business.
</p>

<button
onClick={()=>setIsSignup(!isSignup)}
className="mt-8 border border-white px-6 py-2 rounded hover:bg-white hover:text-[#691926] transition"
>
{isSignup ? "Login Instead" : "Create Account"}
</button>

</div>


{/* RIGHT PANEL */}

<div className="w-1/2 flex items-center justify-center">

<div className="w-[320px]">

<h2 className="text-2xl font-semibold text-[#691926] mb-6 text-center">
{isSignup ? "Create Artist Account" : "Artist Login"}
</h2>

<input
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
className="border p-3 w-full rounded mb-4"
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
className="border p-3 w-full rounded mb-6"
/>

<button
onClick={isSignup ? signup : login}
className="bg-[#691926] text-white w-full py-3 rounded hover:opacity-90 transition"
>
{isSignup ? "Create Account" : "Login"}
</button>

</div>

</div>

</div>

</div>

);

}