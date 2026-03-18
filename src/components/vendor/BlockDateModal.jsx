"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function BlockDateModal({ userId, onClose, refresh }) {

  const [date, setDate] = useState("");
  const [blockedDates, setBlockedDates] = useState([]);

  useEffect(() => {
    fetchBlockedDates();
  }, []);

  async function fetchBlockedDates() {

    const { data, error } = await supabase
      .from("vendor_blocked_dates")
      .select("*")
      .eq("vendor_id", userId)
      .order("blocked_date", { ascending: true });

    if (!error && data) {
      setBlockedDates(data);
    }

  }

  async function blockDay() {

    if (!date) {
      alert("Select a date");
      return;
    }

    const confirmBlock = confirm(
      "Block this entire day?\n\nNo bookings will be allowed."
    );

    if (!confirmBlock) return;

    const { error } = await supabase
      .from("vendor_blocked_dates")
      .insert({
        vendor_id: userId,
        blocked_date: date
      });

    if (error) {
      alert(error.message);
      return;
    }

    setDate("");
    fetchBlockedDates();
    refresh();
  }

  async function unblockDate(id) {

    const confirmDelete = confirm(
      "Unblock this date?"
    );

    if (!confirmDelete) return;

    await supabase
      .from("vendor_blocked_dates")
      .delete()
      .eq("id", id);

    fetchBlockedDates();
    refresh();
  }

  return (

    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >

      <div
        className="bg-white p-6 rounded-lg w-[420px] space-y-6 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >

        <h2 className="font-semibold text-lg">
          Block Date
        </h2>

        {/* DATE INPUT */}

        <div className="flex gap-2">

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 w-full rounded"
          />

          <button
            onClick={blockDay}
            className="bg-gray-800 text-white px-4 py-2 rounded"
          >
            Block
          </button>

        </div>

        {/* BLOCKED DATES LIST */}

        <div className="space-y-2">

          <p className="text-sm font-medium text-gray-600">
            Blocked Dates
          </p>

          {blockedDates.length === 0 && (
            <p className="text-sm text-gray-400">
              No blocked dates
            </p>
          )}

          {blockedDates.map((d) => (

            <div
              key={d.id}
              className="flex justify-between items-center border p-2 rounded"
            >

              <span className="text-sm">
                {d.blocked_date}
              </span>

              <button
                onClick={() => unblockDate(d.id)}
                className="text-red-600 text-sm"
              >
                Unblock
              </button>

            </div>

          ))}

        </div>

        {/* CLOSE BUTTON */}

        <div className="flex justify-end">

          <button
            onClick={onClose}
            className="text-gray-500"
          >
            Close
          </button>

        </div>

      </div>

    </div>

  );
}