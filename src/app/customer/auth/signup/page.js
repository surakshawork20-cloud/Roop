"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CustomerSignup(){

const router = useRouter();

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

async function signup(){

const { data, error } = await supabase.auth.signUp({
email,
password
});

if(error){

if(error.message.includes("already registered")){
alert("Account exists. Please login.");
router.push("/customer/auth/login");
return;
}

alert(error.message);
return;
}

const user = data.user;

await supabase
.from("profiles")
.upsert(
{
id: user.id,
email: user.email,
is_customer: true
},
{ onConflict: "id" }
);

router.replace("/");

}

return(

<div className="min-h-screen flex items-center justify-center bg-black">

<div className="w-[900px] h-[520px] bg-white rounded-xl shadow-xl flex">

{/* LEFT PANEL */}

<div className="w-1/2 bg-[#691926] text-white flex flex-col items-center justify-center p-10">

<Image
src="/roop_logo.png"
alt="ROOP"
width={170}
height={80}
/>

<h2 className="text-3xl mt-6 font-semibold">
Join ROOP
</h2>

<p className="text-sm mt-3 text-center max-w-xs">
Discover and book amazing makeup artists.
</p>

<button
onClick={()=>router.push("/customer/auth/login")}
className="mt-8 border border-white px-6 py-2 rounded hover:bg-white hover:text-[#691926] transition"
>
Login Instead
</button>

</div>


{/* RIGHT FORM */}

<div className="w-1/2 flex items-center justify-center">

<div className="w-[320px]">

<h2 className="text-2xl font-semibold text-[#691926] mb-6 text-center">
Create Account
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
onClick={signup}
className="bg-[#691926] text-white w-full py-3 rounded"
>
Create Account
</button>

</div>

</div>

</div>

</div>

);

}