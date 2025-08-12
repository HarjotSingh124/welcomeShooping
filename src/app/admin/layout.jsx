// "use client";

// import { useEffect, useState } from "react";
// import {
//   Home,
//   Package,
//   Layers,
//   Users,
//   Settings,
//   LogOut,
//   BarChart3,
//   RefreshCw,
// } from "lucide-react";
// import { db } from "@/firebase/config";
// import {
//   collection,
//   collectionGroup,
//   getDocs,
//   query,
//   orderBy,
//   limit,
//   where,
// } from "firebase/firestore";

// /**
//  * AdminDashboard (live)
//  * - Shows analytics pulled from Firestore
//  * - Recent orders pulled from collectionGroup 'userOrders'
//  *
//  * Requirements:
//  * - Exported Firestore `db` from "@/firebase/config"
//  * - Firestore collections:
//  *    - categories/{categoryId}/products (or any collection group 'products')
//  *    - (user) orders stored under a subcollection 'userOrders' (we query collectionGroup)
//  *    - optional 'users' top-level collection for user count
//  *
//  * Adjust collection names / fields if your DB differs.
//  */

// export default function AdminDashboard() {
//   const [collapsed, setCollapsed] = useState(false);

//   // analytics state
//   const [loadingStats, setLoadingStats] = useState(true);
//   const [ordersCount, setOrdersCount] = useState(0);
//   const [totalRevenue, setTotalRevenue] = useState(0);
//   const [activeProductsCount, setActiveProductsCount] = useState(0);
//   const [usersCount, setUsersCount] = useState(0);

//   // recent orders
//   const [recentOrders, setRecentOrders] = useState([]);
//   const [loadingOrders, setLoadingOrders] = useState(true);

//   const menuItems = [
//     { label: "Dashboard", icon: <Home size={18} />, href: "/admin" },
//     { label: "Categories", icon: <Layers size={18} />, href: "/admin/category" },
//     { label: "Products", icon: <Package size={18} />, href: "/admin/products" },
//     { label: "Users", icon: <Users size={18} />, href: "/admin/users" },
//     { label: "Reports", icon: <BarChart3 size={18} />, href: "/admin/reports" },
//     { label: "Settings", icon: <Settings size={18} />, href: "/admin/settings" },
//   ];

//   const formatCurrency = (n) => {
//     if (isNaN(Number(n))) return "₹0";
//     return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(n));
//   };

//   const fetchAnalytics = async () => {
//     setLoadingStats(true);
//     try {
//       // 1) Orders (collectionGroup 'userOrders')
//       const ordersSnap = await getDocs(collectionGroup(db, "userOrders"));
//       const orders = ordersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

//       setOrdersCount(orders.length);

//       // sum revenue - be defensive if field missing
//       const revenue = orders.reduce((acc, o) => {
//         const amt = Number(o.totalAmount ?? o.total ?? 0);
//         return acc + (isNaN(amt) ? 0 : amt);
//       }, 0);
//       setTotalRevenue(revenue);

//       // 2) Active products count (collectionGroup 'products' where status === 'active')
//       const productsSnap = await getDocs(collectionGroup(db, "products"));
//       const prods = productsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       const activeCount = prods.filter((p) => p.status === "active").length;
//       setActiveProductsCount(activeCount);

//       // 3) Users count - try top-level 'users' collection
//       try {
//         const usersSnap = await getDocs(collection(db, "users"));
//         setUsersCount(usersSnap.size);
//       } catch (err) {
//         // If users collection doesn't exist, try a fallback: count distinct userIds from orders
//         const uniqueUserIds = new Set(orders.map((o) => o.userId).filter(Boolean));
//         setUsersCount(uniqueUserIds.size);
//       }
//     } catch (err) {
//       console.error("Error fetching analytics:", err);
//     } finally {
//       setLoadingStats(false);
//     }
//   };

//   const fetchRecentOrders = async () => {
//     setLoadingOrders(true);
//     try {
//       // Firestore doesn't support ordering across collectionGroup unless indexed;
//       // we'll fetch userOrders collectionGroup and sort client-side by createdAt if possible.
//       const snap = await getDocs(collectionGroup(db, "userOrders"));
//       let orders = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

//       // try to use createdAt timestamp; if serverTimestamp used, convert defensively
//       orders = orders
//         .map((o) => {
//           let created = null;
//           if (o.createdAt?.toMillis) created = o.createdAt.toMillis();
//           else if (o.createdAt?.seconds) created = o.createdAt.seconds * 1000;
//           else created = 0;
//           return { ...o, __createdAt: created };
//         })
//         .sort((a, b) => b.__createdAt - a.__createdAt)
//         .slice(0, 8);

//       setRecentOrders(orders);
//     } catch (err) {
//       console.error("Error fetching recent orders:", err);
//     } finally {
//       setLoadingOrders(false);
//     }
//   };

//   useEffect(() => {
//     // initial load
//     fetchAnalytics();
//     fetchRecentOrders();
//   }, []);

//   // manual refresh
//   const handleRefresh = async () => {
//     await Promise.all([fetchAnalytics(), fetchRecentOrders()]);
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside
//         className={`bg-white shadow-md h-screen p-4 flex flex-col justify-between transition-all duration-300 ${
//           collapsed ? "w-16" : "w-64"
//         }`}
//       >
//         <div>
//           <div className="flex items-center justify-between mb-6">
//             {!collapsed && <span className="text-xl font-bold">WelcomeAdmin</span>}
//             <button
//               onClick={() => setCollapsed(!collapsed)}
//               className="text-gray-500 p-1 rounded hover:bg-gray-100"
//               aria-label="Toggle sidebar"
//             >
//               {collapsed ? "»" : "«"}
//             </button>
//           </div>

//           <nav className="space-y-2">
//             {menuItems.map((item) => (
//               <a
//                 key={item.label}
//                 href={item.href}
//                 className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100"
//               >
//                 <div className="text-gray-700">{item.icon}</div>
//                 {!collapsed && <span className="text-sm">{item.label}</span>}
//               </a>
//             ))}
//           </nav>
//         </div>

//         <div>
//           <button className="flex items-center gap-2 p-2 rounded-md hover:bg-red-50 text-red-600 w-full">
//             <LogOut size={16} />
//             {!collapsed && <span>Logout</span>}
//           </button>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold">Dashboard</h1>

//           <div className="flex items-center gap-3">
//             <button
//               onClick={handleRefresh}
//               className="flex items-center gap-2 bg-white px-3 py-1 rounded shadow-sm hover:shadow"
//               title="Refresh data"
//             >
//               <RefreshCw size={16} />
//               <span className="text-sm">Refresh</span>
//             </button>
//           </div>
//         </div>

//         {/* Analytics cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//           <div className="p-4 rounded-lg shadow bg-white">
//             <div className="text-sm text-gray-500">Total Orders</div>
//             <div className="text-2xl font-bold mt-1">
//               {loadingStats ? "…" : ordersCount}
//             </div>
//           </div>

//           <div className="p-4 rounded-lg shadow bg-white">
//             <div className="text-sm text-gray-500">Revenue</div>
//             <div className="text-2xl font-bold mt-1">
//               {loadingStats ? "…" : formatCurrency(totalRevenue)}
//             </div>
//           </div>

//           <div className="p-4 rounded-lg shadow bg-white">
//             <div className="text-sm text-gray-500">Active Products</div>
//             <div className="text-2xl font-bold mt-1">
//               {loadingStats ? "…" : activeProductsCount}
//             </div>
//           </div>

//           <div className="p-4 rounded-lg shadow bg-white">
//             <div className="text-sm text-gray-500">Users</div>
//             <div className="text-2xl font-bold mt-1">
//               {loadingStats ? "…" : usersCount}
//             </div>
//           </div>
//         </div>

//         {/* Recent Orders */}
//         <div className="bg-white rounded-lg shadow p-4">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-semibold">Recent Orders</h2>
//             <div className="text-sm text-gray-500">{loadingOrders ? "Loading…" : `${recentOrders.length} shown`}</div>
//           </div>

//           {loadingOrders ? (
//             <div className="space-y-3">
//               <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
//               <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
//               <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
//             </div>
//           ) : recentOrders.length === 0 ? (
//             <div className="text-center text-gray-500 py-10">No recent orders</div>
//           ) : (
//             <div className="overflow-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="text-left border-b">
//                     <th className="p-2">Order ID</th>
//                     <th className="p-2">Customer</th>
//                     <th className="p-2">Amount</th>
//                     <th className="p-2">Status</th>
//                     <th className="p-2">Date</th>
//                     <th className="p-2">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {recentOrders.map((ord) => {
//                     const createdAt = ord.createdAt
//                       ? ord.createdAt.toDate
//                         ? ord.createdAt.toDate()
//                         : new Date(ord.createdAt.seconds * 1000)
//                       : null;
//                     return (
//                       <tr key={ord.id} className="hover:bg-gray-50">
//                         <td className="p-2 align-top">{ord.id}</td>
//                         <td className="p-2 align-top">
//                           <div className="font-medium">{ord.customerName || ord.userName || ord.userEmail || ord.userId || "—"}</div>
//                           <div className="text-xs text-gray-500">{ord.userId ? `UID: ${ord.userId}` : ""}</div>
//                         </td>
//                         <td className="p-2 align-top">{formatCurrency(ord.totalAmount ?? ord.total ?? 0)}</td>
//                         <td className="p-2 align-top">
//                           <span
//                             className={`px-2 py-1 rounded text-xs ${
//                               ord.status === "delivered"
//                                 ? "bg-green-100 text-green-800"
//                                 : ord.status === "shipped"
//                                 ? "bg-blue-100 text-blue-800"
//                                 : ord.status === "pending"
//                                 ? "bg-yellow-100 text-yellow-800"
//                                 : "bg-gray-100 text-gray-700"
//                             }`}
//                           >
//                             {ord.status ?? "unknown"}
//                           </span>
//                         </td>
//                         <td className="p-2 align-top">{createdAt ? createdAt.toLocaleString() : "—"}</td>
//                         <td className="p-2 align-top">
//                           <a
//                             href={`/admin/order/${ord.id}`}
//                             className="text-blue-600 hover:underline text-sm"
//                           >
//                             View
//                           </a>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }
// src/pages/admin/index.jsx
import AdminSidebar from "@/components/admin/AdminSidebar";


export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 ml-64 p-6">{children}</main>
    </div>
  );
}