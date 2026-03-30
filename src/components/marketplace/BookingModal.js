"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Loader from "@/components/Loader";
import EventModal from "@/components/marketplace/EventModal";

export default function BookingModal({ vendorId }) {

const [showBookingModal, setShowBookingModal] = useState(false);
const [showEventModal, setShowEventModal] = useState(false);
const [events, setEvents] = useState([]);
const [existingBookings, setExistingBookings] = useState([]);
const [loading, setLoading] = useState(false);

/* --------------------------
Format Time (12hr)
-------------------------- */

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

/* --------------------------
Fetch Events
-------------------------- */

async function fetchEvents() {


const { data: userData } = await supabase.auth.getUser();
const currentUser = userData.user;

if (!currentUser) {
  alert("Please login first");
  return;
}

setLoading(true);

const { data: eventsData, error } = await supabase
  .from("customer_events")
  .select("*")
  .eq("user_id", currentUser.id)
  .order("event_date", { ascending: true });

if (error) {
  console.error(error);
  setLoading(false);
  return;
}

const { data: bookingData } = await supabase
  .from("booking_requests")
  .select("event_id")
  .eq("customer_id", currentUser.id)
  .eq("vendor_id", vendorId);

setExistingBookings(bookingData || []);
setEvents(eventsData || []);

setLoading(false);
setShowBookingModal(true);


}

/* --------------------------
Send Booking Request
-------------------------- */

async function sendBookingRequest(eventId) {


const { data: userData } = await supabase.auth.getUser();
const currentUser = userData.user;

const { error } = await supabase
  .from("booking_requests")
  .insert({
    customer_id: currentUser.id,
    vendor_id: vendorId,
    event_id: eventId
  });

if (error) {
  console.error(error);
  alert("Error sending booking request");
  return;
}

alert("Booking request sent");

setExistingBookings([
  ...existingBookings,
  { event_id: eventId }
]);


}

return (


<>

  {loading && <Loader fullscreen />}

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

    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-6">

      <div className="bg-white text-black rounded-xl w-full max-w-lg p-6 space-y-5 shadow-xl">

        <h2 className="text-xl font-semibold">
          Select an Event
        </h2>

        <p className="text-sm text-gray-500">
          Choose an event to send booking request
        </p>


        {events.length === 0 && (

          <p className="text-sm text-gray-500">
            No events found.
          </p>

        )}


        {events.map((event) => {

          const alreadySent = existingBookings.some(
            (b) => b.event_id === event.id
          );

          return (

            <div
              key={event.id}
              className="border rounded-lg p-3 flex justify-between items-center"
            >

              <div>

                <p className="font-medium">
                  {event.event_name}
                </p>

                <p className="text-sm text-gray-500">
                  {event.event_date} • {formatTime(event.event_time)}
                </p>

                <p className="text-sm text-gray-500">
                  {event.location}
                </p>

              </div>


              {alreadySent ? (

                <span className="bg-gray-200 text-black px-4 py-2 rounded text-sm">
                  Sent
                </span>

              ) : (

                <button
                  onClick={() => sendBookingRequest(event.id)}
                  className="bg-[#7A1820] text-white px-4 py-2 rounded text-sm"
                >
                  Send
                </button>

              )}

            </div>

          );

        })}


        {/* ADD EVENT BUTTON */}

        <p className="text-xs text-gray-500 leading-relaxed">
          * Roop is a platform for discovering beauty professionals. We do not guarantee or take responsibility for the quality or outcome of services provided by artists.
        </p>

        <div className="pt-3 border-t flex justify-between items-center">

          <button
            onClick={() => setShowEventModal(true)}
            className="text-sm text-[#7A1820] font-medium underline"
          >
            + Add Event
          </button>

          <button
            onClick={() => setShowBookingModal(false)}
            className="border px-4 py-2 rounded"
          >
            Close
          </button>

        </div>

      </div>

    </div>

  )}


  {/* EVENT MODAL */}

  <EventModal
    open={showEventModal}
    close={() => setShowEventModal(false)}
  />

</>


);
}
