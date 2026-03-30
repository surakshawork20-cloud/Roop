"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ServiceMenuMarriage() {

  const [services, setServices] = useState([]);
  const [userId, setUserId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    init();
  }, []);

  async function init() {

    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) return;

    setUserId(user.id);

    const { data: rows } = await supabase
      .from("vendor_services")
      .select("*")
      .eq("vendor_id", user.id)
      .eq("event_type", "marriage");

    if (rows && rows.length > 0) {
      setServices(rows);
      setCompleted(true);
    }

    setLoading(false);
  }

  function addService() {

    setServices([
      ...services,
      {
        service_name: "",
        price: "",
        duration: "",
        inclusions: "",
        exclusions: ""
      }
    ]);

  }

  function updateService(index, field, value) {

    const newServices = [...services];
    newServices[index][field] = value;

    setServices(newServices);
  }

  function removeService(index) {

    const newServices = [...services];
    newServices.splice(index, 1);

    setServices(newServices);
  }

  async function saveServices() {

    const validServices = services.filter(
  (s) =>
    s.service_name &&
    s.price
);

if (validServices.length === 0) {
  alert("Please add at least one valid service");
  return;
}

    for (const s of services) {
      if (!s.service_group || !s.service_name || !s.price) {
        alert("Please fill required service fields");
        return;
      }
    }

    setSaving(true);

    await supabase
      .from("vendor_services")
      .delete()
      .eq("vendor_id", userId)
      .eq("event_type", "marriage");

    const rows = services.map((s) => ({
  vendor_id: userId,
  event_type: "marriage",
  service_name: s.service_name,
  price: Number(s.price),
  duration: s.duration ? Number(s.duration) : null,
  inclusions: s.inclusions,
  exclusions: s.exclusions
}));

    const { error } = await supabase
      .from("vendor_services")
      .insert(rows);

    setSaving(false);

    if (error) {
      console.error(error);
      alert("Error saving services");
      return;
    }

    setCompleted(true);
    alert("Services saved");

  }

  if (loading) {
    return <div>Loading services...</div>;
  }
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (

    <div>
      {completed && (
        <div className="text-green-600 text-sm mb-3">
          ✓ Services saved
        </div>
      )}

      {/* MOBILE VIEW */}
      {isMobile ? (
        <div className="space-y-4">
          {services.map((service, i) => (
            <div key={i} className="border rounded p-3 shadow-sm space-y-2">

              <input
                placeholder="Service *"
                value={service.service_name}
                onChange={(e) =>
                  updateService(i, "service_name", e.target.value)
                }
                className="w-full border rounded px-2 py-2"
              />

              <input
                type="number"
                placeholder="Price *"
                value={service.price}
                onChange={(e) =>
                  updateService(i, "price", e.target.value)
                }
                className="w-full border rounded px-2 py-2"
              />

              <input
                type="number"
                placeholder="Duration (mins)"
                value={service.duration}
                onChange={(e) =>
                  updateService(i, "duration", e.target.value)
                }
                className="w-full border rounded px-2 py-2"
              />

              <input
                placeholder="Inclusions"
                value={service.inclusions}
                onChange={(e) =>
                  updateService(i, "inclusions", e.target.value)
                }
                className="w-full border rounded px-2 py-2"
              />

              <input
                placeholder="Exclusions"
                value={service.exclusions}
                onChange={(e) =>
                  updateService(i, "exclusions", e.target.value)
                }
                className="w-full border rounded px-2 py-2"
              />

              <button
                onClick={() => removeService(i)}
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
                <th className="border p-2">Service *</th>
                <th className="border p-2">Price *</th>
                <th className="border p-2">Duration</th>
                <th className="border p-2">Inclusions</th>
                <th className="border p-2">Exclusions</th>
                <th className="border p-2"></th>
              </tr>
            </thead>

            <tbody>
              {services.map((service, i) => (
                <tr key={i}>
                  <td className="border p-2">
                    <input
                      value={service.service_name}
                      onChange={(e) =>
                        updateService(i, "service_name", e.target.value)
                      }
                      className="w-full border rounded px-2 py-1"
                    />
                  </td>

                  <td className="border p-2">
                    <input
                      type="number"
                      value={service.price}
                      onChange={(e) =>
                        updateService(i, "price", e.target.value)
                      }
                      className="w-full border rounded px-2 py-1"
                    />
                  </td>

                  <td className="border p-2">
                    <input
                      type="number"
                      value={service.duration}
                      onChange={(e) =>
                        updateService(i, "duration", e.target.value)
                      }
                      className="w-full border rounded px-2 py-1"
                    />
                  </td>

                  <td className="border p-2">
                    <input
                      value={service.inclusions}
                      onChange={(e) =>
                        updateService(i, "inclusions", e.target.value)
                      }
                      className="w-full border rounded px-2 py-1"
                    />
                  </td>

                  <td className="border p-2">
                    <input
                      value={service.exclusions}
                      onChange={(e) =>
                        updateService(i, "exclusions", e.target.value)
                      }
                      className="w-full border rounded px-2 py-1"
                    />
                  </td>

                  <td className="border p-2">
                    <button
                      onClick={() => removeService(i)}
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
        <button onClick={addService} className="text-[#7A1820]">
          + Add Service
        </button>

        <button
          onClick={saveServices}
          disabled={saving}
          className="bg-[#7A1820] text-white px-5 py-2 rounded"
        >
          {saving ? "Saving..." : "Save Services"}
        </button>
      </div>
    </div>
  );
}