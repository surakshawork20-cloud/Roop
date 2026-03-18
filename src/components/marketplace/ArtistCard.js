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

      <div className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition">

        <div className="relative h-64 w-full">

          <img
            src={artist.image || "/placeholder.jpg"}
            alt={artist.brand_name}
            className="object-cover"
            />

        </div>

        <div className="p-4">

          <h3 className="font-semibold text-lg">
            {artist.brand_name}
          </h3>

          <p className="text-gray-500 text-sm">
            {artist.city} • {artist.area}
          </p>

        </div>

      </div>

    </Link>

    </>

  );
}