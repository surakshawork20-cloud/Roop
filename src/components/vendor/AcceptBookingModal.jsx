"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Loader from "@/components/Loader";

export default function AcceptBookingModal({
  booking,
  event,
  onClose,
  refresh
}) {

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);


  

  async function confirmBooking() {

    if (!startTime || !endTime) {
      alert("Please select start and end time");
      return;
    }

    setLoading(true);

    try {

      /* INSERT INTO VENDOR BOOKINGS */

      const { error: bookingError } = await supabase
        .from("vendor_bookings")
        .insert({
          vendor_id: booking.vendor_id,
          booking_date: event.event_date,
          start_time: startTime,
          end_time: endTime,
          event_name: event.event_name,
          location: event.location,
          customer_name: event.name,
          customer_phone: event.phone
        });

      if (bookingError) {
        alert(bookingError.message);
        setLoading(false);
        return;
      }

      /* UPDATE REQUEST STATUS */

      await supabase
        .from("booking_requests")
        .update({ status: "accepted" })
        .eq("id", booking.id);

      refresh();
      onClose();

    } catch (err) {

      console.error(err);
      alert("Something went wrong");

    }

    setLoading(false);
  }

  return (

    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >

      <div
        className="bg-white p-6 rounded-lg w-[400px] space-y-4"
        onClick={(e) => e.stopPropagation()}
      >

        <h2 className="text-lg font-semibold">
          Confirm Booking
        </h2>

        <p className="text-sm text-gray-500">
          {event.event_name}
        </p>

        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="border p-2 w-full rounded"
        />

        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="border p-2 w-full rounded"
        />

        <div className="flex gap-3">

          <button
            onClick={confirmBooking}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
            >

            {loading && <Loader size="sm" />}

            {loading ? "Confirming..." : "Confirm Booking"}

          </button>

          <button
            onClick={onClose}
            className="text-gray-500"
          >
            Cancel
          </button>

        </div>

      </div>

    </div>

  );
}