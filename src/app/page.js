import Navbar from "@/components/marketplace/Navbar";
import ArtistCard from "@/components/marketplace/ArtistCard";
import { supabase } from "@/lib/supabaseClient";
import RoleGuard from "@/components/RoleGuard";


export default async function Home({ searchParams }){

  const params = await searchParams;
  const search = params?.q?.trim() || "";

    let query = supabase
    .from("vendor_basic_profile")
    .select("vendor_id, brand_name, city, area");

  if (search) {
    query = query.or(
      `brand_name.ilike.%${search}%,city.ilike.%${search}%,area.ilike.%${search}%`
    );
  }

  const { data: artists, error } = await query;


const { data:photos } = await supabase
.from("vendor_portfolio_photos")
.select("vendor_id,photo_url,position");

const artistsWithImages = (artists || []).map((artist)=>{

  const artistPhotos = photos?.filter(
    p => p.vendor_id === artist.vendor_id
  );

  const firstPhoto = artistPhotos?.sort(
    (a,b) => a.position - b.position
  )[0];

  const imageUrl = firstPhoto
    ? supabase.storage
        .from("vendor-documents")
        .getPublicUrl(firstPhoto.photo_url).data.publicUrl
    : null;
    console.log("Image URL:", imageUrl);

  return {
    id: artist.vendor_id,
    brand_name: artist.brand_name,
    city: artist.city,
    area: artist.area,
    image: imageUrl
  }

});

return(

          <div>

          <Navbar/>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10">

                    <h1 className="text-3xl font-semibold mb-8">
                    Discover Artists
                    </h1>
                    {search && (
                      <p className="text-gray-500 mb-6">
                        Showing results for: <span className="font-semibold">{search}</span>
                      </p>
                    )}
                    {artistsWithImages.length === 0 ? (

                      <p className="text-gray-500 text-lg">
                        No artists found
                      </p>

                    ) : (

                      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">

                        {artistsWithImages.map((artist)=>(
                          <ArtistCard key={artist.id} artist={artist}/>
                        ))}

                      </div>

                    )}
                    </div>

          </div>


)

}