import Navbar from "@/components/marketplace/Navbar";
import BookingModal from "@/components/marketplace/BookingModal";
import Accordion from "@/components/ui/accordian";
import { supabase } from "@/lib/supabaseClient";
import PortfolioCarousel from "@/components/marketplace/PortfolioCarousel";
import ArtistCalendar from "@/components/marketplace/ArtistCalendar";
import { Briefcase } from "lucide-react";
import ReviewSection from "@/components/marketplace/ReviewSection";

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


const validCharges = charges?.filter(
  (c) =>
    (c?.charge_type && c.charge_type.trim() !== "") ||
    (c?.description && c.description.trim() !== "")
);


const paymentList = Array.isArray(payments)
  ? payments
  : payments
  ? [payments]
  : [];
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

                                <p><strong className="text-[#691926]">Brand:</strong> <span className="text-black">{basic.brand_name || "-"}</span></p>
                                <p><strong className="text-[#691926]">Name:</strong> <span className="text-black">{basic.full_name || "-"}</span></p>
                                <p><strong className="text-[#691926]">City:</strong> <span className="text-black">{basic.city || "-"}</span></p>
                                <p><strong className="text-[#691926]">Area:</strong> <span className="text-black">{basic.area || "-"}</span></p>
                                <p><strong className="text-[#691926]">Service Mode:</strong> <span className="text-black">{basic.service_mode || "-"}</span></p>
                                <p><strong className="text-[#691926]">Travel Radius:</strong> <span className="text-black">{basic.travel_radius || "-"} km</span></p>
                                <p><strong className="text-[#691926]">Languages:</strong> <span className="text-black">{basic.languages || "-"}</span></p>
                                <p>
                                <strong className="text-[#691926]">Service Mode:</strong>{" "}
                                <span className="text-black">
                                    {(() => {
                                    const mode = basic.service_mode?.toLowerCase() || "";

                                    const mapped = [];

                                    if (mode.includes("travel")) {
                                        mapped.push("Travels to client");
                                    }

                                    if (mode.includes("studio")) {
                                        mapped.push("In-studio");
                                    }

                                    return mapped.length ? mapped.join(", ") : basic.service_mode || "-";
                                    })()}
                                </span>
                                </p>

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
                            <div className="grid md:grid-cols-2 gap-3">
                            {services.map((service) => (
                                <div
                                key={service.id}
                                className="border border-[#691926] rounded-xl p-3 bg-[#faf7f5] shadow-sm hover:shadow-md transition text-black"
                                >
                                {/* TITLE + PRICE */}
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-semibold text-[#691926]">
                                    {service.service_name}
                                    </h3>

                                    <span className="font-semibold">
                                    ₹{service.price / 1000}k
                                    </span>
                                </div>

                                {/* DURATION */}
                                {service.duration && (
                                    <p>
                                    ⏰ {service.duration} min
                                    </p>
                                )}

                                {/* INCLUSIONS */}
                                {service.inclusions && (
                                    <p className="text-green-700">
                                    + {service.inclusions}
                                    </p>
                                )}

                                {/* EXCLUSIONS */}
                                {service.exclusions && (
                                    <p className="text-red-500">
                                    − {service.exclusions}
                                    </p>
                                )}
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
                                        <p>
                                        <strong className="text-[#691926]">Experience:</strong>{" "}
                                        <span className="text-black">
                                        {capabilities.years_experience} years
                                        </span>
                                        </p>
                                    )}

                                    {/* EXPERTISE */}
                                    {capabilities.expertise && (
                                            <p>
                                                <strong className="text-[#691926]">Expertise:</strong>{" "}
                                                <span className="text-black">{
                                                    (() => {
                                                        const expertise = capabilities.expertise.toLowerCase();

                                                        const mapped = [];

                                                        if (expertise.includes("south indian")) {
                                                            mapped.push("South Indian");
                                                        }

                                                        if (expertise.includes("indian") && !expertise.includes("south indian")) {
                                                            mapped.push("North Indian");
                                                        }

                                                        return mapped.length ? mapped.join(", ") : capabilities.expertise;
                                                    })()
                                                }
                                                </span>
                                            </p>
                                        )}
                                    {/* ARTIST TYPE + TEAM SIZE */}
                                    {capabilities.artist_type && (
                                        <p>
                                        <strong className="text-[#691926]">Artist Type:</strong>{" "} {capabilities.artist_type}
                                        {capabilities.artist_type === "Team" && capabilities.team_size && (
                                            <> (<span className="text-black">{capabilities.team_size}</span> members)</>
                                        )}
                                        </p>
                                    )}

                                    {/* BOOKINGS */}
                                    {capabilities.max_bookings && (
                                        <p><strong className="text-[#691926]">Max Bookings Per Day:</strong>{" "} <span className="text-black">{capabilities.max_bookings}</span></p>
                                    )}

                                    {/* LEAD TIME */}
                                    {/*
                                    {capabilities.lead_time_hours && (
                                        <p>Minimum Booking Notice: {capabilities.lead_time_hours} hrs</p>
                                    )}
                                        */}

                                    {/* DARK SKIN */}
                                    {capabilities.experience_dark_skin !== null && (
                                        <p>
                                        <strong className="text-[#691926]">Experience Working on Dusky Skin:</strong>{" "}
                                        <span className="text-black">
                                            {capabilities.experience_dark_skin ? "✔ Yes" : "✖ No"}
                                        </span>
                                        </p>
                                    )}

                                    {/* BRANDS (JSON ARRAY) */}
                                    {capabilities.brands?.length > 0 && (
                                        <div>
                                        <p className="font-semibold"><strong className="text-[#691926]">Products Used:</strong></p>
                                        <ul className="list-disc ml-5">
                                            <span className="text-black">
                                            {capabilities.brands.map((brand, index) => (
                                            <li key={index}>{brand}</li>
                                            ))}
                                            </span>
                                        </ul>
                                        </div>
                                    )}

                                    {/* HYGIENE */}
                                    {(capabilities.hygiene_brush_sanitised ||
                                        capabilities.hygiene_disposable ||
                                        capabilities.hygiene_sanitised_kit ||
                                        capabilities.hygiene_fresh_sponges) && (
                                        <div>
                                        <p className="font-semibold"><strong className="text-[#691926]">Hygiene Practices:</strong></p>
                                        <ul className="list-disc ml-5">

                                            <span className="text-black">
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
                                            </span>

                                        </ul>
                                        </div>
                                    )}

                                    {/* OUTSTATION */}
                                    {capabilities.outstation_available !== null && (
                                        <p>
                                        <strong className="text-[#691926]">Outstation Booking:</strong>{" "}
                                        <span className="text-black">
                                            {capabilities.outstation_available ? "Available" : "Not Available"}
                                        </span>
                                        </p>
                                    )}

                                    {capabilities.outstation_conditions && (
                                        <p><strong className="text-[#691926]">Outstation Conditions:</strong> <span className="text-black">{capabilities.outstation_conditions}</span></p>
                                    )}

                                    {/* ALLERGY */}
                                    {capabilities.allergy_handling && (
                                        <p><strong className="text-[#691926]">Allergy Handling:</strong> <span className="text-black">{capabilities.allergy_handling}</span></p>
                                    )}


                                </div>

                                
                            )}

                        </Accordion>




                    {/* WEEKLY AVAILABILITY */}

                    {/*

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

                    </Accordion>  */}

            {/* ADDITIONAL CHARGES */}

                    {validCharges?.length > 0 && (
  <Accordion title="Additional Charges">
    <div className="space-y-3">
      {validCharges.map((c) => {
        const desc = c.description;

        return (
          <div
            key={c.id}
            className="border rounded-lg p-3 bg-gray-50"
          >
            <p className="text-sm font-bold text-[#691926]">
              {c.charge_type?.trim() || "Other Charges"}
            </p>

            {desc && desc.trim() !== "" && (
              <p className="text-xs text-black mt-1 leading-relaxed">
                {desc}
              </p>
            )}
          </div>
        );
      })}
    </div>
  </Accordion>   
)}

            {/* PAYMENT DETAILS */}

                        <Accordion title="Payment Details">
                        {paymentList.length === 0 ? (
                            <p className="text-black">
                            Payment information not available
                            </p>
                        ) : (
                            <div className="space-y-4 text-black">
                                <span className="text-black>">

                            {paymentList.map((p) => {
                                const modes = [
                                p.accept_upi && "UPI",
                                p.accept_cash && "Cash",
                                p.accept_bank_transfer && "Bank Transfer",
                                ].filter(Boolean);

                                if (
                                !p.payment_structure &&
                                modes.length === 0 &&
                                !p.notes &&
                                p.provides_invoice === null
                                ) {
                                return null;
                                }
                               

                                return (
                                <div key={p.id} className="border rounded-lg p-3 bg-gray-50">
                                    {p.payment_structure && (
                                    <p className="text-sm font-medium text-black">
                                        {p.payment_structure}
                                    </p>
                                    )}

                                    {modes.length > 0 && (
                                    <p className="text-xs text-black mt-1">
                                        Accepted: {modes.join(", ")}
                                    </p>
                                    )}

                                    {p.provides_invoice !== null && (
                                    <p className="text-xs text-black mt-1">
                                        Invoice: {p.provides_invoice ? "Available" : "Will Not Be Provided"}
                                    </p>
                                    )}

                                    {p.notes && (
                                    <p className="text-xs text-black mt-1">
                                        {p.notes}
                                    </p>
                                    )}
                                </div>
                                );
                            })}
                             </span>
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
                            <div className="space-y-2 text-sm text-gray-700">

                            {/* 🚨 MAIN LOGIC */}
                            {cancellation.no_refund_on_cancel ? (
                                <>
                                <p className="font-medium text-red-600">
                                    No refund on cancellation
                                </p>
                                </>
                            ) : (
                                <>
                                {cancellation.cancel_7_days_percent != null && (
                                    <p>
                                    7+ days: {cancellation.cancel_7_days_percent}% refund
                                    </p>
                                )}

                                {cancellation.cancel_48hr_7days_percent != null && (
                                    <p>
                                    48 hrs – 7 days: {cancellation.cancel_48hr_7days_percent}% refund
                                    </p>
                                )}

                                {/* Optional notes */}
                                {cancellation.cancel_7_days_notes && (
                                    <p className="text-xs text-gray-500">
                                    {cancellation.cancel_7_days_notes}
                                    </p>
                                )}

                                {cancellation.cancel_48hr_7days_notes && (
                                    <p className="text-xs text-gray-500">
                                    {cancellation.cancel_48hr_7days_notes}
                                    </p>
                                )}
                                </>
                            )}
                            </div>
                        )}
                        </Accordion>


                        <ReviewSection vendorId={vendorId} />

                </div>

            </div>

);

}