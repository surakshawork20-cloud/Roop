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
function isValidPhone(phone) {
  return /^\+?[0-9]{10,15}$/.test(phone);
}


function handleEventChange(e) {

  const { name, value } = e.target;

  if (name === "phone") {
    // allow only digits and +
    let cleaned = value.replace(/[^\d+]/g, "");

    // only one + at the start
    if (cleaned.includes("+")) {
      cleaned = "+" + cleaned.replace(/\+/g, "");
    }

    setEventForm((prev) => ({
      ...prev,
      phone: cleaned,
    }));
    return;
  }
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

    // ✅ Validate phone BEFORE API call
  if (!isValidPhone(eventForm.phone)) {
    alert("Enter a valid phone number (10–15 digits)");
    return;
  }

  for (const field of requiredFields) {
    if (!eventForm[field]) {
      alert("Please fill all required fields");
      return;
    }
  }

  const { data: userData } = await supabase.auth.getUser();
  const currentUser = userData.user;

  // ✅ FIX TIME FORMAT
  const formattedTime = eventForm.event_time + ":00";

  const { error } = await supabase
    .from("customer_events")
    .insert({
      user_id: currentUser.id,
      ...eventForm,
      event_time: formattedTime // override here
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
  className="fixed inset-0 z-[9999] bg-black/50 flex items-start justify-center overflow-y-auto p-4"
  onClick={close}
>
  <div
    
    onClick={(e) => e.stopPropagation()}
  >

    <div
      className="bg-white text-black rounded-xl w-full max-w-lg p-6 space-y-4 shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >

      <h2 className="text-xl font-semibold">
        Create Event
      </h2>

      <label className="text-sm font-medium">Your Name*</label>
      <input
        name="name"
        value={eventForm.name}
        onChange={handleEventChange}
        className="border p-2 w-full rounded"
      />

      <label className="text-sm font-medium">Event Name (Wedding, Reception etc)*</label>
      <input
        name="event_name"
        value={eventForm.event_name}
        onChange={handleEventChange}
        className="border p-2 w-full rounded"
      />

      <label className="text-sm font-medium">Phone Number*</label>
      <input
        name="phone"
        value={eventForm.phone}
        onChange={handleEventChange}
        className="border p-2 w-full rounded"
        inputMode="tel"
        pattern="^\+?[0-9]{10,15}$"
        placeholder="+91XXXXXXXXXX"
      />

      <label className="text-sm font-medium">Email*</label>
      <input
        name="email"
        value={eventForm.email}
        onChange={handleEventChange}
        className="border p-2 w-full rounded"
      />

      <label className="text-sm font-medium">Event Date*</label>
      <input
        type="date"
        name="event_date"
        value={eventForm.event_date}
        onChange={handleEventChange}
        className="border p-2 w-full rounded"
      />


      <label className="text-sm font-medium">Event Time*</label>
        <input
          type="time"
          name="event_time"
          value={eventForm.event_time}
          onChange={handleEventChange}
          className="border p-2 w-full rounded"
        />


      <label className="text-sm font-medium">Event Location*</label> 
      <input
        name="location"
        value={eventForm.location}
        onChange={handleEventChange}
        className="border p-2 w-full rounded"
      />

      <label className="text-sm font-medium">Budget (Optional)</label>
      <input
        name="budget"
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


);
}
