"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter,usePathname, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import EventModal from "@/components/marketplace/EventModal";
import MyEventsModal from "@/components/marketplace/MyEventsModal";
import Loader from "@/components/Loader";
import MyBookingsModal from "@/components/marketplace/MyBookingsModal";

export default function Navbar() {


  const router = useRouter();

const [user, setUser] = useState(null);
const [showEventModal, setShowEventModal] = useState(false);
const [showMyEvents, setShowMyEvents] = useState(false);
const [events, setEvents] = useState([]);
const [showBookingsModal, setShowBookingsModal] = useState(false);
const [bookings, setBookings] = useState([]);
const [loading, setLoading] = useState(false);
const [searchTerm, setSearchTerm] = useState("");
const [results, setResults] = useState([]);
const [showResults, setShowResults] = useState(false);
const [menuOpen, setMenuOpen] = useState(false);

const pathname = usePathname();
const searchParams = useSearchParams();

useEffect(() => {
  setLoading(false);
}, [pathname, searchParams]);

/* --------------------------
Check Logged In User
-------------------------- */

useEffect(() => {
checkUser();
}, []);

async function checkUser() {
const { data } = await supabase.auth.getUser();
setUser(data.user);
}

/* --------------------------
Logout
-------------------------- */

async function logout() {
setLoading(true);
await supabase.auth.signOut();
window.location.reload();
}

/* --------------------------
Fetch Bookings
-------------------------- */

async function fetchBookings() {


const { data: userData } = await supabase.auth.getUser();
const currentUser = userData.user;

const { data, error } = await supabase
  .from("booking_requests")
  .select(`
    id,
    status,
    vendor_id,
    customer_events (
      event_name,
      event_date,
      location
    )
  `)
  .eq("customer_id", currentUser.id)
  .order("created_at", { ascending: false });

if (error) {
  console.error(error);
  return;
}

setBookings(data);
setShowBookingsModal(true);


}

async function searchArtists() {

  if (!searchTerm) {
    setResults([]);
    return;
  }

  const { data, error } = await supabase
    .from("artists")
    .select("*")
    .or(`name.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,look.ilike.%${searchTerm}%`)
    .limit(10);

  if (error) {
    console.log("ERROR:", error.message);
    return;
  }

  setResults(data);
  setShowResults(true);
}
useEffect(() => {

  function handleClickOutside() {
    setShowResults(false);
  }

  document.addEventListener("click", handleClickOutside);

  return () => {
    document.removeEventListener("click", handleClickOutside);
  };

}, []);




/* --------------------------
Navbar UI
-------------------------- */

return (
<>
{loading && <Loader fullscreen />}


  <nav className="bg-[#691926] backdrop-blur sticky top-0 z-50 text-white border-b border-[#ded1ba]/30">

    <div className="w-full px-4 sm:px-6 md:px-10 py-2 flex items-center justify-between gap-4">

      {/* LOGO */}

      <Link href="/" className="flex items-center shrink-0">

        <Image
          src="/roop_logo.png"
          alt="ROOP"
          width={300}
          height={80}
          priority
          className="h-10 sm:h-12 w-auto object-contain"
        />

      </Link>

      <button
        className="sm:hidden text-2xl"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      {/* SEARCH */}

      <div className="hidden sm:block flex-1 max-w-lg relative"
      onClick={(e) => e.stopPropagation()}>

        <input

        disabled={loading}
          placeholder="Search artists, bridal makeup, hair styling..."
          value={searchTerm}
          onChange={(e) => {
              setSearchTerm(e.target.value);
              searchArtists();
            }}
           onKeyDown={(e) => {
            if (e.key === "Enter") {
              setLoading(true);
              router.push(`/?q=${searchTerm}`);
              setShowResults(false);
            }
          }}
          className="
            w-full
            px-5
            py-2
            rounded-full
            text-[#ded1ba]
            border
            border-[#ded1ba]
            bg-transparent
            focus:outline-none
            focus:ring-2
            focus:ring-[#ded1ba]
          "
        />


        {showResults && results.length > 0 && (
          <div className="absolute top-12 w-full bg-white text-black rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">

            {results.map((artist) => (
              <Link
                key={artist.id}
                href={`/artist/${artist.id}`}
                className="block px-4 py-3 hover:bg-gray-100 border-b"
              >
                <div className="font-semibold">
                  {artist.name}
                </div>

                <div className="text-sm text-gray-500">
                  {artist.location} • {artist.look}
                </div>
              </Link>
            ))}

          </div>
        )}

      </div>

      {/* RIGHT SIDE */}

      <div className="hidden sm:flex gap-4 md:gap-5 items-center text-sm">

        {!user ? (

          <>
            <Link href="/customer/auth/login">
              Login
            </Link>

            <Link
              href="/customer/auth/signup"
              className="bg-[#ded1ba] text-[#691926] px-4 py-2 rounded-full font-medium"
            >
              Sign Up
            </Link>

            <Link
              href="/vendorauth"
              className="text-[#ded1ba] underline"
            >
              Are you an artist?
            </Link>
          </>

        ) : (

          <>
            <button
              onClick={() => setShowEventModal(true)}
              className="bg-[#ded1ba] text-[#691926] px-4 py-2 rounded-full font-medium"
            >
              + Add Event
            </button>

            <button
              onClick={() => {
                setShowMyEvents(true);
              }}
            >
              My Events
            </button>

            <button onClick={() => setShowBookingsModal(true)}>
              My Bookings
            </button>

            <button onClick={logout}>
              Logout
            </button>
          </>

        )}

      </div>

    </div>



    

  </nav>

      {/* EVENT MODAL */}

    <EventModal
      open={showEventModal}
      close={() => setShowEventModal(false)}
    />

    <MyEventsModal
      open={showMyEvents}
      close={() => setShowMyEvents(false)}
    />

    <MyBookingsModal
      open={showBookingsModal}
      close={() => setShowBookingsModal(false)}
    />

    {loading && <Loader fullscreen />}


    {/* MOBILE SEARCH */}
<div className="sm:hidden bg-[#691926] px-4 pb-4 pt-2 relative border-b border-[#ded1ba]/20" onClick={(e) => e.stopPropagation()}>
  <input
    disabled={loading}
    placeholder="Search artists..."
    value={searchTerm}
    onChange={(e) => {
      setSearchTerm(e.target.value);
      searchArtists();
    }}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        setLoading(true);
        router.push(`/?q=${searchTerm}`);
        setShowResults(false);
      }
    }}
    className="w-full px-4 py-3 rounded-full text-white placeholder-[#ded1ba]/70 border border-[#ded1ba]/40 bg-[#7a2230] focus:outline-none focus:ring-2 focus:ring-[#ded1ba]"
  />

  {showResults && results.length > 0 && (
    <div className="absolute top-12 left-4 right-4 bg-white text-black rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
      {results.map((artist) => (
        <Link
          key={artist.id}
          href={`/artist/${artist.id}`}
          className="block px-4 py-3 hover:bg-gray-100 border-b"
        >
          <div className="font-semibold">{artist.name}</div>
          <div className="text-sm text-gray-500">
            {artist.location} • {artist.look}
          </div>
        </Link>
      ))}
    </div>
  )}
</div>


{menuOpen && (
  <div className="sm:hidden px-4 pb-4 flex flex-col gap-3 bg-[#691926] text-white border-t border-[#ded1ba]/20">

    {!user ? (
      <>
        <Link
          href="/customer/auth/login"
          className="bg-[#ded1ba] mt-2 text-[#691926] px-4 py-2 rounded-full text-center font-medium text-base active:scale-[0.97] transition"
          onClick={() => setMenuOpen(false)}
        >
          Login / Sign Up
        </Link>

        <Link
          href="/vendorauth"
          className="text-[#ded1ba] underline"
          onClick={() => setMenuOpen(false)}
        >
          Are you an artist?
        </Link>
      </>
    ) : (
      <>
        <button
          onClick={() => {
            setShowEventModal(true);
            setMenuOpen(false);
          }}
          className="bg-[#ded1ba] text-[#691926] px-4 py-2 rounded-full font-medium"
        >
          + Add Event
        </button>

        <button onClick={() => setShowMyEvents(true)}>
          My Events
        </button>

        <button onClick={() => setShowBookingsModal(true)}>
          My Bookings
        </button>

        <button onClick={logout}>
          Logout
        </button>
      </>
    )}
  </div>
)}
</>


);
}
