"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { supabase } from "@/lib/supabaseClient";

export default function VendorBookings() {

  const [userId, setUserId] = useState(null);
  const [bookings, setBookings] = useState([]);

  const [selectedDate, setSelectedDate] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const [form, setForm] = useState({
    start_time: "",
    end_time: "",
    event_name: "",
    location: "",
    customer_name: "",
    customer_email: "",
    customer_phone: ""
  });

  useEffect(() => {
    init();
  }, []);

  async function init() {

    const { data } = await supabase.auth.getUser();

    if (!data.user) return;

    setUserId(data.user.id);

    fetchBookings(data.user.id);

  }

  async function fetchBookings(vendorId) {

    const { data } = await supabase
      .from("vendor_bookings")
      .select("*")
      .eq("vendor_id", vendorId)
      .order("booking_date", { ascending: true });

    if (data) setBookings(data);

  }

  function handleChange(e) {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  }

  async function createBooking() {

    if (!selectedDate) {
      alert("Please select a date");
      return;
    }

    const { error } = await supabase
      .from("vendor_bookings")
      .insert({
        vendor_id: userId,
        booking_date: selectedDate,
        ...form
      });

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    resetForm();
    fetchBookings(userId);

  }

  async function deleteBooking(id) {

    const confirmDelete = confirm("Delete this booking?");

    if (!confirmDelete) return;

    await supabase
      .from("vendor_bookings")
      .delete()
      .eq("id", id);

    fetchBookings(userId);

  }

  function resetForm() {

    setForm({
      start_time: "",
      end_time: "",
      event_name: "",
      location: "",
      customer_name: "",
      customer_email: "",
      customer_phone: ""
    });

    setSelectedDate(null);
    setShowBookingForm(false);

  }

  return (

    <div className="max-w-6xl space-y-6">

      <h1 className="text-2xl font-semibold">
        Booking Management
      </h1>

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

            {bookings.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-400">
                  No bookings yet
                </td>
              </tr>
            )}

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

      {/* CREATE BOOKING BUTTON */}

      {!showBookingForm && (

        <button
          onClick={() => setShowBookingForm(true)}
          className="bg-[#7A1820] text-white px-5 py-2 rounded-md"
        >
          + Create Booking
        </button>

      )}

      {/* BOOKING FORM */}

      {showBookingForm && (

        <div className="border p-6 rounded-lg space-y-6">

          <div className="flex justify-between">

            <h2 className="font-semibold text-lg">
              Create Booking
            </h2>

            <button
              onClick={resetForm}
              className="text-gray-500 text-sm"
            >
              Cancel
            </button>

          </div>

          <Calendar
            onChange={(date) =>
              setSelectedDate(date.toISOString().split("T")[0])
            }
          />

          {selectedDate && (

            <div className="space-y-4">

              <p className="text-sm text-gray-500">
                Selected Date: {selectedDate}
              </p>

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
                name="customer_email"
                placeholder="Customer Email"
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />

              <input
                name="customer_phone"
                placeholder="Customer Phone"
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />

              <button
                onClick={createBooking}
                className="bg-[#7A1820] text-white px-5 py-2 rounded"
              >
                Save Booking
              </button>

            </div>

          )}

        </div>

      )}

    </div>

  );
}