// "use client";
// import { useEffect, useState } from "react";
// import { fetchProductsByCategory } from "@/firebase/products";
// import ProductCard from "./ProductCard";

// export default function ProductRow({ title, category, limit }) {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     fetchProductsByCategory(category, limit).then(setProducts);
//   }, [category, limit]);

//   return (
//     <div>
//   <h2 className="bg- text-2xl font-semibold mb-4 border-b pb-2 flex items-center gap-2">
//     {title}</h2>
//       <div className="flex gap-4 overflow-x-auto scrollbar-hide">
//         {products.length > 0 ? (
//           products.map((product) => (
//             <div key={product.id} className="min-w-[200px]">
//               <ProductCard product={product} />
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-500">No products found.</p>
//         )}
//       </div>
//     </div>
//   );
// }

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