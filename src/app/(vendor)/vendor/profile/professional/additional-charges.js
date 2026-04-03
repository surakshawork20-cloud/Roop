"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdditionalCharges() {
  const [charges, setCharges] = useState([]);
  const [userId, setUserId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    init();

    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
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
  const normalized = rows.map((c) => ({
    charge_type: c.charge_type || "",
    description: c.description || "",
  }));

  setCharges(normalized);
}

    setLoading(false);
  }

  function addCharge() {
    setCharges([
      ...charges,
      {
        charge_type: "",
        description: "",
      },
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
      description: c.description,
    }));

    if (rows.length > 0) {
      const { error } = await supabase
        .from("vendor_additional_charges")
        .insert(rows);

      if (error) {
        console.error("FULL ERROR:", JSON.stringify(error, null, 2));
        console.error("MESSAGE:", error?.message);
        console.error("DETAILS:", error?.details);
        console.error("HINT:", error?.hint);
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

      {/* MOBILE VIEW */}
      {isMobile ? (
        <div className="space-y-4">
          {charges.map((c, i) => (
            <div key={i} className="border rounded p-3 shadow-sm space-y-2">

              <input
                placeholder="Charge Type"
                value={c.charge_type || ""}
                onChange={(e) =>
                  updateCharge(i, "charge_type", e.target.value)
                }
                className="w-full border rounded px-2 py-2"
              />






              <input
                placeholder="Description"
                value={c.description || ""}
                onChange={(e) =>
                  updateCharge(i, "description", e.target.value)
                }
                className="w-full border rounded px-2 py-2"
              />

              <button
                onClick={() => removeCharge(i)}
                className="text-red-600 text-sm"
              >
                Delete
              </button>

            </div>
          ))}
        </div>
      ) : (
        /* DESKTOP TABLE */
        <div className="w-full overflow-x-auto">
          <table className="min-w-[700px] w-full text-sm border">
            <thead className="bg-gray-50">
              <tr>
                <th className="border p-2">Charge Type</th>
                <th className="border p-2">Description</th>
                <th className="border p-2"></th>
              </tr>
            </thead>

            <tbody>
              {charges.map((c, i) => (
                <tr key={i}>
                  <td className="border p-2">
                    <input
                      value={c.charge_type || ""}
                      onChange={(e) =>
                        updateCharge(i, "charge_type", e.target.value)
                      }
                      className="w-full border rounded px-2 py-1"
                    />
                  </td>

                  

                  <td className="border p-2">
                    <input
                      value={c.description || ""}
                      onChange={(e) =>
                        updateCharge(i, "description", e.target.value)
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
        </div>
      )}

      {/* BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <button onClick={addCharge} className="text-[#7A1820]">
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