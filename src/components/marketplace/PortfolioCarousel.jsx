"use client";

import { useRef, useState, useEffect } from "react";

export default function PortfolioCarousel({ images }) {
  const [preview, setPreview] = useState(null);
  const scrollRef = useRef(null);
  const isAdjusting = useRef(false);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center border rounded-xl text-gray-400">
        No portfolio images uploaded yet
      </div>
    );
  }

  // 🔁 Triple images for seamless loop
  const extendedImages = [...images, ...images, ...images];

  // 👉 Start from middle set
  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.scrollLeft = container.scrollWidth / 3;
    }
  }, []);

  // 👉 Scroll buttons
  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollAmount = container.offsetWidth * 0.8;

    container.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  // 👉 Seamless infinite scroll handler
  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container || isAdjusting.current) return;

    const oneSetWidth = container.scrollWidth / 3;

    if (container.scrollLeft <= oneSetWidth * 0.5) {
      isAdjusting.current = true;

      container.style.scrollBehavior = "auto";
      container.scrollLeft += oneSetWidth;
      container.style.scrollBehavior = "smooth";

      isAdjusting.current = false;
    }

    if (container.scrollLeft >= oneSetWidth * 1.5) {
      isAdjusting.current = true;

      container.style.scrollBehavior = "auto";
      container.scrollLeft -= oneSetWidth;
      container.style.scrollBehavior = "smooth";

      isAdjusting.current = false;
    }
  };

  return (
    <div className="relative w-full">
      {/* SCROLLABLE IMAGES */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto px-2 scroll-smooth scrollbar-hide"
      >
        {extendedImages.map((img, i) => (
          <div
            key={i}
            className="h-72 rounded-xl overflow-hidden flex-shrink-0"
          >
            <img
              src={img}
              className="h-full w-auto object-contain cursor-pointer transition-transform duration-300 hover:scale-105"
              onClick={() => setPreview(img)}
              alt=""
            />
          </div>
        ))}
      </div>

      {/* LEFT BUTTON */}
      <button
        onClick={() => scroll("prev")}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-md"
      >
        ‹
      </button>

      {/* RIGHT BUTTON */}
      <button
        onClick={() => scroll("next")}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-md"
      >
        ›
      </button>

      {/* PREVIEW MODAL */}
      {preview && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setPreview(null)}
        >
          <img
            src={preview}
            className="max-h-[90%] max-w-[90%] object-contain rounded-lg"
            alt=""
          />
        </div>
      )}
    </div>
  );
}