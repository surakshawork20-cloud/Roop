"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AcceptBookingModal from "@/components/vendor/AcceptBookingModal";
import AlertModal from "@/components/ui/AlertModal";


export default function VendorBookingsPage() {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rejectBooking, setRejectBooking] = useState(null);

  /* --------------------------
  FETCH BOOKINGS
  -------------------------- */

  async function fetchBookings() {

    try {

      const { data: userData } = await supabase.auth.getUser();
      const vendor = userData?.user;

      if (!vendor) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("booking_requests")
        .select(`
            id,
            status,
            customer_id,
            vendor_id,
            event_id,
            customer_events!booking_requests_event_id_fkey (
            event_name,
            event_date,
            event_time,
            location,
            phone,
            name
            )
        `)
        .eq("vendor_id", vendor.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Booking fetch error:", error.message, error.details);
        setLoading(false);
        return;
        }

      setBookings(data || []);
      setLoading(false);

    } catch (err) {

      console.error("Unexpected error:", err);
      setLoading(false);

    }
  }

  /* --------------------------
  UPDATE STATUS
  -------------------------- */

  async function updateStatus(id, status) {

    const { error } = await supabase
      .from("booking_requests")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Error updating booking");
      return;
    }

    fetchBookings();
  }

  /* --------------------------
  INITIAL LOAD
  -------------------------- */

  useEffect(() => {
    fetchBookings();
  }, []);

  /* --------------------------
  UI
  -------------------------- */

  return (

    <div className="p-8 max-w-5xl mx-auto  min-h-screen">

      <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-8">
        Booking Requests
        </h1>

      {loading && (
        <p className="text-gray-500 animate-pulse">
          Loading booking requests...
        </p>
      )}

      {!loading && bookings.length === 0 && (
        <p className="text-gray-500">
          No booking requests yet.
        </p>
      )}

      <div className="space-y-4">

        {bookings.map((booking) => {

          const event = booking.customer_events;

          return (

            <div
                key={booking.id}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
                >

                {/* LEFT SIDE */}
                <div className="space-y-3">

                    {/* EVENT TITLE */}
                    <div>
                    <p className="text-lg font-semibold text-gray-900">
                        {event?.event_name || "Unnamed Event"}
                    </p>
                    <p className="text-sm text-gray-500">
                        {event?.event_date} • {event?.event_time}
                    </p>
                    </div>

                    {/*  CUSTOMER INFO */}
                    <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium text-gray-800">Customer:</span> {event?.name}</p>
                    {/* <p><span className="font-medium text-gray-800">Phone:</span> {event?.phone}</p> */}
                    {event?.email && (
                        <p><span className="font-medium text-gray-800">Email:</span> {event.email}</p>
                    )}
                    </div>

                    {/* LOCATION */}
                    <p className="text-sm text-gray-500">
                    📍 {event?.location}
                    </p>

                </div>

                {/* RIGHT SIDE */}
                <div className="flex flex-col items-end gap-3">

                    {/* STATUS BADGE */}
                    {booking.status === "accepted" && (
                    <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium">
                        Accepted
                    </span>
                    )}

                    {booking.status === "rejected" && (
                    <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700 font-medium">
                        Rejected
                    </span>
                    )}

                    {/* ACTION BUTTONS */}
                    {booking.status === "pending" && (
                    <div className="flex gap-2">

                        <button
                        onClick={() => setSelectedBooking(booking)}
                        className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
                        >
                        Accept
                        </button>

                        <button
                        onClick={() => setRejectBooking(booking)}
                        className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
                        >
                        Reject
                        </button>

                    </div>
                    )}

                </div>

                </div>

          );

        })}

      </div>

            {selectedBooking && (

                <AcceptBookingModal
                    booking={selectedBooking}
                    event={selectedBooking.customer_events}
                    refresh={fetchBookings}
                    onClose={() => setSelectedBooking(null)}
                />

                )}
                {rejectBooking && (
                    <AlertModal
                        title="Reject Booking?"
                        description="This action cannot be undone."
                        confirmText="Yes, Reject"
                        cancelText="Cancel"
                        type="danger"
                        onClose={() => setRejectBooking(null)}
                        onConfirm={() => {
                        updateStatus(rejectBooking.id, "rejected");
                        setRejectBooking(null);
                        }}
                    />
                    )}
    </div>

  );

}