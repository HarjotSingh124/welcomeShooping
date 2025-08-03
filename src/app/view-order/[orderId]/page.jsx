

// 'use client';
// import { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation';
// import { useAuth } from '@/context/AuthContext'; // <-- Get user from AuthContext
// import { db } from '@/firebase/config';
// import { doc, getDoc } from 'firebase/firestore';
// import Image from 'next/image';
// import Link from 'next/link';

// export default function ViewOrderPage() {
//   const { user } = useAuth(); // <-- Get user here
//   const { orderId } = useParams();
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOrder = async () => {
//       if (!orderId || !user) return; // <-- Ensure both are present

//       try {
//         const orderRef = doc(db, 'orders', user.uid, 'userOrders', orderId);
//         const docSnap = await getDoc(orderRef);

//         if (docSnap.exists()) {
//           setOrder(docSnap.data());
//         } else {
//           console.error('Order not found');
//         }
//       } catch (error) {
//         console.error('Error fetching order:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrder();
//   }, [orderId, user]);

//   if (loading) return <div className="text-center mt-10">Loading Order Details...</div>;
//   if (!order) return <div className="text-center mt-10 text-red-500">Order not found.</div>;

//   return (
//     <div className="max-w-4xl mx-auto mt-6 p-4 bg-white shadow rounded">
//       <h1 className="text-2xl font-bold mb-4 text-[#BEB9B1]">Order Details</h1>

//       {/* Order Summary */}
//       <div className="border p-4 rounded mb-6">
//         <p><span className="font-semibold">Order ID:</span> {orderId}</p>
//         <p><span className="font-semibold">Total Amount:</span> ₹{order.totalAmount}</p>
//         <p><span className="font-semibold">Status:</span> {order.status}</p>
//       </div>

//       {/* Ordered Items */}
//       <h2 className="text-xl font-semibold mb-4">Items in this Order</h2>
//       {order?.items?.length > 0 ? (
//         <div className="space-y-4">
//           {order.items.map((item, index) => (
//             <div key={index} className="flex items-center border p-4 rounded shadow-sm">
//               <Image
//                 src={item.image || '/placeholder.png'}
//                 alt={item.title}
//                 width={100}
//                 height={100}
//                 className="object-contain rounded mr-4"
//               />
//               <div className="flex-1">
//                 <h3 className="font-medium text-lg">{item.title}</h3>
//                 <p className="text-sm text-gray-600">Quantity: {item.quantity || 'N/A'}</p>

//                 <p className="text-green-600 font-semibold">₹{item.price}</p>
//               </div>
//               <div className="text-sm text-[#BEB9B1]">{order.status === 'pending' ? 'Order Placed' : 'Delivered'}</div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p>No items found in this order.</p>
//       )}

//       {/* Back to Orders Button */}
//       <div className="mt-6 text-center">
//         <Link href="/my-order">
//           <button className="px-6 py-2 bg-[#BEB9B1] text-white rounded hover:bg-opacity-90">Back to My Orders</button>
//         </Link>
//       </div>
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';

export default function ViewOrderPage() {
  const { user } = useAuth();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId || !user) return;

      try {
        const orderRef = doc(db, 'orders', user.uid, 'userOrders', orderId);
        const docSnap = await getDoc(orderRef);

        if (docSnap.exists()) {
          setOrder(docSnap.data());
        } else {
          console.error('Order not found');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, user]);

  if (loading) return <div className="text-center mt-10">Loading Order Details...</div>;
  if (!order) return <div className="text-center mt-10 text-red-500">Order not found.</div>;

  return (
    <div className="max-w-4xl mx-auto mt-6 p-4 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4 text-[#BEB9B1]">Order Details</h1>

      <div className="border p-4 rounded mb-6">
        <p><span className="font-semibold">Order ID:</span> {orderId}</p>
        <p><span className="font-semibold">Total Amount:</span> ₹{order.totalAmount}</p>
        <p><span className="font-semibold">Status:</span> {order.status}</p>
      </div>

      {/* Progress Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className={`flex-1 h-2 rounded bg-green-500 ${order.status === 'pending' ? 'w-1/3' : order.status === 'shipped' ? 'w-2/3' : 'w-full'}`}></div>
      </div>

      {/* Address */}
    {order.items[0]?.address && (
  <div className="mb-6">
    <h2 className="text-lg font-semibold mb-2">Delivery Address</h2>
    <div className="border p-3 rounded text-sm space-y-1">
      <div><span className="font-medium">Name:</span> {order.items[0].address.name}</div>
      <div><span className="font-medium">Phone:</span> {order.items[0].address.phone}</div>
      <div><span className="font-medium">Address:</span> {order.items[0].address.address}</div>
      <div><span className="font-medium">City:</span> {order.items[0].address.city}</div>
      <div><span className="font-medium">State:</span> {order.items[0].address.state}</div>
      <div><span className="font-medium">Pincode:</span> {order.items[0].address.pincode}</div>
    </div>
  </div>
)}

      {/* Ordered Items */}
      <h2 className="text-xl font-semibold mb-4">Items in this Order</h2>
      {order?.items?.length > 0 ? (
        <div className="space-y-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center border p-4 rounded shadow-sm">
              <Image
                src={item.image || '/placeholder.png'}
                alt={item.title}
                width={100}
                height={100}
                className="object-contain rounded mr-4"
              />
              <div className="flex-1">
                <h3 className="font-medium text-lg">{item.title}</h3>
                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                <p className="text-green-600 font-semibold">₹{item.price}</p>
              </div>
              <div className="text-sm text-[#BEB9B1]">{order.status === 'pending' ? 'Order Placed' : 'Delivered'}</div>
            </div>
          ))}
        </div>
      ) : (
        <p>No items found in this order.</p>
      )}

      <div className="mt-6 text-center">
        <Link href="/my-order">
          <button className="px-6 py-2 bg-[#BEB9B1] text-white rounded hover:bg-opacity-90">Back to My Orders</button>
        </Link>
      </div>
    </div>
  );
}