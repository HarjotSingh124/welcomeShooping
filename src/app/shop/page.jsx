// "use client";
// import { useEffect, useState } from "react";
// import { fetchAllProducts } from "@/firebase/products";
// import Link from "next/link";
// import Image from "next/image";

// export default function Shop() {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     fetchAllProducts().then(setProducts);
//   }, []);

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-10">
//       <h1 className="text-2xl font-bold mb-6">Shop All Products</h1>

//       <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//         {products.map((product) => (
//           <Link key={product.id} href={`/product/${product.id}`} className="bg-white p-4 shadow rounded hover:shadow-md">
//             <Image
//               src={product.image}
//               alt={product.title}
//               width={300}
//               height={300}
//               className="object-contain h-48 w-full mb-2"
//             />
//             <h2 className="text-md font-medium truncate">{product.title}</h2>
//             <p className="text-green-600 font-semibold">₹{product.price}</p>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }