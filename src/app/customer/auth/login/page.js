"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Loader from "@/components/Loader";

export default function CustomerLogin(){

const router = useRouter();

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [loading,setLoading] = useState(false);

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

await supabase
.from("profiles")
.update({ is_customer: true })
.eq("id", user.id);

router.replace("/");

}

return(

    <>
    {loading && <Loader fullscreen />}

<div className="min-h-screen flex items-center justify-center bg-white">

<div className="w-[900px] h-[520px] bg-[#F4EDE7] rounded-xl shadow-xl flex">

{/* LEFT PANEL */}

<div className="w-1/2 bg-[#691926] text-[#F4EDE7] flex flex-col items-center justify-center p-10">
<Image
src="/roop_logo.png"
alt="ROOP"
width={170}
height={80}
/>

<h2 className="text-3xl text-[#F4EDE7] mt-6 font-semibold">
Welcome Back
</h2>

<p className="text-sm text-[#F4EDE7] mt-3 text-center max-w-xs">
Login to book your favorite makeup artists.
</p>

<button
onClick={()=>router.push("/customer/auth/signup")}
className="mt-8 border border-white px-6 py-2 rounded hover:bg-white hover:text-[#691926] transition"
>
Create Account
</button>

</div>


{/* RIGHT FORM */}

<div className="w-1/2 flex items-center justify-center">

<div className="w-[320px]">

<h2 className="text-2xl font-semibold text-[#691926] mb-6 text-center">
Customer Login
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
onClick={login}
disabled={loading}
className="bg-[#691926] text-white w-full py-3 rounded"
>
Login
</button>

</div>

</div>

</div>

</div>

</>
);

}