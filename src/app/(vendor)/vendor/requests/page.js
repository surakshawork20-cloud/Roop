"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AcceptBookingModal from "@/components/vendor/AcceptBookingModal";


export default function VendorBookingsPage() {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

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

    <div className="p-8 max-w-5xl">

      <h1 className="text-2xl font-semibold mb-6">
        Booking Requests
      </h1>

      {loading && (
        <p className="text-gray-500">
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
              className="border rounded-lg p-5 flex justify-between items-center"
            >

              {/* EVENT INFO */}

              <div className="space-y-1">

                <p className="font-medium">
                  {event?.event_name || "Unnamed Event"}
                </p>

                <p className="text-sm text-gray-500">
                  Customer: {event?.name}
                </p>

                <p className="text-sm text-gray-500">
                  {event?.event_date}
                </p>

                <p className="text-sm text-gray-500">
                  {event?.event_time}
                </p>

                <p className="text-sm text-gray-500">
                  {event?.location}
                </p>

                <p className="text-sm text-gray-500">
                  Phone: {event?.phone}
                </p>

                {event?.email && (
                <p className="text-sm text-gray-500">
                    Email: {event.email}
                </p>
                )}

              </div>

              {/* STATUS ACTIONS */}

              <div className="flex items-center gap-3">

                {booking.status === "pending" && (

                  <>

                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="bg-green-600 text-white px-4 py-2 rounded text-sm"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => updateStatus(booking.id, "rejected")}
                      className="bg-red-600 text-white px-4 py-2 rounded text-sm"
                    >
                      Reject
                    </button>

                  </>

                )}

                {booking.status === "accepted" && (
                  <span className="text-green-600 font-medium">
                    Accepted
                  </span>
                )}

                {booking.status === "rejected" && (
                  <span className="text-red-600 font-medium">
                    Rejected
                  </span>
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

    </div>

  );

}