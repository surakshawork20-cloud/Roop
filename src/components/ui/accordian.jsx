"use client";

import { useState } from "react";
import { User, Briefcase,ChevronDown } from "lucide-react";


export default function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
      
      {/* HEADER */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-6 py-5 text-left group"
      >
        <span className="text-base font-semibold text-gray-900 tracking-tight">
          {title}
        </span>

        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
            open ? "rotate-180 text-black" : ""
          }`}
        />
      </button>

      {/* DIVIDER */}
      <div
        className={`h-px bg-gray-100 transition-all duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* CONTENT */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-6 text-sm text-gray-600 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}