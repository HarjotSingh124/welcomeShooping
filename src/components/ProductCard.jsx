// "use client";
// import Image from "next/image";
// import Link from "next/link";
// import { useCart } from "@/context/CartContext";
// import { useState } from "react";

// export default function ProductCard({ product }) {
//   const { addToCart } = useCart();
//   product.quantity = 1;


//   return (
//     <div className="border rounded shadow hover:shadow-lg transition p-3 bg-white flex flex-col">
//       {/* Image with link */}
//       <Link href={`/product/${product.id}`} className="relative aspect-square mb-2 block">
//         <Image
//           src={product.images?.[0]|| product.image || "/placeholder.png"}
//           alt={product.title}
//           fill
//           className="object-cover rounded"
//         />
//       </Link>

//       {/* Product Details */}
//       <div className="flex-1">
//         <h2 className="font-semibold text-md truncate">{product.title}</h2>
//         <p className="text-gray-500 text-sm">{product.type}</p>

//         <p className="text-black font-bold mt-1 text-sm sm:text-base">
//           ₹{product.price}
//         </p>
        

//         {/* Tags */}
//         {Array.isArray(product.tags) && product.tags.length > 0 && (
//           <div className="flex flex-wrap gap-1 mt-2">
//             {product.tags.slice(0, 2).map((tag) => (
//               <span
//                 key={tag}
//                 className="text-xs text-gray-600 bg-gray-200 px-2 py-0.5 rounded-full"
//               >
//                 {tag}
//               </span>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Add to Cart Button */}
//       <button
//         onClick={() => addToCart(product)}
//         className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black text-sm font-semibold py-2 px-3 rounded"
//       >
//         Add to Cart
//       </button>
//     </div>
//   );
// }
"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  product.quantity = 1;

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-4 flex flex-col h-full border border-gray-100">
      {/* Image */}
      <Link
        href={`/product/${product.id}`}
        className="relative w-full aspect-square mb-3 block overflow-hidden rounded-lg bg-gray-50"
      >
        <Image
          src={product.images?.[0] || product.image || "/placeholder.png"}
          alt={product.title}
          fill
          className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      {/* Product Info */}
      <div className="flex-1 flex flex-col">
        <h2 className="font-medium text-gray-900 text-sm sm:text-base truncate">
          {product.title}
        </h2>
        <p className="text-gray-500 text-xs sm:text-sm">{product.type}</p>

        <p className="text-lg font-semibold text-blue-600 mt-1">
          ₹{product.price}
        </p>

        {/* Tags */}
        {Array.isArray(product.tags) && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {product.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Add to Cart */}
        <button
          onClick={() => addToCart(product)}
          className="mt-3 w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-semibold py-2 rounded-lg shadow transition-all"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}