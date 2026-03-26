"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Loader from "@/components/Loader";

export default function BookingModal({ userId, onClose, refresh }) {

  const [form, setForm] = useState({
    booking_date: "",
    start_time: "",
    end_time: "",
    event_time: "",
    event_name: "",
    location: "",
    customer_name: "",
    customer_email: "",
    customer_phone: ""
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

async function createBooking() {

  if (!form.booking_date) {
    alert("Select a date");
    return;
  }

  setLoading(true);

  try {

    /* CHECK BLOCKED DATE */

    const { data: blocked } = await supabase
      .from("vendor_blocked_dates")
      .select("id")
      .eq("vendor_id", userId)
      .eq("blocked_date", form.booking_date)
      .maybeSingle();

    if (blocked) {
      alert("This date is blocked. Booking cannot be created.");
      setLoading(false);
      return;
    }

    /* CHECK TIME CONFLICT */

    const { data: existing } = await supabase
      .from("vendor_bookings")
      .select("*")
      .eq("vendor_id", userId)
      .eq("booking_date", form.booking_date);

    if (existing && existing.length > 0) {

      const conflict = existing.find((b) =>
        form.start_time < b.end_time &&
        form.end_time > b.start_time
      );

      if (conflict) {
        alert("This time slot overlaps with another booking.");
        setLoading(false);
        return;
      }
    }

    /* CREATE BOOKING */

    const { error } = await supabase
      .from("vendor_bookings")
      .insert({
        vendor_id: userId,
        ...form
      });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

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
        className="bg-white rounded-t-2xl sm:rounded-lg
        w-full sm:max-w-lg
        max-h-[90vh] overflow-y-auto
        p-4 sm:p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
        >

        <h2 className="text-base sm:text-lg font-semibold">
          Schedule Event
        </h2>

        <div className="space-y-4">

        {/* DATE + TIME GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

        <input
          type="date"
          name="booking_date"
          onChange={handleChange}
          className="border p-2.5 w-full rounded-md text-sm"
        />

        <input
          type="time"
          name="start_time"
          onChange={handleChange}
          className="border p-2.5 w-full rounded-md text-sm"
        />

        <input
          type="time"
          name="end_time"
          onChange={handleChange}
          className="border p-2.5 w-full rounded-md text-sm"
        />

        <input
          name="event_time"
          placeholder="Event Time (Morning / Evening)"
          onChange={handleChange}
          className="border p-2.5 w-full rounded-md text-sm"
        />
        </div>

        <input
          name="event_name"
          placeholder="Event Name"
          onChange={handleChange}
          className="border p-2.5 w-full rounded-md text-sm"
        />

        <input
          name="location"
          placeholder="Location"
          onChange={handleChange}
          className="border p-2.5 w-full rounded-md text-sm"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

        <input
          name="customer_name"
          placeholder="Customer Name"
          onChange={handleChange}
          className="border p-2.5 w-full rounded-md text-sm"
        />

        <input
          name="customer_phone"
          placeholder="Customer Phone"
          onChange={handleChange}
          className="border p-2.5 w-full rounded-md text-sm"
        />
        </div>

        <input
            name="customer_email"
            placeholder="Customer Email (optional)"
            onChange={handleChange}
            className="border p-2.5 w-full rounded-md text-sm"
        />

      </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">

          <button
                onClick={createBooking}
                disabled={loading}
                className="bg-[#7A1820] text-white px-4 py-2.5 rounded-md flex items-center justify-center gap-2 w-full"
                >

                {loading ? (
                    <>
                    <Loader size="sm" />
                    Saving...
                    </>
                ) : (
                    "Save Booking"
                )}

            </button>

            <button
                onClick={onClose}
                className="border px-4 py-2.5 rounded-md text-gray-600 w-full sm:w-auto"
            >
                Cancel
            </button>

        </div>

      </div>

    </div>

  );
}