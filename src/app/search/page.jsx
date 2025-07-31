
export const dynamic = 'force-dynamic';
'use client';

import { Suspense } from 'react';
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { searchProducts } from "@/firebase/products";
import Link from "next/link";
import Image from "next/image";


function SearchContent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [visibleCount, setVisibleCount] = useState(20);

  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  useEffect(() => {
    if (query) {
      setLoading(true);
      searchProducts(query).then((results) => {
        setProducts(results);
        setLoading(false);
      });

      const prev = JSON.parse(localStorage.getItem("searchHistory") || "[]");
      const updated = [query, ...prev.filter((q) => q !== query)].slice(0, 5);
      localStorage.setItem("searchHistory", JSON.stringify(updated));
      setHistory(updated);
    }
  }, [query]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    setHistory(stored);
  }, []);

  const handleClearHistory = () => {
    localStorage.removeItem("searchHistory");
    setHistory([]);
  };

  const loadMore = () => {
    setVisibleCount((prev) => prev + 20);
  };

  const visibleProducts = products.slice(0, visibleCount);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        Search Results for "{query}"
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Searching...</p>
      ) : (
        <>
          {products.length === 0 ? (
            <p className="text-center text-gray-600">No products found.</p>
          ) : (
            <>
              {history.length > 0 && (
                <div className="mt-10">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">Recent Searches</h3>
                    <button
                      onClick={handleClearHistory}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Clear History
                    </button>
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {history.map((item, idx) => (
                      <Link
                        key={idx}
                        href={`/search?query=${encodeURIComponent(item)}`}
                        className="bg-gray-200 px-3 py-1 rounded-full text-sm hover:bg-gray-300"
                      >
                        {item}
                      </Link>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {visibleProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="bg-white p-4 shadow rounded hover:shadow-md transition"
                  >
                    <Image
                      src={product.image || "/placeholder.png"}
                      alt={product.title}
                      width={300}
                      height={300}
                      className="object-contain h-48 w-full mb-2"
                    />
                    <h3 className="font-medium mt-2">{product.title}</h3>
                    <p className="text-green-600 font-bold">₹{product.price}</p>
                    <p className="text-yellow-600 text-sm">
                      ⭐ {product.rating} rating
                    </p>
                  </Link>
                ))}
              </div>

              {visibleCount < products.length && (
                <div className="text-center mt-6">
                  <button
                    onClick={loadMore}
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center mt-10 text-gray-500">Loading Search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
