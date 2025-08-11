"use client";
import { useState } from "react";
import Image from "next/image";

export default function ImageZoom({ src, alt }) {
  const [zoomStyle, setZoomStyle] = useState({});

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2)",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ transform: "scale(1)" });
  };

  return (
    <div
      className="w-full h-full relative overflow-hidden bg-white border rounded"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Image
        src={src || "/placeholder.png"}
        alt={alt}
        fill
        className="object-contain transition-transform duration-300"
        style={zoomStyle}
      />
    </div>
  );
}