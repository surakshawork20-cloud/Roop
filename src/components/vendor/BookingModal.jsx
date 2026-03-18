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
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        onClick={onClose}
        >

      <div
        className="bg-white p-6 rounded-lg w-[420px] space-y-4"
        onClick={(e) => e.stopPropagation()}
        >

        <h2 className="text-lg font-semibold">
          Schedule Event
        </h2>

        <input
          type="date"
          name="booking_date"
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />

        <input
          type="time"
          name="start_time"
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />

        <input
          type="time"
          name="end_time"
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />

        <input
          name="event_time"
          placeholder="Event Time (Morning / Evening)"
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />

        <input
          name="event_name"
          placeholder="Event Name"
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />

        <input
          name="location"
          placeholder="Location"
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />

        <input
          name="customer_name"
          placeholder="Customer Name"
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />

        <input
          name="customer_phone"
          placeholder="Customer Phone"
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />

        <input
            name="customer_email"
            placeholder="Customer Email (optional)"
            onChange={handleChange}
            className="border p-2 w-full rounded"
        />

        <div className="flex gap-3">

          <button
                onClick={createBooking}
                disabled={loading}
                className="bg-[#7A1820] text-white px-4 py-2 rounded flex items-center justify-center gap-2"
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
                className="border px-4 py-2 rounded text-gray-600"
            >
                Cancel
            </button>

        </div>

      </div>

    </div>

  );
}