
// "use client";

// import { useEffect, useState } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { db } from '@/firebase/config';
// import { collection, getDocs, query, orderBy } from 'firebase/firestore';
// import Link from 'next/link';
// import { format } from 'date-fns';

// export default function MyOrdersPage() {
//   const { user } = useAuth();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       if (!user) return;

//       try {
//         const userOrdersRef = collection(db, 'orders', user.uid, 'userOrders');
//         const q = query(userOrdersRef, orderBy('createdAt', 'desc'));
//         const snapshot = await getDocs(q);

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
//     <div className="min-h-screen bg-gray-100 py-8">
//       <div className="max-w-5xl mx-auto px-4">
//         <h1 className="text-2xl font-bold mb-6">My Orders</h1>

//         {loading ? (
//           <div className="text-center">Loading your orders...</div>
//         ) : orders.length === 0 ? (
//           <div className="text-center text-gray-600">You have no orders yet.</div>
//         ) : (
//           <div className="space-y-6">
//             {orders.map(order => (
//               <div key={order.id} className="bg-white rounded shadow p-4">
//                 <div className="flex justify-between items-center mb-2">
//                   <div className="text-sm text-gray-500">Order ID: {order.id}</div>
//                   <div className="text-sm text-green-600">{order.status === 'pending' ? 'Order Placed' : order.status}</div>
//                 </div>

//                 <div className="flex gap-4 items-center">
//                   <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded overflow-hidden">
//                     <img src={order.items?.[0]?.image || '/placeholder.png'} alt={order.items?.[0]?.title} className="object-contain w-full h-full" />
//                   </div>

//                   <div className="flex-1">
//                     <div className="font-semibold">{order.items?.[0]?.title}</div>
//                     <div className="text-sm text-gray-600">Ordered On: {format(new Date(order.createdAt.seconds * 1000), 'dd MMM yyyy')}</div>
//                     <div className="text-sm font-medium mt-1">Total: ₹{order.totalAmount}</div>
//                   </div>

//                   <Link href={`/view-order/${order.id}`}>
//                     <button className="text-blue-600 text-sm underline">View Details</button>
//                   </Link>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import Link from 'next/link';
import { format } from 'date-fns';

export default function MyOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const userOrdersRef = collection(db, 'orders', user.uid, 'userOrders');
        const q = query(userOrdersRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);

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
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        {loading ? (
          <div className="text-center">Loading your orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-600">You have no orders yet.</div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded shadow p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm text-gray-500">Order ID: {order.id}</div>
                  <div className="text-sm text-green-600">{order.status === 'pending' ? 'Order Placed' : order.status}</div>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded overflow-hidden">
                    <img src={order.items?.[0]?.image || '/placeholder.png'} alt={order.items?.[0]?.title} className="object-contain w-full h-full" />
                  </div>

                  <div className="flex-1">
                    <div className="font-semibold">{order.items?.[0]?.title}</div>
                    <div className="text-sm text-gray-600">Ordered On: {format(new Date(order.createdAt.seconds * 1000), 'dd MMM yyyy')}</div>
                    <div className="text-sm font-medium mt-1">Total: ₹{order.totalAmount}</div>
                  </div>

                  <Link href={`/view-order/${order.id}`}>
                    <button className="text-blue-600 text-sm underline">View Details</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}