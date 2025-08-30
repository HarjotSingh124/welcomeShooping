// "use client";

// import Link from "next/link";

// export default function CategoryGrid({ title, categories }) {
//   if (!categories || categories.length === 0) {
//     return null;
//   }

//   return (
//     <div className="space-y-6">
//       {title && <h2 className="text-2xl font-bold text-gray-800">{title}</h2>}

//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
//         {categories.map((cat, index) => (
//           <Link
//             key={`${cat.slug || cat.name || index}-${index}`}
//             href={`/category/${encodeURIComponent(cat.slug || cat.name || "")}`}
//             className="bg-white rounded-lg p-4 shadow hover:shadow-md text-center group transition"
//           >
//             <div className="text-4xl mb-3">{cat.icon || "🛍️"}</div>
//             <h3 className="text-md font-semibold text-gray-700 group-hover:text-blue-600 transition">
//               {cat.name || "Unnamed"}
//             </h3>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }


"use client";

import Link from "next/link";

export default function CategoryGrid({ title, categories }) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8">
      {title && (
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-center">
          {title}
        </h2>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {categories.map((cat, index) => (
          <Link
            key={`${cat.slug || cat.name || index}-${index}`}
            href={`/category/${encodeURIComponent(cat.slug || cat.name || "")}`}
            className="group relative rounded-2xl bg-gradient-to-br from-white/70 to-white/30 backdrop-blur-lg p-6 flex flex-col items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Icon */}
            <div className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-110">
              {cat.icon || "🛍️"}
            </div>

            {/* Name */}
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-black transition-colors duration-300">
              {cat.name || "Unnamed"}
            </h3>

            {/* Underline Animation */}
            <span className="absolute bottom-3 left-1/2 w-0 h-0.5 bg-black group-hover:w-2/3 transition-all duration-300 -translate-x-1/2"></span>
          </Link>
        ))}
      </div>
    </div>
  );
}