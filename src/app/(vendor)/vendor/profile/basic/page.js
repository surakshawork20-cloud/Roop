"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function BasicProfilePage() {

  const [form, setForm] = useState({
    brand_name: "",
    full_name: "",
    phone: "",
    email: "",
    city: "",
    area: "",
    travel_radius: "",
    service_mode: "",
    languages: "",
    instagram_link: ""
  });

  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    init();
  }, []);

  async function init() {

    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) return;

    setUserId(user.id);

    const { data: profile } = await supabase
      .from("vendor_basic_profile")
      .select("*")
      .eq("vendor_id", user.id)
      .single();

    if (profile) {
      setForm(profile);
      setSaved(true);
      setEditing(false);
    } else {
      setEditing(true);
    }

    setLoading(false);
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function saveProfile() {

    const requiredFields = [
      "brand_name",
      "full_name",
      "phone",
      "email",
      "city",
      "area",
      "travel_radius",
      "service_mode",
      "languages"
    ];

    for (const field of requiredFields) {
      if (!form[field]) {
        alert("Please fill all required fields");
        return;
      }
    }

    setSaving(true);

    const { error } = await supabase
      .from("vendor_basic_profile")
      .upsert(
        {
          vendor_id: userId,
          ...form
        },
        {
          onConflict: "vendor_id"
        }
      );

    setSaving(false);

    if (error) {
      console.error(error);
      alert("Error saving profile");
      return;
    }

    setSaved(true);
    setEditing(false);
  }

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">

      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold">
          Basic Profile Information
        </h1>

        {saved && !editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-sm text-[#7A1820] self-start sm:self-auto"
          >
            Edit
          </button>
        )}
      </div>

      {/* READ VIEW */}

      {saved && !editing && (

        <div className="space-y-4">

          <Row label="Brand / Studio Name" value={form.brand_name} />
          <Row label="Full Name" value={form.full_name} />
          <Row label="Phone" value={form.phone} />
          <Row label="Email" value={form.email} />
          <Row label="City" value={form.city} />
          <Row label="Area" value={form.area} />
          <Row label="Travel Radius" value={form.travel_radius + " km"} />
          <Row label="Service Mode" value={form.service_mode} />
          <Row label="Languages" value={form.languages} />
          <Row label="Instagram / Portfolio" value={form.instagram_link || "-"} />

        </div>

      )}

      {/* EDIT FORM */}

      {editing && (

        <div className="space-y-6">

          <Input label="Brand / Studio Name" name="brand_name" value={form.brand_name} onChange={handleChange} required />

          <Input label="Full Name" name="full_name" value={form.full_name} onChange={handleChange} required />

          <Input label="Phone Number" name="phone" value={form.phone} onChange={handleChange} required />

          <Input label="Email" name="email" value={form.email} onChange={handleChange} required />

          <Input label="City" name="city" value={form.city} onChange={handleChange} required />

          <Input label="Area" name="area" value={form.area} onChange={handleChange} required />

          <Input label="Travel Radius (km)" name="travel_radius" value={form.travel_radius} onChange={handleChange} required />

          {/* SERVICE MODE */}

          <div>
            <label className="block text-sm mb-2">
              Service Mode <span className="text-red-500">*</span>
            </label>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="service_mode"
                  value="Travels to client"
                  checked={form.service_mode === "Travels to client"}
                  onChange={handleChange}
                  className="accent-[#7A1820]"
                />
                Travels to client
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="service_mode"
                  value="In-studio"
                  checked={form.service_mode === "studio"}
                  onChange={handleChange}
                  className="accent-[#7A1820]"
                />
                In-studio
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="service_mode"
                  value="both"
                  checked={form.service_mode === "both"}
                  onChange={handleChange}
                  className="accent-[#7A1820]"
                />
                Travels to client & In-studio
              </label>

            </div>
          </div>

          <Input label="Languages Spoken" name="languages" value={form.languages} onChange={handleChange} required />

          <Input label="Instagram / Portfolio Link (optional)" name="instagram_link" value={form.instagram_link} onChange={handleChange} />

          <button
            onClick={saveProfile}
            disabled={saving}
            className="w-full sm:w-auto bg-[#7A1820] text-white px-6 py-2 rounded-md"
          >
            {saving ? "Saving..." : "Save"}
          </button>

        </div>

      )}

    </div>
  );
}

function Input({ label, name, value, onChange, required }) {

  return (
    <div>
      <label className="block text-sm mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <input
        name={name}
        value={value || ""}
        onChange={onChange}
        required={required}
        className="w-full border rounded-md px-3 py-2"
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