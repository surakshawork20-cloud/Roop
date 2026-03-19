"use client";

import { useState, useMemo, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import BookingModal from "@/components/marketplace/BookingModal";
import { supabase } from "@/lib/supabaseClient";

export default function ArtistCalendar({ vendorId }){

  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);
  const [pendingDate, setPendingDate] = useState(null);

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2,"0");
    const day = String(date.getDate()).padStart(2,"0");
    return `${year}-${month}-${day}`;
  }

  /* ----------- Normalize Data ----------- */
const bookingSet = useMemo(() => {
  return new Set(
    bookings.map(b =>
      formatDate(new Date(b.booking_date))
    )
  );
}, [bookings]);

const blockedSet = useMemo(() => {
  return new Set(blockedDates);
}, [blockedDates]);
  /* ----------- Tile Color Logic ----------- */

function getTileClass({ date, view }) {

  if (view !== "month") return;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const d = formatDate(date);

  if (date < today) return "calendar-grey";

  if (blockedSet.has(d)) return "calendar-red";
  if (bookingSet.has(d)) return "calendar-yellow";

  return "calendar-green";
}





  async function fetchBookings() {

  const { data } = await supabase
    .from("vendor_bookings")
    .select("booking_date")
    .eq("vendor_id", vendorId);

  if (data) setBookings(data);
}

async function fetchBlockedDates() {

  const { data } = await supabase
    .from("vendor_blocked_dates")
    .select("blocked_date")
    .eq("vendor_id", vendorId);

  if (data) {

    const formatted = data.map(
      d => formatDate(new Date(d.blocked_date))
    );

    setBlockedDates(formatted);
  }
}
useEffect(() => {

  if (!vendorId) return;

  fetchBookings();
  fetchBlockedDates();

}, [vendorId]);

return (

  <div className="space-y-4">

{!showCalendar && (
  <button
    onClick={() => setShowCalendar(true)}
    className="bg-[#7A1820] text-white px-6 py-3 rounded-lg"
  >
    View Availability Calendar
  </button>
)}

    {showCalendar && (

 <div
  className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
  onClick={() => setShowCalendar(false)}
>

    <div
    className="bg-white rounded-xl shadow-xl p-6 relative"
    onClick={(e) => e.stopPropagation()} // ✅ FIX
  >

      <button
        onClick={() => setShowCalendar(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-black"
      >
        ✕
      </button>

      <h2 className="text-lg font-semibold mb-4">
        Artist Availability
      </h2>

      <Calendar
        tileClassName={getTileClass}
        minDate={new Date()}
      />

    </div>

  </div>

)}

    {selectedDate && (

      <BookingModal
        vendorId={vendorId}
        selectedDate={selectedDate}
        onClose={() => setSelectedDate(null)}
      />

    )}

  </div>

);
}