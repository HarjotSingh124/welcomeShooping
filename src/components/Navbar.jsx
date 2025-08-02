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
//       <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-2 sm:gap-4">
        
//         {/* Logo */}
//         <Link href="/" className="text-xl font-bold text-white tracking-tight">
//           WelcomeShopping
//         </Link>

//         {/* Search bar */}
//         <div className="flex-1 w-full sm:w-auto sm:flex-1 sm:mx-6 mt-2 sm:mt-0">
//           <input
//             type="text"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             onKeyDown={handleSearch}
//             placeholder="Search products..."
//             className="w-full px-4 py-2 rounded bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />  
//         </div>

//         {/* Right actions */}
//         <div className="flex items-center gap-4 mt-2 sm:mt-0">
//           {user ? (
//             <>
//               <span className="text-sm text-white hidden sm:inline">
//                 Hi, {user.displayName || "Welcome"}
//               </span>
//               <button
//                 onClick={logout}
//                 className="flex items-center text-sm text-white hover:text-red-600"
//               >
//                 <LogOut className="w-4 h-4 mr-1" />
//                 Logout
//               </button>
//             </>
//           ) : (
//             <button
//               onClick={() => router.push("/login")}
//               className="flex items-center text-sm text-white hover:text-blue-600"
//             >
//               <LogIn className="w-4 h-4 mr-1" />
//               Login
//             </button>
//           )}

//           {/* Cart */}
//           <Link href="/cart" className="relative flex items-center text-white hover:text-blue-600">
//             <ShoppingCart className="w-5 h-5" />
//             <span className="ml-1 hidden sm:inline">Cart</span>
//             {cartCount > 0 && (
//               <span className="absolute -top-2 -right-3 bg-yellow-400 text-white text-xs px-1 rounded-full">
//                 {cartCount}
//               </span>
//             )}
//           </Link>
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
import { ShoppingCart, LogIn, LogOut } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim()) {
      router.push(`/search?query=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  const cartCount = cart?.length || 0;

  return (
    <header className="bg-[#BEB9B1] shadow sticky top-0 z-50">
<<<<<<< HEAD
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-2 sm:gap-4">
        
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-white tracking-tight">
          WelcomeShopping
        </Link>

        {/* Search bar */}
        <div className="flex-1 w-full sm:w-auto sm:flex-1 sm:mx-6 mt-2 sm:mt-0">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search products..."
            className="w-full px-4 py-2 rounded bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />  
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          {user ? (
            <>
              <span className="text-sm text-white hidden sm:inline">
                Hi, {user.displayName || "Welcome"}
              </span>
              <button
                onClick={logout}
                className="flex items-center text-sm text-white hover:text-red-600"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </button>
            </>
=======
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
>>>>>>> 03b2566 (Updated pages and added admin orders panel)
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="flex items-center text-black text-sm hover:text-blue-600"
            >
              <LogIn className="w-5 h-5 mr-1" />
              Login
            </button>
          )}

<<<<<<< HEAD
          {/* Cart */}
          <Link href="/cart" className="relative flex items-center text-white hover:text-blue-600">
            <ShoppingCart className="w-5 h-5" />
            <span className="ml-1 hidden sm:inline">Cart</span>
=======
          <Link href="/cart" className="relative text-black hover:text-blue-600">
            <ShoppingCart className="w-6 h-6" />
>>>>>>> 03b2566 (Updated pages and added admin orders panel)
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
    </header>
  );
}










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
//    const [search, setSearch] = useState("");

//   const handleSearch = (e) => {
//     if (e.key === "Enter" && search.trim()) {
//       router.push(`/search?query=${encodeURIComponent(search.trim())}`);
//       setSearch("");
//     }
//   };

//   const cartCount = cart?.length || 0;

//   return (
//     <header className="bg-[#BEB9B1] shadow sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
//         {/* Logo */}
//         <Link href="/" className="text-xl font-bold text-white tracking-tight">
//           WelcomeShopping
//         </Link>

//         {/* Search bar */}
//         <div className="flex-1 mx-6">
//           <input
//             type="text"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             onKeyDown={handleSearch}
//             placeholder="Search products..."
//             className="w-full px-4 py-2 rounded bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />  
//         </div>

//         {/* Right actions */}
//         <div className="flex items-center gap-6">
//           {user ? (
//             <>
//               <span className="text-sm text-white">Hi, {user.displayName || "Welcome"}</span>
//               <button
//                 onClick={logout}
//                 className="flex items-center text-sm text-white hover:text-red-600"
//               >
//                 <LogOut className="w-4 h-4 mr-1" />
//                 Logout
//               </button>
//             </>
//           ) : (
//             <button
//               onClick={() => router.push("/login")}
//               className="flex items-center text-sm text-white hover:text-blue-600"
//             >
//               <LogIn className="w-4 h-4 mr-1" />
//               Login
//             </button>
//           )}

//           {/* Cart */}
//           <Link href="/cart" className="relative flex items-center text-white hover:text-blue-600">
//             <ShoppingCart className="w-5 h-5" />
//             <span className="ml-1">Cart</span>
//             {cartCount > 0 && (
//               <span className="absolute -top-2 -right-3 bg-yellow-400 text-white text-xs px-1 rounded-full">
//                 {cartCount}
//               </span>
//             )}
//           </Link>
//         </div>
//       </div>
//     </header>
//   );
// }
