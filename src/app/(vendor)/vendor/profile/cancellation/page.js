"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function CancellationPolicyPage() {

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

    const { data: policy } = await supabase
      .from("vendor_cancellation_policy")
      .select("*")
      .eq("vendor_id", user.id)
      .single();

    if (policy) {
      setForm(policy);
      setSaved(true);
      setEditing(false);
    } else {
      setEditing(true);
    }

    setLoading(false);

  }

  function handleChange(e) {

    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });

  }

  async function savePolicy() {

    const { error } = await supabase
      .from("vendor_cancellation_policy")
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
      alert("Error saving policy");
      return;
    }

    setSaved(true);
    setEditing(false);

  }

  if (loading) return null;

  return (

    <div className="max-w-4xl">

      <div className="flex justify-between mb-6">

        <h1 className="text-2xl font-semibold">
          Cancellation & Refund Policy
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

        <div className="space-y-6">

          <Scenario
            label="Customer cancels 7+ days before event"
            percentName="cancel_7_days_percent"
            notesName="cancel_7_days_notes"
            form={form}
            handleChange={handleChange}
          />

          <Scenario
            label="Customer cancels 48 hrs – 7 days before event"
            percentName="cancel_48hr_7days_percent"
            notesName="cancel_48hr_7days_notes"
            form={form}
            handleChange={handleChange}
          />

          <Scenario
            label="Customer cancels within 48 hrs of event"
            percentName="cancel_within_48hr_percent"
            notesName="cancel_within_48hr_notes"
            form={form}
            handleChange={handleChange}
          />

          <Scenario
            label="Customer no-show / last-minute refusal"
            percentName="no_show_percent"
            notesName="no_show_notes"
            form={form}
            handleChange={handleChange}
          />

          <button
            onClick={savePolicy}
            className="bg-[#7A1820] text-white px-6 py-2 rounded-md"
          >
            Save Policy
          </button>

        </div>

      )}

      {saved && !editing && (

        <div className="space-y-4">

          <Row
            label="7+ Days Before Event"
            value={`${form.cancel_7_days_percent || 0}%`}
          />

          <Row
            label="48 hrs – 7 Days"
            value={`${form.cancel_48hr_7days_percent || 0}%`}
          />

          <Row
            label="Within 48 hrs"
            value={`${form.cancel_within_48hr_percent || 0}%`}
          />

          <Row
            label="No-show"
            value={`${form.no_show_percent || 0}%`}
          />

        </div>

      )}

    </div>

  );

}

function Scenario({ label, percentName, notesName, form, handleChange }) {

  return (

    <div className="grid grid-cols-[260px_120px_1fr] gap-4 items-center">

      <div className="text-gray-700">
        {label}
      </div>

      <input
        type="number"
        name={percentName}
        value={form[percentName] || ""}
        onChange={handleChange}
        placeholder="%"
        className="border rounded px-3 py-2"
      />

      <input
        name={notesName}
        value={form[notesName] || ""}
        onChange={handleChange}
        placeholder="Notes"
        className="border rounded px-3 py-2"
      />

    </div>

  );

}

function Row({ label, value }) {

  return (

    <div className="flex justify-between border-b pb-2">

      <span className="text-gray-500">
        {label}
      </span>

      <span>
        {value}
      </span>

    </div>

  );

}