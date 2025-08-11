

// 'use client';

// import { useEffect, useState } from 'react';
// import { db } from '@/firebase/config';
// import { collectionGroup, getDocs, doc, updateDoc } from 'firebase/firestore';
// import SkeletonLoader from "@/components/SkeletonLoader";

// export default function AdminOrdersPage() {
//   const [orders, setOrders] = useState([]);
//   const [selectedTab, setSelectedTab] = useState('pending');

//   useEffect(() => {
//     const fetchOrders = async () => {
//       const snapshot = await getDocs(collectionGroup(db, 'userOrders'));
//       const ordersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setOrders(ordersList);
//     };
//     fetchOrders();
//   }, []);

//   const handleStatusChange = async (orderId, userId, newStatus) => {
//     const orderRef = doc(db, 'orders', userId, 'userOrders', orderId);
//     await updateDoc(orderRef, { status: newStatus });
//     setOrders(prev =>
//       prev.map(order => (order.id === orderId ? { ...order, status: newStatus } : order))
//     );
//   };

//   const tabs = ['pending', 'shipped', 'delivered'];
//   const filteredOrders = orders.filter(order => order.status === selectedTab);

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-8 text-[#BEB9B1]">Admin Orders Panel</h1>

//       <div className="flex gap-4 mb-8">
//         {tabs.map(tab => (
//           <button
//             key={tab}
//             className={`px-5 py-2 rounded-full font-medium capitalize ${
//               selectedTab === tab
//                 ? 'bg-[#BEB9B1] text-white'
//                 : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
//             }`}
//             onClick={() => setSelectedTab(tab)}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {/* Orders List */}
//       {filteredOrders.length === 0 ? (
//         <div className="text-gray-500 text-center">No {selectedTab} orders found.</div>
//       ) : (
//         <div className="space-y-6">
//           {filteredOrders.map(order => (
//             <div
//               key={order.id}
//               className="bg-white border rounded-xl shadow p-6 space-y-4"
//             >
//               {/* Order Header */}
//               <div className="flex justify-between items-center">
//                 <div>
//                   <p className="font-semibold">Order ID: <span className="text-gray-600">{order.id}</span></p>
//                   <p>Total Amount: ₹{order.totalAmount}</p>
//                   <p>Status: <span className="capitalize">{order.status}</span></p>
//                 </div>
//                 <div>
//                   <select
//                     value={order.status}
//                     onChange={e => handleStatusChange(order.id, order.userId, e.target.value)}
//                     className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#BEB9B1]"
//                   >
//                     <option value="pending">Pending</option>
//                     <option value="shipped">Shipped</option>
//                     <option value="delivered">Delivered</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Order Items */}
//          {order?.items?.length > 0 && order.items.map((item, idx) => (
//   <div key={idx} className="border rounded p-4 mb-4">
//     <div className="flex items-center gap-4 mb-4">
//       <img src={item.image} alt={item.title} className="w-20 h-20 object-contain rounded" />
//       <div>
//         <h3 className="font-semibold text-lg">{item.title}</h3>
//         <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
//         <p className="text-green-600 font-semibold">₹{item.price}</p>
//       </div>
//     </div>

//     {/* Address Block */}
//     {item.address && (
//       <div className="bg-gray-100 p-3 rounded">
//         <h4 className="font-semibold mb-2">Shipping Address</h4>
//         <p><span className="font-medium">Name:</span> {item.address.name}</p>
//         <p><span className="font-medium">Phone:</span> {item.address.phone}</p>
//         <p><span className="font-medium">Address:</span> {item.address.address}, {item.address.city}, {item.address.state} - {item.address.pincode}</p>
//       </div>
//     )}
//   </div>
// ))}
//             </div>
//           ))}
//         </div>
        
//       )}
      
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { db } from '@/firebase/config';
import { collectionGroup, getDocs, doc, updateDoc } from 'firebase/firestore';
import SkeletonLoader from "@/components/SkeletonLoader";
import { useAuth } from "@/context/AuthContext";
import { redirect } from 'next/navigation';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('pending');
  const { user } = useAuth();
   if (!user || user.email !== "shoppingwelcome17@gmail.com") {
        redirect("/");
      }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const snapshot = await getDocs(collectionGroup(db, 'userOrders'));
        const ordersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(ordersList);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, userId, newStatus) => {
    const orderRef = doc(db, 'orders', userId, 'userOrders', orderId);
    await updateDoc(orderRef, { status: newStatus });
    setOrders(prev =>
      prev.map(order => (order.id === orderId ? { ...order, status: newStatus } : order))
    );
  };

  const tabs = ['pending', 'shipped', 'delivered'];
  const filteredOrders = orders.filter(order => order.status === selectedTab);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-[#BEB9B1]">Admin Orders Panel</h1>

      <div className="flex gap-4 mb-8">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`px-5 py-2 rounded-full font-medium capitalize ${
              selectedTab === tab
                ? 'bg-[#BEB9B1] text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <SkeletonLoader type="orderRow" count={3} />
      ) : filteredOrders.length === 0 ? (
        <div className="text-gray-500 text-center">No {selectedTab} orders found.</div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map(order => (
            <div
              key={order.id}
              className="bg-white border rounded-xl shadow p-6 space-y-4 transition-opacity duration-500 opacity-100"
            >
              {/* Order Header */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Order ID: <span className="text-gray-600">{order.id}</span></p>
                  <p>Total Amount: ₹{order.totalAmount}</p>
                  <p>Status: <span className="capitalize">{order.status}</span></p>
                </div>
                <div>
                  <select
                    value={order.status}
                    onChange={e => handleStatusChange(order.id, order.userId, e.target.value)}
                    className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#BEB9B1]"
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              </div>

              {/* Order Items */}
              {order?.items?.length > 0 && order.items.map((item, idx) => (
                <div key={idx} className="border rounded p-4 mb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <img src={item.image} alt={item.title} className="w-20 h-20 object-contain rounded" />
                    <div>
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-green-600 font-semibold">₹{item.price}</p>
                    </div>
                  </div>

                  {/* Address Block */}
                  {item.address && (
                    <div className="bg-gray-100 p-3 rounded">
                      <h4 className="font-semibold mb-2">Shipping Address</h4>
                      <p><span className="font-medium">Name:</span> {item.address.name}</p>
                      <p><span className="font-medium">Phone:</span> {item.address.phone}</p>
                      <p><span className="font-medium">Address:</span> {item.address.address}, {item.address.city}, {item.address.state} - {item.address.pincode}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}