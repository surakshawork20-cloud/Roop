"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ServiceCapabilities() {

  const [form, setForm] = useState({});
  const [userId, setUserId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    init();
  }, []);

  async function init() {

    const { data } = await supabase.auth.getUser();
    const user = data.user;

    setUserId(user.id);

    const { data: row } = await supabase
      .from("vendor_service_capabilities")
      .select("*")
      .eq("vendor_id", user.id)
      .single();

    if (row) {
      setForm(row);
    }

    setLoading(false);
  }

  function update(field, value) {

    setForm({
      ...form,
      [field]: value
    });

  }

  async function save() {

    const required = [
      "years_experience",
      "expertise",
      "artist_type",
      "max_bookings",
      "lead_time_hours"
    ];

    for (const r of required) {
      if (!form[r]) {
        alert("Please fill required fields");
        return;
      }
    }

    setSaving(true);

    const { error } = await supabase
      .from("vendor_service_capabilities")
      .upsert(
        {
          vendor_id: userId,
          ...form
        },
        { onConflict: "vendor_id" }
      );

    setSaving(false);

    if (error) {
      console.error(error);
      alert("Error saving");
      return;
    }

    alert("Saved successfully");

  }

  if (loading) return <div>Loading...</div>;

  return (

    <div className="space-y-6">

      <Input label="Years of Experience" value={form.years_experience} onChange={(v)=>update("years_experience",v)} />

      {/* Expertise */}

      <RadioGroup
        label="Expertise"
        value={form.expertise}
        options={["North Indian","South Indian","Both"]}
        onChange={(v)=>update("expertise",v)}
      />

      {/* Dark Skin */}

      <RadioGroup
        label="Experienced with dusky/dark skintone"
        value={form.experience_dark_skin}
        options={["Yes","No"]}
        onChange={(v)=>update("experience_dark_skin",v==="Yes")}
      />

{/*}
      {form.experience_dark_skin && (
        <Input
          label="Details"
          value={form.dark_skin_details}
          onChange={(v)=>update("dark_skin_details",v)}
        />
      )}
      */}

      {/* Artist Type */}

      <RadioGroup
        label="Solo or Team"
        value={form.artist_type}
        options={["Solo","Team"]}
        onChange={(v)=>update("artist_type",v)}
      />

      {form.artist_type === "Team" && (
        <Input
          label="Team Size"
          value={form.team_size}
          onChange={(v)=>update("team_size",v)}
        />
      )}

      {/* Brands */}

      <div>

        <label className="font-medium block mb-2">
          Products Used
        </label>

        {(form.brands || []).map((brand, index) => (
          <div key={index} className="flex gap-2 mb-2">

            <input
              value={brand}
              onChange={(e) => {
                const updated = [...(form.brands || [])];
                updated[index] = e.target.value;
                update("brands", updated);
              }}
              className="border rounded px-3 py-2 w-full"
            />

            <button
              onClick={() => {
                const updated = form.brands.filter((_, i) => i !== index);
                update("brands", updated);
              }}
            >
              ❌
            </button>

          </div>
        ))}

        <button
          onClick={() => {
            update("brands", [...(form.brands || []), ""]);
          }}
          className="text-sm text-blue-600"
        >
          + Add Brand
        </button>

      </div>

      {/* Hygiene */}

      <div>

        <label className="font-medium block mb-2">
          Hygiene Practices
        </label>

        {[
          ["hygiene_brush_sanitised","Brushes sanitised"],
          ["hygiene_disposable","Disposable applicators"],
          ["hygiene_sanitised_kit","Sanitised kit"],
          ["hygiene_fresh_sponges","Fresh sponges"]
        ].map(([field,label])=>(

          <label key={field} className="block">

            <input
              type="checkbox"
              checked={form[field] || false}
              onChange={(e)=>update(field,e.target.checked)}
            />

            <span className="ml-2">{label}</span>

          </label>

        ))}

      </div>

      <Input label="Maximum bookings per day" value={form.max_bookings} onChange={(v)=>update("max_bookings",v)} />

      <Input label="Minimum booking notice (hours)" value={form.lead_time_hours} onChange={(v)=>update("lead_time_hours",v)} />

      {/* Outstation */}

      <RadioGroup
        label="Outstation bookings"
        value={form.outstation_available}
        options={["Yes","No"]}
        onChange={(v)=>update("outstation_available",v==="Yes")}
      />

      {form.outstation_available && (
        <Input
          label="Conditions"
          value={form.outstation_conditions}
          onChange={(v)=>update("outstation_conditions",v)}
        />
      )}

      <Input
        label="Allergies / restrictions handled"
        value={form.allergy_handling}
        onChange={(v)=>update("allergy_handling",v)}
      />

      <button
        onClick={save}
        disabled={saving}
        className="bg-[#7A1820] text-white px-6 py-2 rounded"
      >
        {saving ? "Saving..." : "Save"}
      </button>

    </div>

  );

}

function Input({ label, value, onChange }) {

  return (
    <div>

      <label className="block mb-1">{label}</label>

      <input
        value={value || ""}
        onChange={(e)=>onChange(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />

    </div>
  );

}

function RadioGroup({ label, value, options, onChange }) {

  return (

    <div>

      <label className="block mb-2 font-medium">
        {label}
      </label>

      {options.map((o)=>(
        <label key={o} className="mr-4">

          <input
            type="radio"
            checked={value===o || value=== (o==="Yes")}
            onChange={()=>onChange(o)}
          />

          <span className="ml-1">{o}</span>

        </label>
      ))}

    </div>

  );

}