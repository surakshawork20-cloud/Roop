"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import EventModal from "./EventModal";

export default function MyEventsModal({ open, close }) {

const [events, setEvents] = useState([]);
const [showEventModal, setShowEventModal] = useState(false);
useEffect(() => {
  if (open) {
    document.body.style.overflow = "hidden";
    fetchEvents();
  } else {
    document.body.style.overflow = "auto";
  }

  return () => {
    document.body.style.overflow = "auto";
  };
}, [open]);

async function fetchEvents() {


const { data: userData } = await supabase.auth.getUser();
const currentUser = userData.user;

if (!currentUser) return;

const { data, error } = await supabase
  .from("customer_events")
  .select("*")
  .eq("user_id", currentUser.id)
  .order("event_date", { ascending: true });

if (error) {
  console.error(error);
  return;
}

setEvents(data);


}



async function deleteEvent(eventId) {


const confirmDelete = confirm("Delete this event?");
if (!confirmDelete) return;

const { error } = await supabase
  .from("customer_events")
  .delete()
  .eq("id", eventId);

if (error) {
  console.error(error);
  alert("Error deleting event");
  return;
}

fetchEvents();


}

if (!open) return null;

function formatTime(time) {

  if (!time) return "";

  const [hours, minutes] = time.split(":");

  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });

}

return (

  <div
    className="fixed inset-0 z-[9999] bg-black/50 flex justify-center items-center"
    onClick={close}
  >
    <div
      className="bg-white text-black rounded-xl w-full max-w-lg shadow-xl flex flex-col max-h-[80vh]"
      onClick={(e) => e.stopPropagation()}
    >

    <div className="p-4 border-b">
    <h2 className="text-xl font-semibold">My Events</h2>
    </div>

     <div className="flex-1 overflow-y-auto p-4 space-y-2">
    {events.length === 0 && (
      <p className="text-sm text-gray-500">
        No events created yet.
      </p>
    )}

    {events.map((event) => (

      <div
        key={event.id}
        className="border rounded-lg p-3 flex justify-between items-center"
      >

        <div>

          <p className="font-medium">
            {event.event_name} • {event.location}
          </p>

          <p className="text-sm text-gray-500">
            {event.event_date} • {formatTime(event.event_time)}
          </p>

        </div>

        <button
          onClick={() => deleteEvent(event.id)}
          className="text-red-500 text-sm"
        >
          Delete
        </button>

      </div>

    ))}
    </div>

    <div className="border-t px-4 py-4 flex justify-between items-center">

      <button
        onClick={() => setShowEventModal(true)}
        className="bg-[#691926] text-white px-3 py-2 rounded text-sm"
      >
        + Add Event
      </button>

      <button
        onClick={close}
        className="border px-4 py-2 rounded"
      >
        Close
      </button>

    </div>

  </div>

  <EventModal
  open={showEventModal}
  close={() => {
    setShowEventModal(false);
    fetchEvents();
  }}
/>

</div>

);
}
