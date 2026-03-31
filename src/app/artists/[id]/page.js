import Navbar from "@/components/marketplace/Navbar";
import BookingModal from "@/components/marketplace/BookingModal";
import Accordion from "@/components/ui/accordian";
import { supabase } from "@/lib/supabaseClient";
import PortfolioCarousel from "@/components/marketplace/PortfolioCarousel";
import ArtistCalendar from "@/components/marketplace/ArtistCalendar";
import { Briefcase } from "lucide-react";

export default async function ArtistPage({ params }) {

const { id: vendorId } = await params;
console.log("Vendor ID:", vendorId);


const { data: bookings } = await supabase
    .from("vendor_bookings")
    .select("booking_date")
    .eq("vendor_id", vendorId);

const { data: blocked } = await supabase
    .from("vendor_blocked_dates")
    .select("blocked_date")
    .eq("vendor_id", vendorId);


const blockedDates =
    blocked?.map(
    (d) => new Date(d.blocked_date).toLocaleDateString("en-CA")
    ) || [];

/* --------------------------
FETCH BASIC PROFILE
-------------------------- */

const { data: basic } = await supabase
    .from("vendor_basic_profile")
    .select("*")
    .eq("vendor_id", vendorId)
    .single();

/* --------------------------
FETCH PORTFOLIO PHOTOS
-------------------------- */

const { data: photos } = await supabase
    .from("vendor_portfolio_photos")
    .select("*")
    .eq("vendor_id", vendorId)
    .order("position");

/* --------------------------
FETCH SERVICES
-------------------------- */

const { data: servicesData } = await supabase
    .from("vendor_services")
    .select("*")
    .eq("vendor_id", vendorId);

   const services = servicesData || [];

/* --------------------------
FETCH SERVICE CAPABILITIES
-------------------------- */

const { data: capabilities } = await supabase
    .from("vendor_service_capabilities")
    .select("*")
    .eq("vendor_id", vendorId)
    .single();

/* --------------------------
FETCH ADDITIONAL CHARGES
-------------------------- */

const { data: chargesData } = await supabase
    .from("vendor_additional_charges")
    .select("*")
    .eq("vendor_id", vendorId);

   const charges = chargesData || [];

/* --------------------------
FETCH PAYMENT SETTINGS
-------------------------- */

const { data: payments } = await supabase
    .from("vendor_payment_settings")
    .select("*")
    .eq("vendor_id", vendorId)
    .single();

/* --------------------------
FETCH CANCELLATION POLICY
-------------------------- */

const { data: cancellation } = await supabase
    .from("vendor_cancellation_policy")
    .select("*")
    .eq("vendor_id", vendorId)
    .maybeSingle();
  /* --------------------------
  FETCH WEEKLY AVAILABILITY
  -------------------------- */


const { data: availabilityData } = await supabase
    .from("vendor_availability")
    .select("*")
    .eq("vendor_id", vendorId)
    .single();

  const availability = availabilityData || [];

/* --------------------------
CONVERT PHOTO PATHS TO URL
-------------------------- */

const images = photos?.map((p)=>{
    return supabase.storage
    .from("vendor-documents")
    .getPublicUrl(p.photo_url).data.publicUrl
    }) || [];




const hasCapabilities =
  capabilities &&
  (
    capabilities.years_experience ||
    capabilities.expertise ||
    capabilities.artist_type ||
    capabilities.team_size ||
    capabilities.max_bookings ||
    capabilities.lead_time_hours ||
    capabilities.outstation_available !== null ||
    capabilities.outstation_conditions ||
    capabilities.allergy_handling ||
    capabilities.experience_dark_skin !== null ||
    capabilities.dark_skin_details ||
    (capabilities.brands && capabilities.brands.length > 0) ||
    capabilities.hygiene_brush_sanitised ||
    capabilities.hygiene_disposable ||
    capabilities.hygiene_sanitised_kit ||
    capabilities.hygiene_fresh_sponges
  );

return(

        <div>

            <Navbar/>

                <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">

            {/* BOOK BUTTON */}




                        <div className="flex justify-end items-center gap-4">

                                <ArtistCalendar
                                    vendorId={vendorId}
                                />

                                <BookingModal vendorId={vendorId} />

                            </div>
            {/* PORTFOLIO */}

                        <PortfolioCarousel images={images}/>

            {/* BASIC PROFILE */}

                        <Accordion title="Artist Information" defaultOpen> 

                            {!basic ? (

                                <p className="text-gray-400">
                                Artist information not available
                                </p>

                                ) : (

                                <div className="grid grid-cols-2 gap-4">

                                <p><strong>Brand:</strong> {basic.brand_name || "-"}</p>
                                <p><strong>Name:</strong> {basic.full_name || "-"}</p>
                                <p><strong>City:</strong> {basic.city || "-"}</p>
                                <p><strong>Area:</strong> {basic.area || "-"}</p>
                                <p><strong>Service Mode:</strong> {basic.service_mode || "-"}</p>
                                <p><strong>Travel Radius:</strong> {basic.travel_radius || "-"} km</p>
                                <p><strong>Languages:</strong> {basic.languages || "-"}</p>

                                </div>

                            )}

                        </Accordion>

            {/* SERVICES */}

                        <Accordion title="Services" icon={<Briefcase />} >

                            {services?.length === 0 ? (

                                    <p className="text-gray-400">
                                    No services listed yet
                                    </p>

                                    ) : (

                                    <div className="grid md:grid-cols-2 gap-4">

                                    {services.map((service)=>(

                                    <div
                                    key={service.id}
                                    className="border rounded-lg p-5 flex justify-between items-center"
                                    >

                                    <div>

                                    <p className="font-semibold text-lg">
                                    {service.service_name}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                    {service.service_group}
                                    </p>

                                    </div>

                                    <div className="text-lg font-bold">
                                    ₹ {service.price}
                                    </div>

                                    </div>

                                    ))}

                                    </div>

                            )}

                        </Accordion>

            {/* PROFESSIONAL DETAILS */}

                        <Accordion title="Professional Details">

                            {!capabilities ? (

                                <p className="text-gray-400">
                                No professional details provided
                                </p>

                                ) : (

                                <div className="space-y-2">

                                {capabilities.years_experience && (
                                        <p>Experience: {capabilities.years_experience} years</p>
                                    )}

                                    {/* EXPERTISE */}
                                    {capabilities.expertise && (
                                        <p>Expertise: {capabilities.expertise}</p>
                                    )}

                                    {/* ARTIST TYPE + TEAM SIZE */}
                                    {capabilities.artist_type && (
                                        <p>
                                        Artist Type: {capabilities.artist_type}
                                        {capabilities.artist_type === "Team" && capabilities.team_size && (
                                            <> ({capabilities.team_size} members)</>
                                        )}
                                        </p>
                                    )}

                                    {/* BOOKINGS */}
                                    {capabilities.max_bookings && (
                                        <p>Max Bookings Per Day: {capabilities.max_bookings}</p>
                                    )}

                                    {/* LEAD TIME */}
                                    {capabilities.lead_time_hours && (
                                        <p>Minimum Booking Notice: {capabilities.lead_time_hours} hrs</p>
                                    )}

                                    {/* DARK SKIN */}
                                    {capabilities.experience_dark_skin !== null && (
                                        <p>
                                        Experience Working on Dark Skin:{" "}
                                        {capabilities.experience_dark_skin ? "✔ Yes" : "✖ No"}
                                        </p>
                                    )}

                                    {capabilities.dark_skin_details && (
                                        <p>Details: {capabilities.dark_skin_details}</p>
                                    )}

                                    {/* BRANDS (JSON ARRAY) */}
                                    {capabilities.brands?.length > 0 && (
                                        <div>
                                        <p className="font-semibold">Products Used:</p>
                                        <ul className="list-disc ml-5">
                                            {capabilities.brands.map((brand, index) => (
                                            <li key={index}>{brand}</li>
                                            ))}
                                        </ul>
                                        </div>
                                    )}

                                    {/* HYGIENE */}
                                    {(capabilities.hygiene_brush_sanitised ||
                                        capabilities.hygiene_disposable ||
                                        capabilities.hygiene_sanitised_kit ||
                                        capabilities.hygiene_fresh_sponges) && (
                                        <div>
                                        <p className="font-semibold">Hygiene Practices:</p>
                                        <ul className="list-disc ml-5">

                                            {capabilities.hygiene_brush_sanitised && (
                                            <li>Brushes sanitised</li>
                                            )}

                                            {capabilities.hygiene_disposable && (
                                            <li>Disposable applicators</li>
                                            )}

                                            {capabilities.hygiene_sanitised_kit && (
                                            <li>Sanitised kit</li>
                                            )}

                                            {capabilities.hygiene_fresh_sponges && (
                                            <li>Fresh sponges</li>
                                            )}

                                        </ul>
                                        </div>
                                    )}

                                    {/* OUTSTATION */}
                                    {capabilities.outstation_available !== null && (
                                        <p>
                                        Outstation Booking:{" "}
                                        {capabilities.outstation_available ? "Available" : "Not Available"}
                                        </p>
                                    )}

                                    {capabilities.outstation_conditions && (
                                        <p>Outstation Conditions: {capabilities.outstation_conditions}</p>
                                    )}

                                    {/* ALLERGY */}
                                    {capabilities.allergy_handling && (
                                        <p>Allergy Handling: {capabilities.allergy_handling}</p>
                                    )}


                                </div>

                                
                            )}

                        </Accordion>


                    {/* WEEKLY AVAILABILITY */}

                    <Accordion title="Weekly Availability">

                    {availability.length === 0 ? (
                        <p className="text-gray-400">
                        Availability not provided
                        </p>
                    ) : (

                        <div className="space-y-2">

                                                    {[
                            { label: "Monday", from: availability?.monday_from, to: availability?.monday_to },
                            { label: "Tuesday", from: availability?.tuesday_from, to: availability?.tuesday_to },
                            { label: "Wednesday", from: availability?.wednesday_from, to: availability?.wednesday_to },
                            { label: "Thursday", from: availability?.thursday_from, to: availability?.thursday_to },
                            { label: "Friday", from: availability?.friday_from, to: availability?.friday_to },
                            { label: "Saturday", from: availability?.saturday_from, to: availability?.saturday_to },
                            { label: "Sunday", from: availability?.sunday_from, to: availability?.sunday_to },
                            ].map((day) => (
                            <div key={day.label} className="flex justify-between border-b py-2">
                                <span className="font-medium">{day.label}</span>
                                <span>
                                {day.from && day.to ? `${day.from} - ${day.to}` : "Not available"}
                                </span>
                            </div>
                            ))}

                        </div>

                    )}

                    </Accordion>

            {/* ADDITIONAL CHARGES */}

                        <Accordion title="Additional Charges">

                            {charges?.length === 0 ? (

                                <p className="text-gray-400">
                                No additional charges
                                </p>

                                ) : (

                                <div className="space-y-2">

                                {charges.map((c)=>(
                                <p key={c.id}>
                                {c.charge_type} — ₹ {c.amount}
                                </p>
                                ))}

                                </div>

                            )}

                        </Accordion>

            {/* PAYMENT DETAILS */}

                        <Accordion title="Payment Details">

                            {!payments ? (

                                <p className="text-gray-400">
                                Payment information not available
                                </p>

                                ) : (

                                <div className="space-y-2">

                                <p>Payment Structure: {payments.payment_structure}</p>
                                <p>Accepted Modes: {payments.payment_modes}</p>

                                </div>

                            )}

                        </Accordion>

            {/* CANCELLATION POLICY */}

                        <Accordion title="Cancellation Policy">

                            {!cancellation ? (

                                <p className="text-gray-400">
                                Cancellation policy not set
                                </p>

                                ) : (

                                <div className="space-y-2">

                                {cancellation?.cancel_7_days_percent != null && (
                                <p>7+ days: {cancellation.cancel_7_days_percent}%</p>
                                )}

                                {cancellation?.cancel_48hr_7days_percent != null && (
                                <p>48 hrs - 7 days: {cancellation.cancel_48hr_7days_percent}%</p>
                                )}

                                {cancellation?.cancel_within_48hr_percent != null && (
                                <p>Within 48 hrs: {cancellation.cancel_within_48hr_percent}%</p>
                                )}

                                {cancellation?.no_show_percent != null && (
                                <p>No show: {cancellation.no_show_percent}%</p>
                                )}

                                </div>

                            )}

                        </Accordion>

                </div>

            </div>

);

}