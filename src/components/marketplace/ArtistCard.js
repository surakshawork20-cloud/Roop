import Link from "next/link";
import Image from "next/image";
export default function ArtistCard({ artist }) {

  return (

    <Link href={`/artists/${artist.id}`}>

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

  );
}