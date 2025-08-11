"use client";
import DOMPurify from "isomorphic-dompurify";
import { useCart } from "@/context/CartContext";

export default function ProductInfo({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="w-1/2 flex flex-col gap-4">
      <h1 className="text-3xl font-bold">{product.title}</h1>
      <div className="flex items-center gap-3">
        <span className="text-xl line-through text-gray-400">₹{product.originalPrice}</span>
        <span className="text-2xl font-bold text-red-600">₹{product.price}</span>
      </div>
      <p className="text-sm text-gray-600">
        Stock: {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
      </p>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }}
      ></div>

      <button
        onClick={() => addToCart(product)}
        disabled={product.stock <= 0}
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        Add to Cart
      </button>
    </div>
  );
}