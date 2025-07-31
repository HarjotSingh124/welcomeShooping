"use client";

import Link from "next/link";

export default function CategoryGrid({ title, categories }) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {title && <h2 className="text-2xl font-bold text-gray-800">{title}</h2>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {categories.map((cat, index) => (
          <Link
            key={`${cat.slug || cat.name || index}-${index}`}
            href={`/category/${encodeURIComponent(cat.slug || cat.name || "")}`}
            className="bg-white rounded-lg p-4 shadow hover:shadow-md text-center group transition"
          >
            <div className="text-4xl mb-3">{cat.icon || "🛍️"}</div>
            <h3 className="text-md font-semibold text-gray-700 group-hover:text-blue-600 transition">
              {cat.name || "Unnamed"}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
}