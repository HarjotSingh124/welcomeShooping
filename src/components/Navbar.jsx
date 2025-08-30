
// "use client";

// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/context/AuthContext";
// import { useCart } from "@/context/CartContext";
// import { ShoppingCart } from "lucide-react";
// import { useState, useEffect } from "react";
// import { db } from "@/firebase/config";
// import { collection, getDocs } from "firebase/firestore";

// import AccountDropdown from "../app/profile/AccountDropdown";

// export default function Navbar() {
//   const { user, logout } = useAuth();
//   const { cart } = useCart();
//   const router = useRouter();
//   const [search, setSearch] = useState("");
//   const [categories, setCategories] = useState([]);

//   // Fetch categories from Firestore
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const snapshot = await getDocs(collection(db, "categories"));
//         const data = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setCategories(data);
//       } catch (err) {
//         console.error("Error fetching categories:", err);
//       }
//     };

//     fetchCategories();
//   }, []);

//   const handleSearch = (e) => {
//     if (e.key === "Enter" && search.trim()) {
//       router.push(`/search?query=${encodeURIComponent(search.trim())}`);
//       setSearch("");
//     }
//   };
//   const cartCount = cart?.length || 0;

//   return (
//     <header className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-lg border-b border-gray-200">
//       <div className="max-w-7xl mx-auto px-6">
//         {/* Top Row */}
//         <div className="flex items-center justify-between py-3">
//           {/* Logo */}
//           <Link
//             href="/"
//             className="text-2xl font-bold tracking-tight text-gray-900 hover:text-blue-600 transition"
//           >
//             WelcomeShopping
//           </Link>

//           {/* Search Bar (desktop only) */}
//           <div className="hidden md:flex flex-1 mx-8">
//             <input
//               type="text"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               onKeyDown={handleSearch}
//               placeholder="Search for products, brands and more"
//               className="w-full px-4 py-2 rounded-full bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
//             />
//           </div>

//           {/* Right Actions */}
//           <div className="flex items-center gap-5">
//             <AccountDropdown />

//             {/* Cart */}
//             <Link
//               href="/cart"
//               className="relative flex items-center text-gray-700 hover:text-blue-600 transition"
//             >
//               <ShoppingCart className="w-6 h-6" />
//               {cartCount > 0 && (
//                 <span className="absolute -top-2 -right-3 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full shadow">
//                   {cartCount}
//                 </span>
//               )}
//             </Link>
//           </div>
//         </div>

//         {/* Search Bar (mobile only) */}
//         <div className="md:hidden pb-3">
//           <input
//             type="text"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             onKeyDown={handleSearch}
//             placeholder="Search for products, brands and more"
//             className="w-full px-4 py-2 rounded-full bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
//           />
//         </div>

//         {/* Category Nav */}
//         <div className="flex justify-center space-x-8 overflow-x-auto scrollbar-hide py-2">
//           {categories.slice(0, 5).map((cat) => (
//             <Link
//               key={cat.id}
//               href={`/category/${encodeURIComponent(cat.id)}`}
//               className="relative text-sm font-medium text-gray-700 hover:text-blue-600 transition group"
//             >
//               {cat.name || cat.id}
//               {/* underline animation */}
//               <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </header>
//   );
// }

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { db } from "@/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";

import AccountDropdown from "../app/profile/AccountDropdown";

export default function Navbar() {
  const { user } = useAuth();
  const { cart } = useCart();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);

  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snapshot = await getDocs(collection(db, "categories"));
        const data = snapshot.docs.map((doc) => ({
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
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Row */}
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-gray-900 hover:text-blue-600 transition"
          >
            WelcomeShopping
          </Link>

          {/* Search Bar (desktop only) */}
          <div className="hidden md:flex flex-1 mx-8">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search for products, brands and more"
              className="w-full px-4 py-2 rounded-full bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-5">
            <AccountDropdown />

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center text-gray-700 hover:text-blue-600 transition"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full shadow">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search Bar (mobile only) */}
        <div className="md:hidden pb-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search for products, brands and more"
            className="w-full px-4 py-2 rounded-full bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
          />
        </div>

        {/* Category Nav */}
        <div className="flex justify-center space-x-8 overflow-x-auto scrollbar-hide py-2">
          {categories.slice(0, 8).map((cat) => (
            <motion.div
              key={cat.id}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href={`/category/${encodeURIComponent(cat.id)}`}
                className="relative text-sm font-medium text-gray-700 hover:text-blue-600 transition group"
              >
                {cat.name || cat.id}
                {/* underline animation */}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.header>
  );
}