"use client";

import { useState } from "react";
import ServiceMenuMarriage from "./service-menu";
import AdditionalCharges from "./additional-charges";
import ServiceCapabilities from "./service-capabilities";

export default function ProfessionalDetailsPage() {

  const [openSection, setOpenSection] = useState("services");

  function toggle(section) {
    setOpenSection(openSection === section ? null : section);
  }

  return (

    <div className="max-w-5xl">

      <h1 className="text-2xl font-semibold mb-6">
        Professional Details
      </h1>

      {/* SECTION 1 */}

      <Section
        title="Service Menu – Event: Marriage"
        open={openSection === "services"}
        onClick={() => toggle("services")}
      >
        <ServiceMenuMarriage />
      </Section>


      {/* SECTION 2 */}


    <Section
        title="Additional Charges (if applicable)"
        open={openSection === "charges"}
        onClick={() => toggle("charges")}
        >
        <AdditionalCharges />
    </Section>


      {/* SECTION 3 */}

    <Section
    title="Service Details & Capabilities"
    open={openSection === "capabilities"}
    onClick={() => toggle("capabilities")}
    >
    <ServiceCapabilities />
    </Section>

    </div>

  );
}

function Section({ title, children, open, onClick }) {

  return (

    <div className="border rounded-md mb-4">

      <button
        onClick={onClick}
        className="w-full flex justify-between items-center px-4 py-3 font-medium"
      >

        {title}

        <span>
          {open ? "−" : "+"}
        </span>

      </button>

      {open && (
        <div className="border-t p-4">
          {children}
        </div>
      )}

    </div>

  );

}