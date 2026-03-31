"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ReviewSection({ vendorId }) {

  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  /* --------------------------
  FETCH REVIEWS
  -------------------------- */

  async function fetchReviews() {
    const { data } = await supabase
      .from("vendor_reviews")
      .select("*")
      .eq("vendor_id", vendorId)
      .order("created_at", { ascending: false });

    setReviews(data || []);
  }

  useEffect(() => {
    if (vendorId) fetchReviews();
  }, [vendorId]);

  /* --------------------------
  ADD REVIEW
  -------------------------- */

async function handleAddReview() {

  const { data: userData } = await supabase.auth.getUser();
  const currentUser = userData.user;

  if (!currentUser) {
    alert("Please login to write a review");
    return;
  }

  const { error } = await supabase
    .from("vendor_reviews")
    .insert({
      vendor_id: vendorId,
      user_id: currentUser.id,
      rating,
      review_text: text
    });

  if (error) {
    console.error(error);
    alert("Error adding review");
    return;
  }

  setShowModal(false);
  setText("");
  fetchReviews();
}

  return (
    <div className="space-y-4">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Reviews</h2>

        <button
        onClick={() => setShowModal(true)}
        className="text-sm text-[#7A1820] underline"
        >
        + Write Review
        </button>
      </div>

      {/* CAROUSEL (simple horizontal scroll for now) */}
      <div className="flex gap-4 overflow-x-auto pb-2">

        {reviews.length === 0 && (
          <p className="text-gray-400 text-sm">No reviews yet</p>
        )}

        {reviews.map((r) => {

const username = r.users?.email?.split("@")[0] || "User";

  return (
    <div
      key={r.id}
      className="min-w-[260px] border rounded-xl p-4 shadow-sm bg-white"
    >

      {/* USER NAME */}
      <p className="font-semibold text-sm text-[#7A1820]">
        {username}
      </p>

      {/* RATING */}
      <div className="flex text-yellow-400 text-sm">
        {[1, 2, 3, 4, 5].map((star) => (
            <span key={star}>
            {star <= r.rating ? "★" : "☆"}
            </span>
        ))}
        </div>

      {/* REVIEW */}
      <p className="text-sm text-gray-600 mt-2">
        {r.review_text}
      </p>

      {/* DATE */}
      <p className="text-xs text-gray-400 mt-3">
        {new Date(r.created_at).toLocaleDateString()}
      </p>

    </div>
  );
})}

      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

          <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">

            <h3 className="text-lg font-semibold">
              Write a Review
            </h3>

            <div className="flex gap-1 text-2xl cursor-pointer">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                    key={star}
                    onClick={() => setRating(star)}
                    className={
                        star <= rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }
                    >
                    ★
                    </span>
                ))}
                </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="border p-2 w-full"
              placeholder="Write your review"
            />

            <div className="flex justify-end gap-3">

              <button onClick={() => setShowModal(false)}>
                Cancel
              </button>

              <button
                onClick={handleAddReview}
                className="bg-[#7A1820] text-white px-4 py-2 rounded"
              >
                Submit
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}