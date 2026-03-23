"use client";

import Link from "next/link";
import { useState } from "react";
import Loader from "@/components/Loader";
export default function ArtistCard({ artist }) {

  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
  };


  return (

        <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <Loader />
        </div>
      )}

    <Link href={`/artists/${artist.id}`} onClick={handleClick}>

      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg active:scale-[0.98] transition duration-200">

         <div className="relative w-full h-44 sm:h-56 md:h-64">

          <img
            src={artist.image || "/placeholder.jpg"}
            alt={artist.brand_name}
           className="w-full h-full object-contain bg-gray-100 rounded-t-xl"
            />

        </div>

        <div className="p-3 sm:p-4">

          <h3 className="font-semibold text-base sm:text-lg">
            {artist.brand_name}
          </h3>

          <p className="text-gray-500 text-xs sm:text-sm">
            {artist.city} • {artist.area}
          </p>

        </div>

      </div>

    </Link>

    </>

  );
}