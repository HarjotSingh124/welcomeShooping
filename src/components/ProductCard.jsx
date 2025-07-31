
// import Image from "next/image";
// import Link from "next/link";


// export default function ProductCard({ product }) {
//   return (
//     <Link href={`/product/${product.id}`} className="block border rounded shadow hover:shadow-lg transition p-3 bg-white">
//       <div className="relative aspect-square mb-2">
//         <Image
//           src={product.images?.[0] || "/placeholder.png"}
//           alt={product.title}
//           fill
//           className="object-cover rounded"
//         />
//       </div>
//       <h2 className="font-semibold text-lg truncate">{product.title}</h2>
//       <p className="text-gray-500 text-sm">{product.type}</p>
//       <p className="text-black font-bold mt-1">₹{product.price}</p>
//       <div className="flex flex-wrap gap-1 mt-2">
//         {product.tags?.slice(0, 3).map(tag => (
//           <span key={tag} className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">{tag}</span>
//         ))}
//       </div>
//     </Link>
//   );
// }




import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="border rounded shadow hover:shadow-lg transition p-3 bg-white flex flex-col">
      {/* Image with link */}
      <Link href={`/product/${product.id}`} className="relative aspect-square mb-2 block">
        <Image
          src={product.images?.[0]|| product.image || "/placeholder.png"}
          alt={product.title}
          fill
          className="object-cover rounded"
        />
      </Link>

      {/* Product Details */}
      <div className="flex-1">
        <h2 className="font-semibold text-md truncate">{product.title}</h2>
        <p className="text-gray-500 text-sm">{product.type}</p>

        <p className="text-black font-bold mt-1 text-sm sm:text-base">
          ₹{product.price}
        </p>

        {/* Tags */}
        {Array.isArray(product.tags) && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {product.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs text-gray-600 bg-gray-200 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={() => addToCart(product)}
        className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black text-sm font-semibold py-2 px-3 rounded"
      >
        Add to Cart
      </button>
    </div>
  );
}