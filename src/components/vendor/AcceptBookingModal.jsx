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
    className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50"
    onClick={onClose}
  >
    <div
      className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl
        w-full sm:max-w-md
        max-h-[90vh] overflow-y-auto
        p-4 sm:p-6 space-y-5 sm:space-y-6
        animate-fadeIn"
      onClick={(e) => e.stopPropagation()}
    >

      {/* HEADER */}
      <div className="space-y-1">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
          Confirm Booking
        </h2>
        <p className="text-xs sm:text-sm text-gray-500">
          Add time and confirm this request
        </p>
      </div>

      {/* EVENT DETAILS */}
      <div className="border border-gray-200 rounded-xl p-3 sm:p-4 bg-gray-50 space-y-2">
        <p className="font-medium text-gray-900 text-sm sm:text-base">
          {event?.event_name || "Unnamed Event"}
        </p>

        <p className="text-xs sm:text-sm text-gray-600">
          {event?.event_date} • {event?.event_time}
        </p>

        <p className="text-xs sm:text-sm text-gray-600 break-words">
          {event?.location}
        </p>

        <div className="pt-2 text-xs sm:text-sm text-gray-700 space-y-1">
          <p><span className="font-medium">Customer:</span> {event?.name}</p>
          <p><span className="font-medium">Phone:</span> {event?.phone}</p>
          {event?.email && (
            <p><span className="font-medium">Email:</span> {event.email}</p>
          )}
        </div>
      </div>

      {/* TIME INPUT */}
      <div className="space-y-3">
            <p className="text-sm font-medium text-gray-800">
                Block your time
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                {/* START TIME */}
                <div className="space-y-1">
                <label className="text-xs text-gray-500 font-medium">
                    Start Time
                </label>
                <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="border border-gray-300 p-2.5 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                </div>

                {/* END TIME */}
                <div className="space-y-1">
                <label className="text-xs text-gray-500 font-medium">
                    End Time
                </label>
                <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="border border-gray-300 p-2.5 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                </div>

            </div>
            </div>

      {/* ACTIONS */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">

        <button
          onClick={confirmBooking}
          disabled={loading}
          className="bg-black text-white px-4 py-2.5 rounded-lg w-full flex items-center justify-center gap-2 hover:bg-gray-800 transition"
        >
          {loading && <Loader size="sm" />}
          {loading ? "Confirming..." : "Confirm Booking"}
        </button>

        <button
          onClick={onClose}
          className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition w-full sm:w-auto"
        >
          Cancel
        </button>

      </div>

    </div>
  </div>
);
}