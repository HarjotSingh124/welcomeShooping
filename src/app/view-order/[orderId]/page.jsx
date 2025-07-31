// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation';
// import { db } from '@/firebase/config';
// import { doc, getDoc } from 'firebase/firestore';
// import { useAuth } from '@/context/AuthContext';

// export default function OrderDetailPage() {
//   const { user } = useAuth();
//   const params = useParams(); // <- useParams hook
//   const orderId = params?.orderId;

//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOrder = async () => {
//       if (!user || !orderId) return;

//       try {
//         const orderRef = doc(db, 'orders', user.uid, 'userOrders', orderId);
//         const orderSnap = await getDoc(orderRef);

//         if (orderSnap.exists()) {
//           setOrder(orderSnap.data());
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
//   }, [user, orderId]);

//   if (loading) return <div>Loading Order Details...</div>;
//   if (!order) return <div>Order not found.</div>;

//   const product = order.products[0]; // Assuming single product orders for now.

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-4">Order Details</h1>

//       <div className="bg-white shadow rounded p-4 flex">
//         <img src={product.image} alt={product.title} className="w-32 h-32 object-contain border rounded" />
//         <div className="ml-6 flex-1">
//           <h2 className="text-xl font-semibold">{product.title}</h2>
//           <p className="text-gray-600 mb-2">Color: {product.color || 'N/A'} {product.size && `| Size: ${product.size}`}</p>
//           <p className="text-lg font-bold">₹{product.price}</p>
//           <p className="text-sm text-green-600 mt-1">
//             {order.status === 'pending' ? 'Order Placed' : `Delivered on ${order.deliveryDate || 'N/A'}`}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase/config';
import { doc, getDoc } from 'firebase/firestore';   

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.orderId;
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user || !orderId) return;

      try {
        const orderRef = doc(db, 'orders', user.uid, 'userOrders', orderId);
        const orderSnap = await getDoc(orderRef);

        if (orderSnap.exists()) {
          setOrder(orderSnap.data());
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
  }, [user, orderId]);

  if (loading) return <div>Loading...</div>;
  if (!order) return <div>Order not found.</div>;

  return (
    <div>
      <h1>{order.items[0].title}</h1>
      <p>Price: ₹{order.items[0].price}</p>
      <p>Description: {order.items[0].description}</p>
      {/* Add rest of the UI like delivery details, status etc */}
    </div>
  );
}