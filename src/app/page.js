import Navbar from "@/components/marketplace/Navbar";
import ArtistCard from "@/components/marketplace/ArtistCard";
import { supabase } from "@/lib/supabaseClient";

export default async function Home(){

const { data:artists, error } = await supabase
.from("vendor_basic_profile")
.select("vendor_id,brand_name,city,area");

console.log("Artists:", artists);
console.log("Error:", error);


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

<div className="max-w-7xl mx-auto px-8 py-10">

<h1 className="text-3xl font-semibold mb-8">
Discover Artists
</h1>

<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

{artistsWithImages.map((artist)=>(
<ArtistCard key={artist.id} artist={artist}/>
))}

</div>

</div>

</div>

)

}