"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function PaymentsPage() {

  const [form, setForm] = useState({
    payment_structure: "",
    accept_upi: false,
    accept_cash: false,
    accept_bank_transfer: false,
    provides_invoice: null,
    notes: ""
  });

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

    const { data: settings } = await supabase
      .from("vendor_payment_settings")
      .select("*")
      .eq("vendor_id", user.id)
      .single();

    if (settings) {
      setForm(settings);
      setSaved(true);
      setEditing(false);
    } else {
      setEditing(true);
    }

    setLoading(false);

  }

  function handleChange(e) {

    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });

  }

  async function savePayments() {

    if (!form.payment_structure) {
      alert("Payment structure is required");
      return;
    }

    const { error } = await supabase
      .from("vendor_payment_settings")
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
      alert("Error saving payment settings");
      return;
    }

    setSaved(true);
    setEditing(false);

  }

  if (loading) return null;

  return (

    <div className="max-w-3xl">

      <div className="flex justify-between mb-6">

        <h1 className="text-2xl font-semibold">
          Payments & Settlement
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

          {/* Payment Structure */}

          <div>

            <label className="block text-sm mb-1">
              Payment Structure *
            </label>

            <input
              name="payment_structure"
              value={form.payment_structure || ""}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              placeholder="Example: Advance 50% + Final settlement 50%"
            />

          </div>

          {/* Payment Modes */}

          <div>

            <label className="block text-sm mb-2">
              Accepted Payment Modes
            </label>

            <div className="flex gap-6">

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="accept_upi"
                  checked={form.accept_upi || false}
                  onChange={handleChange}
                />
                UPI
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="accept_cash"
                  checked={form.accept_cash || false}
                  onChange={handleChange}
                />
                Cash
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="accept_bank_transfer"
                  checked={form.accept_bank_transfer || false}
                  onChange={handleChange}
                />
                Bank Transfer
              </label>

            </div>

          </div>

          {/* Invoice */}

          <div>

            <label className="block text-sm mb-2">
              Invoice / Receipt Provided?
            </label>

            <div className="flex gap-6">

              <label className="flex items-center gap-2">

                <input
                  type="radio"
                  name="provides_invoice"
                  value="true"
                  checked={form.provides_invoice === true}
                  onChange={() =>
                    setForm({ ...form, provides_invoice: true })
                  }
                />

                Yes

              </label>

              <label className="flex items-center gap-2">

                <input
                  type="radio"
                  name="provides_invoice"
                  value="false"
                  checked={form.provides_invoice === false}
                  onChange={() =>
                    setForm({ ...form, provides_invoice: false })
                  }
                />

                No

              </label>

            </div>

          </div>

          {/* Notes */}

          <div>

            <label className="block text-sm mb-1">
              Notes (optional)
            </label>

            <textarea
              name="notes"
              value={form.notes || ""}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded-md px-3 py-2"
            />

          </div>

          <button
            onClick={savePayments}
            className="bg-[#7A1820] text-white px-6 py-2 rounded-md"
          >
            Save
          </button>

        </div>

      )}

      {saved && !editing && (

        <div className="space-y-4">

          <Row label="Payment Structure" value={form.payment_structure} />

          <Row
            label="Accepted Modes"
            value={[
              form.accept_upi && "UPI",
              form.accept_cash && "Cash",
              form.accept_bank_transfer && "Bank Transfer"
            ]
              .filter(Boolean)
              .join(", ")
            }
          />

          <Row
            label="Invoice Provided"
            value={form.provides_invoice ? "Yes" : "No"}
          />

          <Row label="Notes" value={form.notes || "-"} />

        </div>

      )}

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
        {value || "-"}
      </span>

    </div>

  );

}