"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Sidebar({ isOpen, setIsOpen }) {

  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);

  // Auto-open profile section
  useEffect(() => {
    if (pathname.startsWith("/vendor/profile")) {
      setProfileOpen(true);
    }
  }, [pathname]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* OVERLAY (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          bg-white border-r h-full z-50
          transition-transform duration-300 w-64

          /* Mobile */
          fixed top-0 left-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}

          /* Desktop */
          md:static md:translate-x-0
          flex flex-col
        `}
      >

        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <span className="font-semibold text-gray-800">
            Menu
          </span>

          {/* CLOSE BUTTON (mobile) */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-lg"
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">

          <nav className="px-2 space-y-2">

            {/* PROFILE DROPDOWN */}
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-full text-sm flex items-center justify-between px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
            >
              <span>Profile</span>
              <span className="text-xs">
                {profileOpen ? "▼" : "▶"}
              </span>
            </button>

            {profileOpen && (
              <div className="ml-3 space-y-1">

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

            {/* MAIN LINKS */}
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

      </aside>
    </>
  );
}

/* ITEM */
function SidebarItem({ href, label, pathname }) {

  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`block px-3 py-2 rounded-md text-sm transition
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