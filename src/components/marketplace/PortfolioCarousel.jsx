"use client";

import { useState } from "react";

export default function PortfolioCarousel({ images }) {

  const [current, setCurrent] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center border rounded-xl text-gray-400">
        No portfolio images uploaded yet
      </div>
    );
  }

  const next = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prev = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const visibleImages = [
    images[current],
    images[(current + 1) % images.length],
    images[(current + 2) % images.length],
    ];
  return (
    <div className="relative w-full">

      {/* IMAGE */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> 
        {visibleImages.map((img, i) => ( 
            <div key={i} className="h-72 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center" > 
            <img src={img} className="max-h-full max-w-full object-contain" /> 
            </div> ))
        } 
    </div>

      {/* LEFT BUTTON */}

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-md"
      >
        ‹
      </button>

      {/* RIGHT BUTTON */}

      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-md"
      >
        ›
      </button>

      {/* DOT INDICATORS */}

      <div className="flex justify-center gap-2 mt-4">

        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 w-2 rounded-full transition ${
              i === current ? "bg-black" : "bg-gray-300"
            }`}
          />
        ))}

      </div>

    </div>
  );
}