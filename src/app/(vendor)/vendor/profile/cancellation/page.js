"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function CancellationPolicyPage() {
  const [form, setForm] = useState({});
  const [userId, setUserId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

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
      [name]: value,
    });
  }

  async function savePolicy() {
    if (!userId) return;

    setSaving(true);

    const { error } = await supabase
      .from("vendor_cancellation_policy")
      .upsert(
        {
          vendor_id: userId,
          ...form,
        },
        { onConflict: "vendor_id" }
      );

    setSaving(false);

    if (error) {
      console.error(error);
      alert("Error saving policy");
      return;
    }

    setSaved(true);
    setEditing(false);

    // optional UX feedback
    alert("Policy saved successfully");
  }

  if (loading) return null;

  return (
    <div className="max-w-4xl">
      {/* HEADER */}
      <div className="flex justify-between items-center pb-2">
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

      {/* EDIT MODE */}
      {editing && (
        <div className="space-y-6 pb-28">

          {/* 🚨 NO REFUND AT ANY TIME */}
          <div className="border rounded-xl p-4 space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.no_refund_on_cancel || false}
                onChange={(e) =>
                  setForm({
                    ...form,
                    no_refund_on_cancel: e.target.checked,
                    no_refund_within_48hr: false,
                  })
                }
                className="mt-1"
              />

              <div>
                <p className="font-medium text-gray-800">
                  No refund on cancellation
                </p>
                <p className="text-xs text-gray-500">
                  Applies to all timeframes
                </p>
              </div>
            </label>

            <input
              name="no_refund_notes"
              value={form.no_refund_notes || ""}
              onChange={handleChange}
              placeholder="Add notes (optional)"
              className="border rounded-lg px-3 py-2 w-full text-sm"
              disabled={!form.no_refund_on_cancel}
            />
          </div>

          {/* 🚨 NO REFUND WITHIN 48 HRS */}
          <div className="border rounded-xl p-4 ">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.no_refund_within_48hr || false}
                onChange={(e) =>
                  setForm({
                    ...form,
                    no_refund_within_48hr: e.target.checked,
                    no_refund_on_cancel: false,
                  })
                }
                disabled={form.no_refund_on_cancel}
                className="mt-1"
              />

              <div>
                <p className="font-medium text-gray-800">
                  No refund within 48 hrs
                </p>
                <p className="text-xs text-gray-500">
                  Refunds allowed only before 48 hrs
                </p>
              </div>
            </label>
          </div>

          {/* 🎯 PERCENTAGE RULES */}
          <div
            className={`space-y-4 ${
              form.no_refund_on_cancel ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <Scenario
              label="7+ days before event"
              percentName="cancel_7_days_percent"
              notesName="cancel_7_days_notes"
              form={form}
              handleChange={handleChange}
            />

            <Scenario
              label="48 hrs – 7 days before event"
              percentName="cancel_48hr_7days_percent"
              notesName="cancel_48hr_7days_notes"
              form={form}
              handleChange={handleChange}
            />
          </div>

          {/* ✅ SAVE BUTTON */}
          <div className="pt-4">
            <button
              onClick={savePolicy}
              disabled={saving}
              className="bg-[#7A1820] text-white px-6 py-2 rounded disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Policy"}
            </button>
          </div>
        </div>
      )}

      {/* VIEW MODE */}
      {saved && !editing && (
        <div className="space-y-4">

          {form.no_refund_on_cancel ? (
            <>
              <Row
                label="Cancellation Policy"
                value="No refund on cancellation"
              />

              {form.no_refund_notes && (
                <p className="text-xs text-gray-500">
                  {form.no_refund_notes}
                </p>
              )}
            </>
          ) : (
            <>
              <Row
                label="7+ Days Before Event"
                value={`${form.cancel_7_days_percent || 0}% refund`}
              />

              <Row
                label="48 hrs – 7 Days"
                value={`${form.cancel_48hr_7days_percent || 0}% refund`}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* COMPONENTS */

function Scenario({ label, percentName, notesName, form, handleChange }) {
  return (
    <div className="border rounded-xl p-4  space-y-3">

      <p className="text-sm font-medium text-gray-800">
        {label}
      </p>

      <div className="flex gap-2">
        <input
          type="number"
          name={percentName}
          value={form[percentName] || ""}
          onChange={handleChange}
          placeholder="%"
          className="border rounded-lg px-3 py-2 w-24"
        />

        <span className="text-sm text-gray-500 self-center">
          % refund
        </span>
      </div>

      <input
        name={notesName}
        value={form[notesName] || ""}
        onChange={handleChange}
        placeholder="Add notes (optional)"
        className="border rounded-lg px-3 py-2 w-full text-sm"
      />

    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-2">
      <span className="text-gray-700 font-medium">{label}</span>
      <span>{value}</span>
    </div>
  );
}