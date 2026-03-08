"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function BookingModal({ vendorId }) {

const [showBookingModal,setShowBookingModal] = useState(false);
const [events,setEvents] = useState([]);

async function fetchEvents(){

const {data:userData} = await supabase.auth.getUser();
const currentUser = userData.user;

if(!currentUser){
alert("Please login first");
return;
}

const {data,error} = await supabase
.from("customer_events")
.select("*")
.eq("user_id",currentUser.id)
.order("event_date",{ascending:true});

if(error){
console.error(error);
return;
}

setEvents(data);
setShowBookingModal(true);

}

async function sendBookingRequest(eventId){

const {data:userData} = await supabase.auth.getUser();
const currentUser = userData.user;

const {error} = await supabase
.from("booking_requests")
.insert({
customer_id:currentUser.id,
vendor_id:vendorId,
event_id:eventId
});

if(error){
console.error(error);
alert("Error sending booking request");
return;
}

alert("Booking request sent");

setShowBookingModal(false);

}

return(

<>

{/* BOOK BUTTON */}

<div className="flex justify-end">

<button
onClick={fetchEvents}
className="bg-[#7A1820] text-white px-6 py-3 rounded-lg"
>
Request Booking
</button>

</div>


{/* BOOKING MODAL */}

{showBookingModal && (

<div className="fixed top-0 left-0 w-screen h-screen z-[9999] bg-black/50 flex items-start justify-center pt-24 overflow-y-auto">

<div className="bg-white text-black rounded-xl w-full max-w-lg p-6 space-y-5 shadow-xl">

<h2 className="text-xl font-semibold">
Select an Event
</h2>

<p className="text-sm text-gray-500">
Choose an event to send booking request
</p>

{events.length === 0 && (
<p className="text-sm text-gray-500">
No events found. Create an event first.
</p>
)}

{events.map((event)=>(

<div
key={event.id}
className="border rounded-lg p-3 flex justify-between items-center"
>

<div>

<p className="font-medium">
{event.event_name}
</p>

<p className="text-sm text-gray-500">
{event.event_date} • {event.location}
</p>

</div>

<button
onClick={()=>sendBookingRequest(event.id)}
className="bg-[#7A1820] text-white px-4 py-2 rounded text-sm"
>
Select
</button>

</div>

))}

<div className="flex justify-end pt-3">

<button
onClick={()=>setShowBookingModal(false)}
className="border px-4 py-2 rounded"
>
Close
</button>

</div>

</div>

</div>

)}

</>

);

}