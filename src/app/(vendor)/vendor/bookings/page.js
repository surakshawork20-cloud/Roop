"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { supabase } from "@/lib/supabaseClient";

import BookingModal from "@/components/vendor/BookingModal";
import BlockDateModal from "@/components/vendor/BlockDateModal";

export default function VendorBookings() {

  const [userId, setUserId] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    init();
  }, []);

  async function init() {

    const { data } = await supabase.auth.getUser();

    if (!data.user) return;

    const id = data.user.id;

    setUserId(id);

    fetchBookings(id);
    fetchBlockedDates(id);
  }

  async function fetchBookings(vendorId) {

    const { data } = await supabase
      .from("vendor_bookings")
      .select("*")
      .eq("vendor_id", vendorId)
      .order("booking_date", { ascending: true });

    if (data) setBookings(data);
  }

async function fetchBlockedDates(vendorId) {

    const { data } = await supabase
      .from("vendor_blocked_dates")
      .select("blocked_date")
      .eq("vendor_id", vendorId);

    if (data) {
      const formatted = data.map(
        (d) => new Date(d.blocked_date).toLocaleDateString("en-CA")
      );

      setBlockedDates(formatted);
    }

}

  async function deleteBooking(id) {

    const confirmDelete = confirm(
      "Are you sure you want to delete this booking?\n\nThis action is irreversible."
    );

    if (!confirmDelete) return;

    await supabase
      .from("vendor_bookings")
      .delete()
      .eq("id", id);

    fetchBookings(userId);
  }

  function getTileClass({ date }) {

    const d = date.toLocaleDateString("en-CA");

    if (blockedDates.includes(d)) return "calendar-red";

    const dayBookings = bookings.filter(
      (b) => b.booking_date === d
    );

    if (dayBookings.length === 0) return "calendar-green";

    return "calendar-yellow";
  }

  return (

    <div className="max-w-6xl space-y-6">

      <h1 className="text-2xl font-semibold">
        Booking Management
      </h1>

      {/* ACTION BUTTONS */}

      <div className="flex gap-4">

        <button
          onClick={() => setShowBookingModal(true)}
          className="bg-[#7A1820] text-white px-5 py-2 rounded"
        >
          Schedule Event
        </button>

        <button
          onClick={() => setShowBlockModal(true)}
          className="bg-gray-800 text-white px-5 py-2 rounded"
        >
          Block Date
        </button>

        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="border px-5 py-2 rounded"
        >
          View Calendar
        </button>

      </div>

      {/* CALENDAR */}

      {showCalendar && (

        <Calendar
          tileClassName={getTileClass}
        />

      )}

      {/* BOOKINGS TABLE */}

      <div className="border rounded-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-50">

            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-left">Event</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Action</th>
            </tr>

          </thead>

          <tbody>

            {bookings.map((b) => (

              <tr key={b.id} className="border-t">

                <td className="p-3">{b.booking_date}</td>

                <td className="p-3">
                  {b.start_time} - {b.end_time}
                </td>

                <td className="p-3">{b.event_name}</td>

                <td className="p-3">{b.location}</td>

                <td className="p-3">
                  {b.customer_name}
                  <br />
                  <span className="text-xs text-gray-500">
                    {b.customer_phone}
                  </span>
                </td>

                <td className="p-3">

                  <button
                    onClick={() => deleteBooking(b.id)}
                    className="text-red-600 text-sm"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {showBookingModal && (
        <BookingModal
          userId={userId}
          onClose={() => setShowBookingModal(false)}
          refresh={() => fetchBookings(userId)}
        />
      )}

      {showBlockModal && (
        <BlockDateModal
          userId={userId}
          onClose={() => setShowBlockModal(false)}
          refresh={() => fetchBlockedDates(userId)}
        />
      )}

    </div>
  );
}