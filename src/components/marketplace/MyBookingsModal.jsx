"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function MyBookingsModal({ open, close }) {

const [bookings, setBookings] = useState([]);

useEffect(() => {
if (open) {
fetchBookings();
}
}, [open]);
  async function fetchBookings() {

    const { data: userData } = await supabase.auth.getUser();
    const currentUser = userData.user;

    console.log("Current user:", currentUser);
    if (!currentUser) return;

    /* --------------------------
       Fetch booking requests
    -------------------------- */

    const { data: bookingData, error } = await supabase
      .from("booking_requests")
      .select("*")
      .eq("customer_id", currentUser.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Supabase error:", error);
      return;
    }

    if (!bookingData || bookingData.length === 0) {
      setBookings([]);
      return;
    }

    /* --------------------------
       Fetch events for bookings
    -------------------------- */

    const eventIds = bookingData.map((b) => b.event_id);

    const { data: eventsData } = await supabase
      .from("customer_events")
      .select("*")
      .in("id", eventIds);
console.log("bookingData:", bookingData);

const vendorIds = bookingData
  .map(b => b.vendor_id)
  .filter(Boolean);

const { data: vendorsData, error: vendorsError } = await supabase
  .from("vendor_basic_information")
  .select("vendor_id, brand_name")
  .in("vendor_id", vendorIds.map(id => `${id}`));
/* --------------------------
   Create vendor map
-------------------------- */

const vendorMap = {};
vendorsData?.forEach((v) => {
  vendorMap[v.vendor_id] = v;
});
console.log("vendorIds:", vendorIds);
    /* --------------------------
       Merge bookings + events
    -------------------------- */

    const mergedBookings = bookingData.map((booking) => ({
      ...booking,
      event: eventsData?.find((e) => e.id === booking.event_id),
      vendor: vendorMap[booking.vendor_id]
    }));
console.log("vendorsData:", vendorsData);
    setBookings(mergedBookings);
  }


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

if (!open) return null;

return (


<div
  className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-6"
  onClick={close}
>

  <div
    className="bg-white text-black rounded-xl w-full max-w-lg p-6 space-y-4 shadow-xl"
    onClick={(e) => e.stopPropagation()}
  >

    <h2 className="text-xl font-semibold">
      My Bookings
    </h2>

    {bookings.length === 0 && (
      <p className="text-sm text-gray-500">
        No booking requests yet.
      </p>
    )}

    {bookings.map((booking) => (

      <div
        key={booking.id}
        className="border rounded-lg p-3 flex justify-between items-center cursor-pointer"
        onClick={() => window.location.href=`/artists/${booking.vendor_id}`}
      >

        <div>

          <p className="font-medium">
           {booking.event?.event_name}
          </p>

          <p className="text-sm text-gray-500">
            {booking.event?.event_date} • {formatTime(booking.event?.event_time)}
          </p>

          <p className="text-sm text-gray-500">
            {booking.event?.location}
          </p>

        </div>

        <div
          className={`text-sm font-medium px-3 py-1 rounded-full inline-block
          ${
            booking.status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : booking.status === "accepted"
              ? "bg-green-100 text-green-700"
              : booking.status === "rejected"
              ? "bg-red-100 text-red-700"
              : ""
          }`}
        >
          {booking.status === "pending" && "Pending"}
          {booking.status === "accepted" && "Accepted"}
          {booking.status === "rejected" && "Rejected"}
        </div>

      </div>

    ))}

    <div className="flex justify-end pt-2">

      <button
        onClick={close}
        className="border px-4 py-2 rounded"
      >
        Close
      </button>

    </div>

  </div>

</div>


);
}
