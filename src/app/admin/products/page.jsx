// "use client";
// import { useAuth } from "@/context/AuthContext";
// import { redirect } from "next/navigation";
// import { useEffect, useState } from "react";
//  import { fetchAllProducts } from "@/firebase/products";

// export default function AdminProducts() {
//   const { user } = useAuth();
//   const [products, setProducts] = useState([]);

//   // 🔐 Admin-only access check
//   useEffect(() => {
//     if (!user) return;
//     if (user.email !== "shoppingwelcome17@gmail.com") {
//       redirect("/");
//     } else {
//       fetchAllProducts().then(setProducts);
//     }
//   }, [user]);

//   if (!user || user.email !== "shoppingwelcome17@gmail.com") {
//     return <div className="p-10">Checking access...</div>;
//   }

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">All Products</h1>
//       <table className="w-full bg-white rounded shadow">
//         <thead>
//           <tr className="bg-gray-100 text-left text-sm">
//             <th className="p-2">Title</th>
//             <th className="p-2">Price</th>
//             <th className="p-2">Category</th>
//             <th className="p-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {products.map((prod) => (
//             <tr key={prod.id} className="border-b hover:bg-gray-50">
//               <td className="p-2">{prod.title}</td>
//               <td className="p-2">₹{prod.price}</td>
//               <td className="p-2">{prod.category}</td>
//               <td className="p-2">
//                 <button className="text-blue-500 text-sm">Edit</button> |{" "}
//                 <button className="text-red-500 text-sm">Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }