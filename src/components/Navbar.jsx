// "use client";

// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/context/AuthContext";
// import { useCart } from "@/context/CartContext";
// import { ShoppingCart, LogIn, LogOut } from "lucide-react";
// import { useState } from "react";

// export default function Navbar() {
//   const { user, logout } = useAuth();
//   const { cart } = useCart();
//   const router = useRouter();
//   const [search, setSearch] = useState("");


//   const handleSearch = (e) => {
//     if (e.key === "Enter" && search.trim()) {
//       router.push(`/search?query=${encodeURIComponent(search.trim())}`);
//       setSearch("");
//     }
//   };

//   const cartCount = cart?.length || 0;

//   return (
//     <header className="bg-[#BEB9B1] shadow sticky top-0 z-50">
//       {/* Top Row: Logo + Actions */}
//       <div className="flex items-center justify-between px-4 py-2">
//         <Link href="/" className="text-black text-xl font-bold">
//           WelcomeShopping
//         </Link>

//         <div className="flex items-center gap-4">
//           {user ? (
//             <button
//               onClick={logout}
//               className="flex items-center text-black text-sm hover:text-red-600"
//             >
//               <LogOut className="w-5 h-5 mr-1" />
//               Logout
//             </button>
//           ) : (
//             <button
//               onClick={() => router.push("/login")}
//               className="flex items-center text-black text-sm hover:text-blue-600"
//             >
//               <LogIn className="w-5 h-5 mr-1" />
//               Login
//             </button>
//           )}

//           <Link href="/cart" className="relative text-black hover:text-blue-600">
//             <ShoppingCart className="w-6 h-6" />
//             {cartCount > 0 && (
//               <span className="absolute -top-2 -right-3 bg-yellow-400 text-xs text-white px-1 rounded-full">
//                 {cartCount}
//               </span>
//             )}
//           </Link>

//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="px-4 pb-2">
//         <input
//           type="text"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           onKeyDown={handleSearch}
//           placeholder="Search for products, brands and more"
//           className="w-full px-4 py-2 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//         />
//       </div>
//     </header>
//   );
// }


"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, LogIn, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { db } from "@/firebase/config";
import { collection, getDocs } from "firebase/firestore";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);

  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snapshot = await getDocs(collection(db, "categories"));
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim()) {
      router.push(`/search?query=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  const cartCount = cart?.length || 0;

  return (
    <header className="bg-[#BEB9B1] shadow sticky top-0 z-50">
      {/* Top Row: Logo + Actions */}
      <div className="flex items-center justify-between px-4 py-2">
        <Link href="/" className="text-black text-xl font-bold">
          WelcomeShopping
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <button
              onClick={logout}
              className="flex items-center text-black text-sm hover:text-red-600"
            >
              <LogOut className="w-5 h-5 mr-1" />
              Logout
            </button>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="flex items-center text-black text-sm hover:text-blue-600"
            >
              <LogIn className="w-5 h-5 mr-1" />
              Login
            </button>
          )}

          <Link href="/cart" className="relative text-black hover:text-blue-600">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-yellow-400 text-xs text-white px-1 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 pb-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearch}
          placeholder="Search for products, brands and more"
          className="w-full px-4 py-2 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Category Navigation */}
      <div className="bg-[#A79F92] px-4 py-2 overflow-x-auto scrollbar-hide flex space-x-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${encodeURIComponent(cat.id)}`}
            className="text-sm text-black hover:text-blue-800 whitespace-nowrap font-medium"
          >
            {cat.name || cat.id}
          </Link>
        ))}
      </div>
    </header>
  );
}