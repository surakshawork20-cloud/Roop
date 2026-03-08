"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdditionalCharges() {

  const [charges, setCharges] = useState([]);
  const [userId, setUserId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    init();
  }, []);

  async function init() {

    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) return;

    setUserId(user.id);

    const { data: rows } = await supabase
      .from("vendor_additional_charges")
      .select("*")
      .eq("vendor_id", user.id);

    if (rows) {
      setCharges(rows);
    }

    setLoading(false);
  }

  function addCharge() {

    setCharges([
      ...charges,
      {
        charge_type: "",
        fee_type: "",
        amount: "",
        note: "",
        comments: ""
      }
    ]);

  }

  function updateCharge(index, field, value) {

    const updated = [...charges];
    updated[index][field] = value;

    setCharges(updated);
  }

  function removeCharge(index) {

    const updated = [...charges];
    updated.splice(index, 1);

    setCharges(updated);
  }

  async function saveCharges() {

    setSaving(true);

    await supabase
      .from("vendor_additional_charges")
      .delete()
      .eq("vendor_id", userId);

    const rows = charges.map((c) => ({
      vendor_id: userId,
      charge_type: c.charge_type,
      fee_type: c.fee_type,
      amount: c.amount ? Number(c.amount) : null,
      note: c.note,
      comments: c.comments
    }));

    if (rows.length > 0) {

      const { error } = await supabase
        .from("vendor_additional_charges")
        .insert(rows);

      if (error) {
        console.error(error);
        alert("Error saving charges");
        setSaving(false);
        return;
      }

    }

    setSaving(false);
    alert("Charges saved");

  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (

    <div>

      <table className="w-full text-sm border">

        <thead className="bg-gray-50">

          <tr>

            <th className="border p-2">Charge Type</th>
            <th className="border p-2">Fee Type</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Note</th>
            <th className="border p-2">Comments</th>
            <th className="border p-2"></th>

          </tr>

        </thead>

        <tbody>

          {charges.map((c, i) => (

            <tr key={i}>

              <td className="border p-2">

                <input
                  value={c.charge_type}
                  onChange={(e) =>
                    updateCharge(i, "charge_type", e.target.value)
                  }
                  className="w-full border rounded px-2 py-1"
                />

              </td>

              <td className="border p-2">

                <select
                  value={c.fee_type}
                  onChange={(e) =>
                    updateCharge(i, "fee_type", e.target.value)
                  }
                  className="w-full border rounded px-2 py-1"
                >

                  <option value="">Select</option>
                  <option value="fixed">Fixed</option>
                  <option value="per_km">Per km</option>
                  <option value="per_hour">Per hour</option>
                  <option value="other">Other</option>

                </select>

              </td>

              <td className="border p-2">

                <input
                  type="number"
                  value={c.amount}
                  onChange={(e) =>
                    updateCharge(i, "amount", e.target.value)
                  }
                  className="w-full border rounded px-2 py-1"
                />

              </td>

              <td className="border p-2">

                <input
                  value={c.note}
                  onChange={(e) =>
                    updateCharge(i, "note", e.target.value)
                  }
                  className="w-full border rounded px-2 py-1"
                />

              </td>

              <td className="border p-2">

                <input
                  value={c.comments}
                  onChange={(e) =>
                    updateCharge(i, "comments", e.target.value)
                  }
                  className="w-full border rounded px-2 py-1"
                />

              </td>

              <td className="border p-2">

                <button
                  onClick={() => removeCharge(i)}
                  className="text-red-600 text-sm"
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      <div className="flex gap-4 mt-4">

        <button
          onClick={addCharge}
          className="text-[#7A1820]"
        >
          + Add Charge
        </button>

        <button
          onClick={saveCharges}
          disabled={saving}
          className="bg-[#7A1820] text-white px-5 py-2 rounded"
        >
          {saving ? "Saving..." : "Save Charges"}
        </button>

      </div>

    </div>

  );
}