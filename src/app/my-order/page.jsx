

// 'use client';

// import { useEffect, useState } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { db } from '@/firebase/config';
// import { collection, getDocs } from 'firebase/firestore';
// import Link from 'next/link';

// export default function MyOrdersPage() {
//   const { user } = useAuth();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       if (!user) return;

//       try {
//         const userOrdersRef = collection(db, 'orders', user.uid, 'userOrders');
//         const snapshot = await getDocs(userOrdersRef);

//         const ordersList = snapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         }));

//         setOrders(ordersList);
//       } catch (error) {
//         console.error('Error fetching orders:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, [user]);

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <div className="max-w-6xl mx-auto flex">
//         {/* Sidebar Filters */}
//         <div className="w-1/4 bg-white p-4 rounded shadow-sm mt-6">
//           <h2 className="font-semibold mb-4">Filters</h2>
//           <div className="mb-4">
//             <h3 className="font-medium mb-2">ORDER STATUS</h3>
//             <div className="space-y-2 text-sm">
//               <label className="block"><input type="checkbox" /> On the way</label>
//               <label className="block"><input type="checkbox" /> Delivered</label>
//               <label className="block"><input type="checkbox" /> Cancelled</label>
//               <label className="block"><input type="checkbox" /> Returned</label>
//             </div>
//           </div>
//           <div>
//             <h3 className="font-medium mb-2">ORDER TIME</h3>
//             <div className="space-y-2 text-sm">
//               <label className="block"><input type="checkbox" /> Last 30 days</label>
//               <label className="block"><input type="checkbox" /> 2024</label>
//               <label className="block"><input type="checkbox" /> 2023</label>
//               <label className="block"><input type="checkbox" /> 2022</label>
//               <label className="block"><input type="checkbox" /> Older</label>
//             </div>
//           </div>
//         </div>

//         {/* Orders Section */}
//         <div className="w-3/4 p-6">
//           <div className="flex justify-between mb-6">
//             <h1 className="text-2xl font-bold">My Orders</h1>
//             <input type="text" placeholder="Search your orders here" className="border px-4 py-2 rounded w-1/2" />
//           </div>

//           {loading ? (
//             <div>Loading orders...</div>
//           ) : orders.length === 0 ? (
//             <div>No orders found.</div>
//           ) : (
//             <div className="space-y-4">
//               {orders.map(order => (
//                 <div key={order.id} className="bg-white rounded shadow-sm p-4 flex items-center">
//                   <div className="w-24 h-24 bg-gray-200 rounded overflow-hidden flex items-center justify-center">
//                     {/* Placeholder Image */}
//                     <img src={order.image || '/placeholder.png'} alt={order.productTitle} className="object-contain h-full" />
//                   </div>
//                   <div className="ml-4 flex-1">
//                     <div className="font-medium text-lg">{order.productTitle}</div>
//                     <div className="text-sm text-gray-600">Color: {order.color || 'N/A'} {order.size && `| Size: ${order.size}`}</div>
//                     <div className="text-xl font-semibold mt-2">₹{order.totalAmount}</div>
//                     <div className="text-sm text-green-600 mt-1">
//                       {order.status === 'pending' ? 'Your order has been placed.' : `Delivered on ${order.deliveryDate || 'N/A'}`}
//                     </div>
//                     <div className="mt-2">
//                   <Link href={`/view-order/${order.id}`}>
//                        <button className="text-blue-600 underline">View Details</button>
//           </Link>
//                       {order.status === 'delivered' && (
//                         <button className="ml-4 text-blue-600 text-sm underline">Rate & Review Product</button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase/config';
import { collection, getDocs, or } from 'firebase/firestore';
import Link from 'next/link';

export default function MyOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const userOrdersRef = collection(db, 'orders', user.uid, 'userOrders');
        const snapshot = await getDocs(userOrdersRef);

        const ordersList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(ordersList);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto flex">
        {/* Sidebar Filters */}
        <div className="w-1/4 bg-white p-4 rounded shadow-sm mt-6">
          <h2 className="font-semibold mb-4">Filters</h2>
          <div className="mb-4">
            <h3 className="font-medium mb-2">ORDER STATUS</h3>
            <div className="space-y-2 text-sm">
              <label className="block"><input type="checkbox" /> On the way</label>
              <label className="block"><input type="checkbox" /> Delivered</label>
              <label className="block"><input type="checkbox" /> Cancelled</label>
              <label className="block"><input type="checkbox" /> Returned</label>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="w-3/4 p-6">
          <div className="flex justify-between mb-6">
            <h1 className="text-2xl font-bold">My Orders</h1>
            <input type="text" placeholder="Search your orders here" className="border px-4 py-2 rounded w-1/2" />
          </div>

          {loading ? (
            <div>Loading orders...</div>
          ) : orders.length === 0 ? (
            <div>No orders found.</div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="bg-white rounded shadow-sm p-4 flex items-center">
                  <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                    <img
                      src={order.products?.[0]?.image || '/placeholder.png'}
                      alt={order.products?.[0]?.title || 'Product Image'}
                      className="object-contain h-full"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="font-medium text-lg">{order.products?.[0]?.title || 'Product Title'}</div>
                    <div className="text-sm text-gray-600">
                      {order.products?.[0]?.color && `Color: ${order.products[0].color}`} 
                      {order.products?.[0]?.size && ` | Size: ${order.products[0].size}`}
                    </div>
                    <div className="text-xl font-semibold mt-2">₹{order.totalAmount}</div>
                    <div className={`text-sm mt-1 ${order.status === 'delivered' ? 'text-green-600' : 'text-orange-600'}`}>
                      {order.status === 'pending' ? 'Your order has been placed.' :
                        order.status === 'delivered' ? `Delivered on ${order.deliveryDate || 'N/A'}` :
                        order.status}
                    </div>
                    <div className="mt-2">
                      <Link href={`/view-order/${order.id}`}>
                        <button className="text-blue-600 underline">View Details</button>
                      </Link>
                      {order.status === 'delivered' && (
                        <button className="ml-4 text-blue-600 text-sm underline">Rate & Review Product</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}