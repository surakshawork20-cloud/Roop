"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function PortfolioPage() {

  const [userId,setUserId] = useState(null);

  const [photos,setPhotos] = useState([]);
  const [files,setFiles] = useState([]);

  const [driveLink,setDriveLink] = useState("");
  const [consent,setConsent] = useState(false);

  const [loading,setLoading] = useState(true);
  const [saving,setSaving] = useState(false);

  useEffect(()=>{
    init();
  },[]);

  async function init(){

    const {data} = await supabase.auth.getUser();
    const user = data.user;

    if(!user) return;

    setUserId(user.id);

    const {data:rows} = await supabase
      .from("vendor_portfolio_photos")
      .select("*")
      .eq("vendor_id",user.id)
      .order("position");

    if(rows) setPhotos(rows);

    const {data:meta} = await supabase
      .from("vendor_portfolio")
      .select("*")
      .eq("vendor_id",user.id)
      .single();

    if(meta){
      setDriveLink(meta.drive_link || "");
    }

    setLoading(false);
  }

  function handleFileChange(e){

    const selected = Array.from(e.target.files);

    if(selected.length + photos.length > 20){
      alert("Maximum 20 photos allowed");
      return;
    }

    setFiles(selected);
  }

  async function uploadPhotos(){

    let position = photos.length;

    for(const file of files){

      const ext = file.name.split(".").pop();

      const path =
      `${userId}/portfolio/${Date.now()}-${Math.random()}.${ext}`;

      const {error} = await supabase.storage
        .from("vendor-documents")
        .upload(path,file);

      if(error){
        console.error(error);
        continue;
      }

      await supabase
        .from("vendor_portfolio_photos")
        .insert({
          vendor_id:userId,
          photo_url:path,
          position:position++
        });

    }

  }

  async function deletePhoto(id,path){

    await supabase.storage
      .from("vendor-documents")
      .remove([path]);

    await supabase
      .from("vendor_portfolio_photos")
      .delete()
      .eq("id",id);

    init();
  }

  async function savePortfolio(){

    if(photos.length + files.length < 3){
      alert("Minimum 3 photos required");
      return;
    }


    setSaving(true);

    if(files.length > 0){
      await uploadPhotos();
    }

    await supabase
      .from("vendor_portfolio")
      .upsert({
        vendor_id:userId,
        drive_link:driveLink,
        consent_confirmed:consent,
        consent_timestamp:new Date()
      },{
        onConflict:"vendor_id"
      });

    setSaving(false);

    init();

  }

  if(loading) return null;

  return(

  <div className="max-w-5xl space-y-6">

    <h1 className="text-2xl font-semibold">
      Portfolio Submission
    </h1>

    <p className="text-sm text-gray-500">
      Minimum 3 photos required
    </p>

    {/* Upload */}

    <input
      type="file"
      multiple
      accept="image/*"
      onChange={handleFileChange}
    />

    {/* Photo Grid */}

    <div className="grid grid-cols-4 gap-4">

      {photos.map(photo=>{

        const url =
        supabase.storage
          .from("vendor-documents")
          .getPublicUrl(photo.photo_url).data.publicUrl;

        return(

        <div key={photo.id} className="relative">

          <img
            src={url}
            className="w-full h-32 object-cover rounded"
          />

          <button
            onClick={()=>deletePhoto(photo.id,photo.photo_url)}
            className="absolute top-1 right-1 bg-black text-white text-xs px-2 py-1 rounded"
          >
            Delete
          </button>

        </div>

        )

      })}

    </div>

    {/* Drive Link */}

    <div>

      <label className="block text-sm mb-1">
        Google Drive Link (optional)
      </label>

      <input
        value={driveLink}
        onChange={(e)=>setDriveLink(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />

    </div>

    {/* Consent */}

    <button
      onClick={savePortfolio}
      className="bg-[#7A1820] text-white px-6 py-2 rounded"
    >
      {saving ? "Saving..." : "Save Portfolio"}
    </button>

  </div>

  );

}