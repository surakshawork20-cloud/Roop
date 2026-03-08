"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AvailabilityPage() {

  const [form, setForm] = useState({});
  const [userId, setUserId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    init();
  }, []);

  async function init() {

    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) return;

    setUserId(user.id);

    const { data: availability } = await supabase
      .from("vendor_availability")
      .select("*")
      .eq("vendor_id", user.id)
      .single();

    if (availability) {
      setForm(availability);
      setSaved(true);
      setEditing(false);
    } else {
      setEditing(true);
    }

    setLoading(false);
  }

  function update(day, field, value) {

    setForm({
      ...form,
      [`${day}_${field}`]: value
    });

  }

  async function saveAvailability() {

    const { error } = await supabase
      .from("vendor_availability")
      .upsert(
        {
          vendor_id: userId,
          ...form
        },
        {
          onConflict: "vendor_id"
        }
      );

    if (error) {
      console.error(error);
      alert("Error saving availability");
      return;
    }

    setSaved(true);
    setEditing(false);

  }

  if (loading) return null;

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday"
  ];

  return (

    <div className="max-w-4xl">

      <div className="flex justify-between mb-6">

        <h1 className="text-2xl font-semibold">
          Availability Setup
        </h1>

        {saved && !editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-[#7A1820]"
          >
            Edit
          </button>
        )}

      </div>

      {editing && (

        <div className="space-y-4">

          {days.map((day) => (

            <div
              key={day}
              className="grid grid-cols-[140px_320px_1fr] gap-6 items-center"
            >

              <div className="capitalize font-medium">
                {day}
              </div>

              <div className="flex items-center gap-2">

                <input
                    type="time"
                    step="60"
                    min="00:00"
                    max="23:59"
                    value={form[`${day}_from`] || ""}
                    onChange={(e) =>
                      update(day, "from", e.target.value)
                    }
                    className="border rounded px-2 py-1"
                  />

                <span className="text-gray-500">to</span>

                <input
                  type="time"
                  step="60"
                  value={form[`${day}_to`] || ""}
                  onChange={(e) =>
                    update(day, "to", e.target.value)
                  }
                  className="border rounded px-2 py-1"
                />

              </div>

              <textarea
                placeholder="Notes / Buffer time"
                value={form[`${day}_notes`] || ""}
                onChange={(e) =>
                  update(day, "notes", e.target.value)
                }
                rows={1}
                className="border rounded px-2 py-1 w-full"
              />

            </div>

          ))}

          <button
            onClick={saveAvailability}
            className="bg-[#7A1820] text-white px-6 py-2 rounded"
          >
            Save Availability
          </button>

        </div>

      )}

      {saved && !editing && (

        <div className="space-y-3">

          {days.map((day) => (

            <div
              key={day}
              className="flex justify-between border-b pb-2"
            >

              <span className="capitalize text-gray-600">
                {day}
              </span>

              <span>

                {form[`${day}_from`] && form[`${day}_to`]
                  ? `${form[`${day}_from`]} - ${form[`${day}_to`]}`
                  : "-"}

              </span>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}