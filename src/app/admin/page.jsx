// "use client";
// import Link from "next/link";
// import { useAuth } from "@/context/AuthContext";
// import { redirect } from "next/navigation";




// export default function AdminDashboard() {

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <Link href="/admin/category" className="bg-white p-6 shadow rounded hover:shadow-md transition">
//           <h2 className="text-lg font-semibold">🛍 Manage Products</h2>
//         </Link>

//         <Link href="/admin/orders" className="bg-white p-6 shadow rounded hover:shadow-md transition">
//           <h2 className="text-lg font-semibold">📦 View Orders</h2>
//         </Link>
//         <Link href="/admin/add-product" className="bg-white p-6 shadow rounded hover:shadow-md transition">
//   <h2 className="text-lg font-semibold">➕ Add Product</h2>
// </Link>
//   <Link href="/admin/homepage-sections" className="bg-white p-6 shadow rounded hover:shadow-md transition">
//   <h2 className="text-lg font-semibold">Homepgae-section</h2>
// </Link>
//       </div>
//     </div>
//   );
// }
  

"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function AdminDashboard() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!user || user.email !== "shoppingwelcome17@gmail.com") {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
        <p className="mt-2">You are not authorized to view this page.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/category"
          className="bg-white p-6 shadow rounded hover:shadow-md transition"
        >
          <h2 className="text-lg font-semibold">🛍 Manage Products</h2>
        </Link>

        <Link
          href="/admin/orders"
          className="bg-white p-6 shadow rounded hover:shadow-md transition"
        >
          <h2 className="text-lg font-semibold">📦 View Orders</h2>
        </Link>

        <Link
          href="/admin/add-product"
          className="bg-white p-6 shadow rounded hover:shadow-md transition"
        >
          <h2 className="text-lg font-semibold">➕ Add Product</h2>
        </Link>

        <Link
          href="/admin/homepage-sections"
          className="bg-white p-6 shadow rounded hover:shadow-md transition"
        >
          <h2 className="text-lg font-semibold">Homepage Section</h2>
        </Link>
      </div>
    </div>
  );
}