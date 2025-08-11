// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { getDoc, doc, getFirestore } from "firebase/firestore";
// import { app } from "@/firebase/config";
// import { useCart } from "@/context/CartContext";
// import Image from "next/image";
// import { fetchProductsByCategory } from "@/firebase/products";
// import ProductCard from "@/components/ProductCard";

// export default function ProductDetailPage() {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const { addToCart } = useCart();
//   const [relatedProducts, setRelatedProducts] = useState([]);
//   const [activeImage, setActiveImage] = useState(null);

//   useEffect(() => {
//     const loadProduct = async () => {
//       const db = getFirestore(app);
//       const docRef = doc(db, "products", id);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         const prod = { id: docSnap.id, ...docSnap.data() };
//         setProduct(prod);
//         setActiveImage(prod.images?.[0] || prod.image);

//         const all = await fetchProductsByCategory(prod.category);
//         const filtered = all.filter((p) => p.id !== docSnap.id);
//         setRelatedProducts(filtered);
//       }
//     };
//     loadProduct();
//   }, [id]);

//   if (!product)
//     return <div className="text-center text-lg mt-10">Loading product...</div>;

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       <div className="flex flex-col md:flex-row gap-8">
//         {/* Image section */}
//         <div className="flex-1">
//           <div className="border rounded p-4 bg-white">
//             <Image
//               src={activeImage}
//               alt={product.title}
//               width={500}
//               height={500}
//               className="w-full h-[400px] object-contain"
//             />
//             <div className="flex gap-2 mt-4 overflow-x-auto">
//               {(product.images || [product.image]).map((img, i) => (
//                 <img
//                   key={i}
//                   src={img}
//                   onClick={() => setActiveImage(img)}
//                   className={`w-16 h-16 object-cover cursor-pointer border rounded ${
//                     activeImage === img ? "ring-2 ring-blue-500" : ""
//                   }`}
//                   alt="thumb"
//                 />
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Product info section */}
//         <div className="flex-1 space-y-4">
//           <h1 className="text-2xl font-bold text-gray-800 leading-snug">
//             {product.title}
//           </h1>
//           <p className="text-2xl font-semibold text-green-600">₹{product.price}</p>
//           <p className="text-yellow-500 font-medium">⭐ {product.rating} / 5</p>

//           {product.status !== "active" && (
//             <p className="text-red-600 font-semibold">This product is currently inactive.</p>
//           )}

//           <ul className="text-sm text-gray-700 list-disc list-inside">
//             <li>10 Days Replacement</li>
//             <li>Cash on Delivery Available</li>
//             <li>Free Delivery</li>
//           </ul>

//           <div className="flex gap-4 mt-4">
//             <button
//               onClick={() => addToCart(product)}
//               className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 font-semibold rounded shadow"
//             >
//               Add to Cart
//             </button>
//             <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 font-semibold rounded shadow">
//               Buy Now
//             </button>
//           </div>

//           <div className="text-sm text-gray-600 mt-6 space-y-1">
//             <p><strong>Sold by:</strong> Welcome Shopping Pvt Ltd</p>
//             <p><strong>Category:</strong> {product.category}</p>
//             <p><strong>Type:</strong> {product.type}</p>
//             <p><strong>Tags:</strong> {product.tags?.join(", ")}</p>
//           </div>

//                 <div className="mt-10">
//           <h2 className="text-lg font-bold mb-2">Description</h2>
//           <div
//             className="prose prose-sm text-gray-700"
//             dangerouslySetInnerHTML={{
//               __html: product.body_html || product.description || "<p>No description available.</p>",
//             }}
//           />
//         </div>
//           <div className="mt-6">
//             <h2 className="text-md font-bold mb-2">Specifications</h2>
//             <ul className="text-sm text-gray-700 list-disc list-inside">
//               <li>Warranty: 1 year</li>
//               <li>Delivery within 3-5 days</li>
//               <li>Support: 24/7 customer care</li>
//             </ul>
//           </div>
//         </div>
//       </div>

//       {/* Related products */}
//       {relatedProducts.length > 0 && (
//         <div className="mt-10">
//           <h2 className="text-xl font-bold mb-4">More from this category</h2>
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//             {relatedProducts.map((prod) => (
//               <ProductCard key={prod.id} product={prod} />
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }















// "use client";
// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { getDoc, doc, getFirestore } from "firebase/firestore";
// import { app } from "@/firebase/config";
// import { useCart } from "@/context/CartContext";
// import Image from "next/image";
// import { fetchProductsByCategory } from "@/firebase/products";
// import ProductCard from "@/components/ProductCard";
// import DOMPurify from "isomorphic-dompurify";

// export default function ProductDetailPage() {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const [relatedProducts, setRelatedProducts] = useState([]);
//   const { addToCart } = useCart();

//   useEffect(() => {
//     const loadProduct = async () => {
//       const db = getFirestore(app);
//       const docRef = doc(db, "products", id);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         const prod = { id: docSnap.id, ...docSnap.data() };
//         setProduct(prod);

//         const all = await fetchProductsByCategory(prod.category);
//         const filtered = all.filter((p) => p.id !== docSnap.id);
//         setRelatedProducts(filtered);
//       }
//     };
//     loadProduct();
//   }, [id]);

//   if (!product) return <div className="p-10 text-center text-gray-500">Loading product...</div>;

  // const cleanDescription = DOMPurify.sanitize(product.description || product.bodyHtml || "");

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       {/* Product Content */}
//       <div className="flex flex-col md:flex-row gap-8 bg-white rounded-lg p-6 shadow-sm">
//         {/* Left: Main Image */}
//         <div className="flex-1">
//           <Image
//             src={product.images?.[0] || product.image || "/placeholder.jpg"}
//             alt={product.title}
//             width={500}
//             height={500}
//             className="w-full h-[400px] object-contain border"
//           />
//         </div>

//         {/* Right: Details */}
//         <div className="flex-1 space-y-4">
//           <h1 className="text-2xl font-bold text-gray-800">{product.title}</h1>
//           <p className="text-yellow-500 font-medium">⭐ {product.rating || "4.5"} / 5</p>

//           <p className="text-3xl font-semibold text-green-600">
//             ₹{product.price?.toFixed(2) || "N/A"}
//           </p>

//           <ul className="text-sm text-gray-600 list-disc list-inside mt-2">
//             <li>Free Delivery</li>
//             <li>10 Day Replacement Policy</li>
//             <li>Cash on Delivery Available</li>
//           </ul>

//           {/* CTA Buttons */}
//           <div className="flex gap-4 mt-4">
//             <button
//               onClick={() => addToCart(product)}
//               className="bg-yellow-400 hover:bg-yellow-500 px-6 py-2 font-semibold rounded"
//             >
//               Add to Cart
//             </button>
//             <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 font-semibold rounded">
//               Buy Now
//             </button>
//           </div>

//           <div className="text-sm text-gray-500 mt-4 space-y-1">
//             <p><b>Category:</b> {product.category}</p>
//             <p><b>Type:</b> {product.type}</p>
//             <p><b>Tags:</b> {product.tags?.join(", ") || "—"}</p>
//             <p><b>Sold By:</b> Welcome Shopping Pvt Ltd</p>
//           </div>
//         </div>
//       </div>

//       {/* Description */}
//       {cleanDescription && (
//         <div className="bg-white rounded-lg shadow-sm p-6 mt-10">
//           <h2 className="text-xl font-bold mb-4">Product Description</h2>
//           <div
//             className="prose prose-sm max-w-none text-gray-700"
//             dangerouslySetInnerHTML={{ __html: cleanDescription }}
//           />
//         </div>
//       )}

//       {/* Related Products */}
//       {relatedProducts.length > 0 && (
//         <div className="mt-10">
//           <h2 className="text-xl font-semibold mb-4 text-gray-800">
//             More from this category
//           </h2>
//           <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
//             {relatedProducts.map((prod) => (
//               <div key={prod.id} className="min-w-[200px]">
//                 <ProductCard product={prod} />
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }








"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getFirestore, doc, getDoc, collectionGroup, query, where, getDocs } from "firebase/firestore";
import { app } from "@/firebase/config";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import DOMPurify from "isomorphic-dompurify";
import SkeletonLoader from "@/components/SkeletonLoader"; // New Loader Component

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const db = getFirestore(app);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      // Fetch the product from category subcollections
      const q = query(collectionGroup(db, "products"), where("handle", "==", id));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const docData = snapshot.docs[0];
        const prod = { id: docData.id, ...docData.data() };
        setProduct(prod);

        // Fetch related products from same category
        const category = docData.data().category;
        const relatedSnap = await getDocs(collectionGroup(db, "products"));
        const related = relatedSnap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((p) => p.category === category && p.handle !== id);
        setRelatedProducts(related);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <SkeletonLoader type="productDetail" count={2} />;

  const cleanHTML = DOMPurify.sanitize(product.description || "");

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Left: Image */}
        <div className="flex-1">
          <div className="bg-white border p-4 rounded">
            <Image
              src={product.images?.[0] || product.image || "/placeholder.png"}
              alt={product.title}
              width={500}
              height={500}
              className="object-contain w-full h-[400px]"
            />
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-xl font-semibold text-green-600">₹{product.price}</p>
          <p className="text-yellow-600">⭐ {product.rating || "4.3"} / 5</p>
          <p className="text-gray-600 text-sm">Category: {product.category}</p>

          <ul className="text-sm text-gray-600 list-disc list-inside mt-2">
            <li>10 Days Replacement</li>
            <li>Cash on Delivery Available</li>
            <li>Free Delivery</li>
          </ul>

          <div className="flex gap-4 mt-4">
            <button
              onClick={() => addToCart(product)}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 font-semibold rounded"
            >
              Add to Cart
            </button >
            <button
              onClick={() => {
                addToCart(product);
                router.push(`/cart`);
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 font-semibold rounded"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-10 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-3">Product Description</h2>
        <div
          className="prose prose-sm prose-gray max-w-full"
          dangerouslySetInnerHTML={{ __html: cleanHTML }}
        />
      </div>

      {/* Related */}
      {relatedProducts.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Related Products</h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {relatedProducts.map((prod) => (
              <div key={prod.id} className="min-w-[200px]">
                <ProductCard product={prod} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}