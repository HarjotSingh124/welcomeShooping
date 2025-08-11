"use client";
import Image from "next/image";
import ImageZoom from "./ImageZoom";

export default function ImageGallery({ images, selectedImage, setSelectedImage, title }) {
  return (
    <div className="flex gap-4 w-1/2">
      <div className="flex flex-col gap-4 w-24">
        {images?.map((img, idx) => (
          <div
            key={idx}
            className={`relative w-24 h-24 border rounded cursor-pointer overflow-hidden ${
              selectedImage === img ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => setSelectedImage(img)}
          >
            <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
          </div>
        ))}
      </div>
      <div className="flex-1 relative h-[500px]">
        <ImageZoom src={selectedImage} alt={title} />
      </div>
    </div>
  );
}