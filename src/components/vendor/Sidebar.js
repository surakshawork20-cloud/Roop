"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Sidebar() {

  const pathname = usePathname();

  const [profileOpen, setProfileOpen] = useState(false);

  // auto open profile dropdown when inside profile routes
  useEffect(() => {
    if (pathname.startsWith("/vendor/profile")) {
      setProfileOpen(true);
    }
  }, [pathname]);

  return (
    <div className="h-full flex flex-col pt-6">


      <nav className="px-4 space-y-2">

        {/*
        <SidebarItem
          href="/vendor"
          label="Overview"
          pathname={pathname}
        />
        */}

        {/* PROFILE DROPDOWN */}

        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="w-full text-sm flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
        >
          <span>Profile</span>
          <span className="text-xs">
            {profileOpen ? "▼" : "▶"}
          </span>
        </button>

        {profileOpen && (
          <div className="ml-3 space-y-1">

            {/*}
            <SidebarItem
              href="/vendor/profile"
              label="Overview"
              pathname={pathname}
            />
            */}

            <SidebarItem
              href="/vendor/profile/basic"
              label="Basic Information"
              pathname={pathname}
            />

            <SidebarItem
              href="/vendor/profile/verification"
              label="Verification & Payout"
              pathname={pathname}
            />

            <SidebarItem
              href="/vendor/profile/professional"
              label="Professional Details"
              pathname={pathname}
            />

            <SidebarItem
              href="/vendor/profile/availability"
              label="Availability Setup"
              pathname={pathname}
            />

            <SidebarItem
              href="/vendor/profile/payments"
              label="Payments & Settlement"
              pathname={pathname}
            />

            <SidebarItem
              href="/vendor/profile/cancellation"
              label="Cancellation Policy"
              pathname={pathname}
            />

            <SidebarItem
              href="/vendor/profile/portfolio"
              label="Portfolio Submission"
              pathname={pathname}
            />

            <SidebarItem
              href="/vendor/profile/declaration"
              label="Declaration & Agreement"
              pathname={pathname}
            />

          </div>
        )}

        <SidebarItem
          href="/vendor/bookings"
          label="Bookings"
          pathname={pathname}
        />
        <SidebarItem
          href="/vendor/requests"
          label="Requests"
          pathname={pathname}
        />

      </nav>

    </div>
  );
}

function SidebarItem({ href, label, pathname }) {

  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`block px-4 py-2 rounded-md text-sm transition
      ${
        active
          ? "bg-gray-100 text-gray-900"
          : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      {label}
    </Link>
  );
}