import Navbar from "@/components/marketplace/Navbar";
import BookingModal from "@/components/marketplace/BookingModal";
import { supabase } from "@/lib/supabaseClient";

export default async function ArtistPage({ params }) {

const { id: vendorId } = await params;

/* --------------------------
FETCH BASIC PROFILE
-------------------------- */

const { data:basic } = await supabase
.from("vendor_basic_profile")
.select("*")
.eq("vendor_id", vendorId)
.single();

/* --------------------------
FETCH PORTFOLIO PHOTOS
-------------------------- */

const { data:photos } = await supabase
.from("vendor_portfolio_photos")
.select("*")
.eq("vendor_id", vendorId)
.order("position");

/* --------------------------
FETCH SERVICES
-------------------------- */

const { data:services } = await supabase
.from("vendor_services")
.select("*")
.eq("vendor_id", vendorId);

/* --------------------------
FETCH SERVICE CAPABILITIES
-------------------------- */

const { data:capabilities } = await supabase
.from("vendor_service_capabilities")
.select("*")
.eq("vendor_id", vendorId)
.single();

/* --------------------------
FETCH ADDITIONAL CHARGES
-------------------------- */

const { data:charges } = await supabase
.from("vendor_additional_charges")
.select("*")
.eq("vendor_id", vendorId);

/* --------------------------
FETCH PAYMENT SETTINGS
-------------------------- */

const { data:payments } = await supabase
.from("vendor_payment_settings")
.select("*")
.eq("vendor_id", vendorId)
.single();

/* --------------------------
FETCH CANCELLATION POLICY
-------------------------- */

const { data:cancellation } = await supabase
.from("vendor_cancellation_policy")
.select("*")
.eq("vendor_id", vendorId)
.single();

/* --------------------------
CONVERT PHOTO PATHS TO URL
-------------------------- */

const images = photos?.map((p)=>{
return supabase.storage
.from("vendor-documents")
.getPublicUrl(p.photo_url).data.publicUrl
}) || [];

return(

<div>

<Navbar/>

<div className="max-w-6xl mx-auto px-8 py-10 space-y-12">

{/* BOOK BUTTON */}

{/* BOOK BUTTON */}

<BookingModal vendorId={vendorId} />


{/* PORTFOLIO SLIDER */}

<div className="overflow-x-auto flex gap-4">

{images.map((img,i)=>(
<img
key={i}
src={img}
className="h-80 rounded-lg object-cover"
/>
))}

</div>


{/* BASIC PROFILE */}

<div>

<h2 className="text-2xl font-semibold mb-4">
Artist Information
</h2>

<div className="grid grid-cols-2 gap-4">

<p><strong>Brand:</strong> {basic?.brand_name}</p>
<p><strong>Name:</strong> {basic?.full_name}</p>
<p><strong>City:</strong> {basic?.city}</p>
<p><strong>Area:</strong> {basic?.area}</p>
<p><strong>Service Mode:</strong> {basic?.service_mode}</p>
<p><strong>Travel Radius:</strong> {basic?.travel_radius} km</p>
<p><strong>Languages:</strong> {basic?.languages}</p>

</div>

</div>


{/* SERVICES */}

<div>

<h2 className="text-2xl font-semibold mb-4">
Services
</h2>

<div className="space-y-4">

{services?.map((service)=>(

<div
key={service.id}
className="border rounded-lg p-4 flex justify-between"
>

<div>

<p className="font-medium">
{service.service_name}
</p>

<p className="text-sm text-gray-500">
{service.service_group}
</p>

</div>

<div>

<p className="font-semibold">
₹ {service.price}
</p>

</div>

</div>

))}

</div>

</div>


{/* SERVICE CAPABILITIES */}

{capabilities && (

<div>

<h2 className="text-2xl font-semibold mb-4">
Professional Details
</h2>

<p>Experience: {capabilities.years_experience} years</p>
<p>Expertise: {capabilities.expertise}</p>
<p>Team: {capabilities.team_type}</p>
<p>Max Bookings Per Day: {capabilities.max_bookings}</p>

</div>

)}


{/* ADDITIONAL CHARGES */}

{charges?.length > 0 && (

<div>

<h2 className="text-2xl font-semibold mb-4">
Additional Charges
</h2>

{charges.map((c)=>(
<p key={c.id}>
{c.charge_type} — ₹{c.amount}
</p>
))}

</div>

)}


{/* PAYMENT DETAILS */}

{payments && (

<div>

<h2 className="text-2xl font-semibold mb-4">
Payment Details
</h2>

<p>Payment Structure: {payments.payment_structure}</p>
<p>Accepted Modes: {payments.payment_modes}</p>

</div>

)}


{/* CANCELLATION POLICY */}

{cancellation && (

<div>

<h2 className="text-2xl font-semibold mb-4">
Cancellation Policy
</h2>

<p>7+ days: {cancellation.refund_7_days}% refund</p>
<p>48 hrs - 7 days: {cancellation.refund_48_to_7}% refund</p>
<p>Within 48 hrs: {cancellation.refund_48}% refund</p>

</div>

)}

</div>

</div>

);

}