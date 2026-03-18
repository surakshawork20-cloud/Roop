"use client";

import { useState } from "react";

export default function Accordion({ title, children, defaultOpen=false }) {

const [open,setOpen] = useState(defaultOpen);

return(

<div className="border rounded-xl">

<button
onClick={()=>setOpen(!open)}
className="w-full flex justify-between items-center p-5 font-semibold text-left"
>

<span>{title}</span>

<span className="text-xl">
{open ? "−" : "+"}
</span>

</button>

{open && (
<div className="px-5 pb-5 text-gray-700">
{children}
</div>
)}

</div>

);
}