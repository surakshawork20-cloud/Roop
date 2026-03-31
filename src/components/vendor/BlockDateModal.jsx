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
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50"
      onClick={onClose}
    >

      <div
        className="bg-white rounded-t-2xl sm:rounded-lg
        w-full sm:max-w-md
        max-h-[90vh] overflow-y-auto
        p-4 sm:p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >

        <h2 className="font-semibold text-base sm:text-lg">
          Block Date
        </h2>

        {/* DATE INPUT */}

        <div className="flex flex-col sm:flex-row gap-2">

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2.5 w-full rounded-md text-sm sm:text-base"
          />

          <button
            onClick={blockDay}
            className="bg-gray-800 text-white px-4 py-2.5 rounded-md w-full sm:w-auto"
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
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border p-3 rounded-md"
            >

              <span className="text-sm">
                {new Date(d.blocked_date).toLocaleDateString("en-GB")}
              </span>

              <button
                onClick={() => unblockDate(d.id)}
                className="text-red-600 text-sm self-start sm:self-auto"
              >
                Unblock
              </button>

            </div>

          ))}

        </div>

        {/* CLOSE BUTTON */}

        <div className="flex justify-end pt-2">

          <button
            onClick={onClose}
            className="text-gray-500 text-sm"
          >
            Close
          </button>

        </div>

      </div>

    </div>

  );
}