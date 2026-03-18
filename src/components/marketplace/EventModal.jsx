"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function EventModal({ open, close }) {

const [eventForm, setEventForm] = useState({
name: "",
event_name: "",
phone: "",
email: "",
event_date: "",
event_time: "",
location: "",
budget: ""
});



function handleEventChange(e) {
setEventForm({
...eventForm,
[e.target.name]: e.target.value
});
}

async function createEvent() {


const requiredFields = [
  "name",
  "event_name",
  "phone",
  "email",
  "event_date",
  "event_time",
  "location"
];

for (const field of requiredFields) {
  if (!eventForm[field]) {
    alert("Please fill all required fields");
    return;
  }
}

const { data: userData } = await supabase.auth.getUser();
const currentUser = userData.user;

const { error } = await supabase
  .from("customer_events")
  .insert({
    user_id: currentUser.id,
    ...eventForm
  });

if (error) {
  console.error(error);
  alert("Error creating event");
  return;
}

alert("Event created successfully");

setEventForm({
  name: "",
  event_name: "",
  phone: "",
  email: "",
  event_date: "",
  event_time: "",
  location: "",
  budget: ""
});

close();


}

if (!open) return null;


return (


<div
  className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-6"
  onClick={close}
>
  <div
    
    onClick={(e) => e.stopPropagation()}
  >
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


        <input
          type="time"
          name="event_time"
          value={eventForm.event_time}
          onChange={handleEventChange}
          className="border p-2 w-full rounded"
        />


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
          onClick={close}
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
</div>


);
}
