"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function VerificationPage() {

  const [form, setForm] = useState({
    id_proof_option: "",
    pan_number: "",
    bank_account_holder: "",
    bank_account_number: "",
    ifsc_code: "",
    gst_number: "",
    id_proof_url: null
  });

  const [userId, setUserId] = useState(null);
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);

  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState(false);

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

    const { data: profile } = await supabase
      .from("vendor_verification_details")
      .select("*")
      .eq("vendor_id", user.id)
      .single();

    if (profile) {

      setForm(profile);
      setSaved(true);
      setEditing(false);

      if (profile.id_proof_url) {

        const { data: signed } = await supabase
          .storage
          .from("vendor-documents")
          .createSignedUrl(profile.id_proof_url, 3600);

        setFileUrl(signed?.signedUrl);

      }

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

  function handleFileChange(e) {

    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const allowed = [
      "image/jpeg",
      "image/png",
      "application/pdf"
    ];

    if (!allowed.includes(selectedFile.type)) {
      alert("Only JPG, PNG or PDF allowed");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("File must be less than 5MB");
      return;
    }

    setFile(selectedFile);
  }

  async function uploadIdProof() {

    if (!file) return form.id_proof_url;

    const ext = file.name.split(".").pop();

    const path =
      `${userId}/id/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("vendor-documents")
      .upload(path, file);

    if (error) {
      console.error(error);
      alert("Upload failed");
      return null;
    }

    return path;
  }

  async function deleteExistingFile() {

    if (!form.id_proof_url) return;

    await supabase.storage
      .from("vendor-documents")
      .remove([form.id_proof_url]);

    setForm({
      ...form,
      id_proof_url: null
    });

    setFileUrl(null);
  }

  async function saveData() {

    const requiredFields = [
      "pan_number",
      "bank_account_holder",
      "bank_account_number",
      "ifsc_code"
    ];

    for (const field of requiredFields) {
      if (!form[field]) {
        alert("Please fill all required fields");
        return;
      }
    }

    if (form.id_proof_option === "Upload" && !file && !form.id_proof_url) {
      alert("Please upload ID proof");
      return;
    }

    setSaving(true);

    let idProofPath = form.id_proof_url;

    if (file) {
      idProofPath = await uploadIdProof();
    }

    const { error } = await supabase
      .from("vendor_verification_details")
      .upsert(
        {
          vendor_id: userId,
          ...form,
          id_proof_url: idProofPath
        },
        {
          onConflict: "vendor_id"
        }
      );

    setSaving(false);

    if (error) {
      console.error(error);
      alert("Error saving data");
      return;
    }

    setSaved(true);
    setEditing(false);

    if (idProofPath) {

      const { data } = await supabase.storage
        .from("vendor-documents")
        .createSignedUrl(idProofPath, 3600);

      setFileUrl(data?.signedUrl);

    }

    setFile(null);
  }

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="max-w-3xl">

      <div className="flex justify-between mb-6">

        <h1 className="text-2xl font-semibold">
          Verification & Payout Details
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

      {/* READ MODE */}

      {saved && !editing && (

        <div className="space-y-4">

          {fileUrl && (
            <a
              href={fileUrl}
              target="_blank"
              className="text-blue-600 underline text-sm"
            >
              View Uploaded ID
            </a>
          )}

          <Row label="PAN Number" value={form.pan_number} />
          <Row label="Account Holder" value={form.bank_account_holder} />
          <Row label="Account Number" value={form.bank_account_number} />
          <Row label="IFSC Code" value={form.ifsc_code} />
          <Row label="GST Number" value={form.gst_number || "-"} />

        </div>

      )}

      {/* EDIT MODE */}

      {editing && (

        <div className="space-y-6">

          <div>

            <label className="block mb-2">
              Government ID Proof <span className="text-red-500">*</span>
            </label>

            <div className="flex gap-6 mb-3">

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="id_proof_option"
                  value="Upload"
                  checked={form.id_proof_option === "Upload"}
                  onChange={handleChange}
                  className="accent-[#7A1820]"
                />
                Upload
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="id_proof_option"
                  value="on_request"
                  checked={form.id_proof_option === "on_request"}
                  onChange={handleChange}
                  className="accent-[#7A1820]"
                />
                Provide on request
              </label>

            </div>

            {form.id_proof_option === "Upload" && (

              <div>

                {fileUrl && !file && (
                  <div className="mb-2">

                    <a
                      href={fileUrl}
                      target="_blank"
                      className="text-blue-600 text-sm underline"
                    >
                      View current file
                    </a>

                    <button
                      onClick={deleteExistingFile}
                      className="ml-4 text-red-600 text-sm"
                    >
                      Delete
                    </button>

                  </div>
                )}

                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                  className="border p-2 rounded-md w-full"
                />

                <p className="text-xs text-gray-500 mt-1">
                  JPG / PNG / PDF • Max 5MB
                </p>

                {file && (
                  <p className="text-green-600 text-sm mt-2">
                    Selected: {file.name}
                  </p>
                )}

              </div>

            )}

          </div>

          <Input label="PAN Number" name="pan_number" value={form.pan_number} onChange={handleChange} required />

          <Input label="Bank Account Holder Name" name="bank_account_holder" value={form.bank_account_holder} onChange={handleChange} required />

          <Input label="Bank Account Number" name="bank_account_number" value={form.bank_account_number} onChange={handleChange} required />

          <Input label="IFSC Code" name="ifsc_code" value={form.ifsc_code} onChange={handleChange} required />

          <Input label="GST Number (optional)" name="gst_number" value={form.gst_number} onChange={handleChange} />

          <button
            onClick={saveData}
            disabled={saving}
            className="bg-[#7A1820] text-white px-6 py-2 rounded-md"
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

      <span className="text-gray-500">{label}</span>

      <span>{value || "-"}</span>

    </div>
  );
}