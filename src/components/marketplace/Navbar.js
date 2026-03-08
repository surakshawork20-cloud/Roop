"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Navbar() {

const [user,setUser] = useState(null);
const [showEventModal,setShowEventModal] = useState(false);
const [showMyEvents,setShowMyEvents] = useState(false);
const [events,setEvents] = useState([]);
const [showBookingsModal,setShowBookingsModal] = useState(false);
const [bookings,setBookings] = useState([]);

const [eventForm,setEventForm] = useState({
name:"",
event_name:"",
phone:"",
email:"",
event_date:"",
start_time:"",
end_time:"",
location:"",
budget:""
});

/* --------------------------
Check Logged In User
-------------------------- */

useEffect(()=>{
checkUser();
},[]);

async function checkUser(){

const {data} = await supabase.auth.getUser();
setUser(data.user);

}

/* --------------------------
Logout
-------------------------- */

async function logout(){

await supabase.auth.signOut();
window.location.reload();

}


async function deleteEvent(eventId){

const confirmDelete = confirm("Delete this event?");

if(!confirmDelete) return;

const {error} = await supabase
.from("customer_events")
.delete()
.eq("id",eventId);

if(error){
console.error(error);
alert("Error deleting event");
return;
}

fetchEvents();

}
/* --------------------------
Handle Event Form
-------------------------- */

function handleEventChange(e){

setEventForm({
...eventForm,
[e.target.name]:e.target.value
});

}

/* --------------------------
Create Event
-------------------------- */

async function fetchBookings(){

const {data:userData} = await supabase.auth.getUser();
const currentUser = userData.user;

const {data,error} = await supabase
.from("booking_requests")
.select(`
id,
status,
vendor_id,
customer_events (
event_name,
event_date,
location
)
`)
.eq("customer_id",currentUser.id)
.order("created_at",{ascending:false});

if(error){
console.error(error);
return;
}

setBookings(data);
setShowBookingsModal(true);

}
async function fetchEvents(){

const {data:userData} = await supabase.auth.getUser();
const currentUser = userData.user;

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

}

async function createEvent(){

const requiredFields = [
"name",
"event_name",
"phone",
"email",
"event_date",
"start_time",
"end_time",
"location"
];

for(const field of requiredFields){

if(!eventForm[field]){
alert("Please fill all required fields");
return;
}

}

const {data:userData} = await supabase.auth.getUser();
const currentUser = userData.user;

const {error} = await supabase
.from("customer_events")
.insert({
user_id:currentUser.id,
...eventForm
});

if(error){
console.error(error);
alert("Error creating event");
return;
}

alert("Event created successfully");

setShowEventModal(false);

setEventForm({
name:"",
event_name:"",
phone:"",
email:"",
event_date:"",
start_time:"",
end_time:"",
location:"",
budget:""
});

}

/* --------------------------
Navbar UI
-------------------------- */

return (

<nav className="bg-[#691926] backdrop-blur sticky top-0 z-50 text-white border-b border-[#ded1ba]/30">

<div className="w-full px-10 py-2 flex items-center justify-between gap-6">

{/* LOGO */}

<Link href="/" className="flex items-center shrink-0">

<Image
src="/roop_logo.png"
alt="ROOP"
width={300}
height={80}
priority
className="h-12 w-auto object-contain"
/>

</Link>

{/* SEARCH */}

<div className="flex-1 max-w-lg">

<input
placeholder="Search artists, bridal makeup, hair styling..."
className="
w-full
px-5
py-2
rounded-full
text-[#ded1ba]
border
border-[#ded1ba]
bg-transparent
focus:outline-none
focus:ring-2
focus:ring-[#ded1ba]
"
/>

</div>

{/* RIGHT SIDE */}

<div className="flex gap-5 items-center text-sm">

{!user ? (

<>
<Link href="/customer/auth/login">
Login
</Link>

<Link
href="/customer/auth/signup"
className="bg-[#ded1ba] text-[#691926] px-4 py-2 rounded-full font-medium"
>
Sign Up
</Link>

<Link
href="/vendorauth"
className="text-[#ded1ba] underline"
>
Are you an artist?
</Link>
</>

) : (

<>
<button
onClick={()=>setShowEventModal(true)}
className="bg-[#ded1ba] text-[#691926] px-4 py-2 rounded-full font-medium"
>
+ Add Event
</button>

<button
onClick={()=>{
fetchEvents();
setShowMyEvents(true);
}}
>
My Events
</button>

<button
onClick={fetchBookings}
>
My Bookings
</button>

<button onClick={logout}>
Logout
</button>
</>

)}

</div>

</div>


{/* --------------------------
EVENT MODAL
-------------------------- */}
{showEventModal && (
  <div className="fixed top-0 left-0 w-screen h-screen z-[9999] bg-black/50 flex items-start justify-center pt-28 overflow-y-auto">
    
    <div className="flex min-h-full items-start justify-center pt-24 pb-10 px-4">

      <div
        className="bg-white text-black rounded-xl w-full max-w-lg p-6 space-y-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >

        <h2 className="text-xl font-semibold">
          Create Event
        </h2>

        <input
          name="name"
          placeholder="Your Name"
          value={eventForm.name}
          onChange={handleEventChange}
          className="border p-2 w-full rounded"
        />

        <input
          name="event_name"
          placeholder="Event Name (Wedding, Reception etc)"
          value={eventForm.event_name}
          onChange={handleEventChange}
          className="border p-2 w-full rounded"
        />

        <input
          name="phone"
          placeholder="Phone Number"
          value={eventForm.phone}
          onChange={handleEventChange}
          className="border p-2 w-full rounded"
        />

        <input
          name="email"
          placeholder="Email"
          value={eventForm.email}
          onChange={handleEventChange}
          className="border p-2 w-full rounded"
        />

        <input
          type="date"
          name="event_date"
          value={eventForm.event_date}
          onChange={handleEventChange}
          className="border p-2 w-full rounded"
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            type="time"
            name="start_time"
            value={eventForm.start_time}
            onChange={handleEventChange}
            className="border p-2 w-full rounded"
          />

          <input
            type="time"
            name="end_time"
            value={eventForm.end_time}
            onChange={handleEventChange}
            className="border p-2 w-full rounded"
          />
        </div>

        <input
          name="location"
          placeholder="Event Location"
          value={eventForm.location}
          onChange={handleEventChange}
          className="border p-2 w-full rounded"
        />

        <input
          name="budget"
          placeholder="Budget (Optional)"
          value={eventForm.budget}
          onChange={handleEventChange}
          className="border p-2 w-full rounded"
        />

        <div className="flex justify-end gap-3 pt-3">

          <button
            onClick={() => setShowEventModal(false)}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={createEvent}
            className="bg-[#7A1820] text-white px-5 py-2 rounded"
          >
            Create Event
          </button>

        </div>

      </div>

    </div>

  </div>
)}


{showMyEvents && (

<div className="fixed top-0 left-0 w-screen h-screen z-[9999] bg-black/50 flex items-start justify-center pt-24 overflow-y-auto">

<div className="bg-white text-black rounded-xl w-full max-w-lg p-6 space-y-4 shadow-xl">

<h2 className="text-xl font-semibold">
My Events
</h2>

{events.length === 0 && (

<p className="text-sm text-gray-500">
No events created yet.
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
onClick={()=>deleteEvent(event.id)}
className="text-red-500 text-sm"
>
Delete
</button>

</div>
))}

<div className="flex justify-end pt-2">

<button
onClick={()=>setShowMyEvents(false)}
className="border px-4 py-2 rounded"
>
Close
</button>

</div>

</div>

</div>

)}

{showBookingsModal && (

<div className="fixed top-0 left-0 w-screen h-screen z-[9999] bg-black/50 flex items-start justify-center pt-24 overflow-y-auto">

<div className="bg-white text-black rounded-xl w-full max-w-lg p-6 space-y-5 shadow-xl">

<h2 className="text-xl font-semibold">
My Bookings
</h2>

{bookings.length === 0 && (

<p className="text-sm text-gray-500">
No booking requests yet.
</p>

)}

{bookings.map((booking)=>(

<div
key={booking.id}
className="border rounded-lg p-3 cursor-pointer flex justify-between items-center"
onClick={()=>window.location.href=`/artists/${booking.vendor_id}`}
>

<div>

<p className="font-medium">
{booking.customer_events?.event_name}
</p>

<p className="text-sm text-gray-500">
{booking.customer_events?.event_date} • {booking.customer_events?.location}
</p>

</div>

<div>

<span className="text-sm font-medium">

{booking.status === "pending" && "Pending"}
{booking.status === "accepted" && "Accepted"}
{booking.status === "rejected" && "Rejected"}

</span>

</div>

</div>

))}

<div className="flex justify-end pt-3">

<button
onClick={()=>setShowBookingsModal(false)}
className="border px-4 py-2 rounded"
>
Close
</button>

</div>

</div>

</div>

)}

</nav>

);

}