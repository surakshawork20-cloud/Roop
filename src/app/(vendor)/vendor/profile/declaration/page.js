"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function DeclarationPage() {

  const [form,setForm] = useState({
    agree_terms:false,
    agree_booking_rules:false,
    agree_verification:false,
    confirm_pricing:false,
    portfolio_consent:false
  });

  const [userId,setUserId] = useState(null);
  const [loading,setLoading] = useState(true);
  const [saved,setSaved] = useState(false);

  useEffect(()=>{
    init();
  },[]);

  async function init(){

    const {data} = await supabase.auth.getUser();
    const user = data.user;

    if(!user) return;

    setUserId(user.id);

    const {data:decl} = await supabase
      .from("vendor_declaration")
      .select("*")
      .eq("vendor_id",user.id)
      .single();

    if(decl){
      setForm({
        agree_terms:decl.agree_terms,
        agree_booking_rules:decl.agree_booking_rules,
        agree_verification:decl.agree_verification,
        confirm_pricing:decl.confirm_pricing,
        portfolio_consent:decl.portfolio_consent
      });
    }

    setLoading(false);
  }

  function handleChange(e){

    const {name,checked} = e.target;

    setForm({
      ...form,
      [name]:checked
    });

  }

  async function checkProfileCompletion(userId){

    let missing = [];

    /* Basic profile */

    const { data:basic } = await supabase
      .from("vendor_basic_profile")
      .select("id")
      .eq("vendor_id",userId)
      .single();

    if(!basic){
      missing.push("Basic Profile");
    }

    /* Services */

    const { count:serviceCount } = await supabase
      .from("vendor_services")
      .select("*",{count:"exact",head:true})
      .eq("vendor_id",userId);

    if(!serviceCount || serviceCount < 1){
      missing.push("At least one Service");
    }

    /* Portfolio photos */

    const { count:photoCount } = await supabase
      .from("vendor_portfolio_photos")
      .select("*",{count:"exact",head:true})
      .eq("vendor_id",userId);

    if(!photoCount || photoCount < 3){
      missing.push("Minimum 3 Portfolio Photos");
    }

    return missing;

  }

  async function saveDeclaration(){

    if(
      !form.agree_terms ||
      !form.agree_booking_rules ||
      !form.agree_verification ||
      !form.confirm_pricing ||
      !form.portfolio_consent
    ){
      alert("Please accept all declarations");
      return;
    }

    const {error} = await supabase
      .from("vendor_declaration")
      .upsert({
        vendor_id:userId,
        ...form,
        accepted_at:new Date()
      },{
        onConflict:"vendor_id"
      });

    if(error){
      console.error(error);
      alert("Error saving declaration");
      return;
    }

    /* Check profile completeness */

    const missing = await checkProfileCompletion(userId);

    if(missing.length > 0){

      alert(
        "Vendor profile cannot be activated.\n\nMissing:\n• "
        + missing.join("\n• ")
      );

      return;
    }

    /* Activate vendor */

    await supabase
      .from("profiles")
      .update({
        vendor_live:true
      })
      .eq("id",userId);

    setSaved(true);

    alert("Vendor profile activated");

  }

  if(loading) return null;

  return(

  <div className="max-w-3xl space-y-6">

    <h1 className="text-2xl font-semibold">
      Declaration & Agreement
    </h1>

    <label className="flex gap-2">
      <input
        type="checkbox"
        name="agree_terms"
        checked={form.agree_terms || false}
        onChange={handleChange}
      />
      <span>
        I agree to ROOP’s platform terms, fees and code of conduct.
      </span>
    </label>

    <label className="flex gap-2">
      <input
        type="checkbox"
        name="agree_booking_rules"
        checked={form.agree_booking_rules || false}
        onChange={handleChange}
      />
      <span>
        I agree to follow booking confirmations and availability updates.
      </span>
    </label>

    <label className="flex gap-2">
      <input
        type="checkbox"
        name="agree_verification"
        checked={form.agree_verification || false}
        onChange={handleChange}
      />
      <span>
        I understand ROOP may verify my details.
      </span>
    </label>

    <label className="flex gap-2">
      <input
        type="checkbox"
        name="confirm_pricing"
        checked={form.confirm_pricing || false}
        onChange={handleChange}
      />
      <span>
        I confirm the pricing and policies shared are accurate.
      </span>
    </label>

    <label className="flex gap-2">
      <input
        type="checkbox"
        name="portfolio_consent"
        checked={form.portfolio_consent || false}
        onChange={handleChange}
      />
      <span>
        I confirm I have permission to upload and publicly display all portfolio photos on ROOP.
      </span>
    </label>

    {!saved && (

      <button
        onClick={saveDeclaration}
        className="bg-[#7A1820] text-white px-6 py-2 rounded"
      >
        Submit Declaration
      </button>

    )}

  </div>

  );

}