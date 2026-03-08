"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function VendorBookingsPage(){

const [bookings,setBookings] = useState([]);
const [loading,setLoading] = useState(true);

/* --------------------------
FETCH BOOKINGS
-------------------------- */

async function fetchBookings(){

const {data:userData} = await supabase.auth.getUser();
const vendor = userData.user;

const {data,error} = await supabase
.from("booking_requests")
.select(`
id,
status,
customer_id,
vendor_id,
customer_events (
event_name,
event_date,
start_time,
end_time,
location,
phone,
name
)
`)
.eq("vendor_id",vendor.id)
.order("created_at",{ascending:false});

if(error){
console.error(error);
return;
}

setBookings(data);
setLoading(false);

}

/* --------------------------
UPDATE STATUS
-------------------------- */

async function updateStatus(id,status){

const {error} = await supabase
.from("booking_requests")
.update({status})
.eq("id",id);

if(error){
console.error(error);
alert("Error updating booking");
return;
}

fetchBookings();

}

useEffect(()=>{
fetchBookings();
},[]);

/* --------------------------
UI
-------------------------- */

return(

<div className="p-8">

<h1 className="text-2xl font-semibold mb-6">
Booking Requests
</h1>

{loading && <p>Loading...</p>}

{!loading && bookings.length === 0 && (
<p>No booking requests yet.</p>
)}

<div className="space-y-4">

{bookings.map((booking)=>(

<div
key={booking.id}
className="border rounded-lg p-5 flex justify-between items-center"
>

<div className="space-y-1">

<p className="font-medium">
{booking.customer_events?.event_name}
</p>

<p className="text-sm text-gray-500">
{booking.customer_events?.event_date}
</p>

<p className="text-sm text-gray-500">
{booking.customer_events?.location}
</p>

<p className="text-sm text-gray-500">
Phone: {booking.customer_events?.phone}
</p>

</div>

{/* STATUS */}

<div className="flex items-center gap-3">

{booking.status === "pending" && (

<>

<button
onClick={()=>updateStatus(booking.id,"accepted")}
className="bg-green-600 text-white px-4 py-2 rounded text-sm"
>
Accept
</button>

<button
onClick={()=>updateStatus(booking.id,"rejected")}
className="bg-red-600 text-white px-4 py-2 rounded text-sm"
>
Reject
</button>

</>

)}

{booking.status === "accepted" && (
<span className="text-green-600 font-medium">
Accepted
</span>
)}

{booking.status === "rejected" && (
<span className="text-red-600 font-medium">
Rejected
</span>
)}

</div>

</div>

))}

</div>

</div>

);

}