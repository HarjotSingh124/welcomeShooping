"use client";
import { useEffect, useState } from "react";

export default function HeroCarousel({ images }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setIndex((i) => (i + 1) % images.length), 4000);
    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="overflow-hidden rounded-xl shadow mb-6">
      <img
        src={images[index]}
        alt={`Slide ${index + 1}`}
        className="w-full h-64 md:h-96 object-cover transition-all duration-500"
      />
    </div>
  );
}