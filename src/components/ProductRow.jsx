
"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { getFirestore, collection, getDocs, doc } from "firebase/firestore";
import { app } from "@/firebase/config";

export default function ProductRow({ category, title, limit = 10 }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        const db = getFirestore(app);
        const categoryRef = doc(db, "categories", category);
        const productsSnapshot = await getDocs(collection(categoryRef, "products"));

        const productsData = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(productsData.slice(0, limit));
      } catch (error) {
        console.error("Error fetching products for category:", category, error);
      }
    };

    if (category) {
      fetchProductsByCategory();
    }
  }, [category, limit]);

  if (!products.length) return null;

  return (
    <section className="space-y-2">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {products.map((product) => (
          <div key={product.id} className="min-w-[200px]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}