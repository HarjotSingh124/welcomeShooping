"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { db } from "@/firebase/config";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import Image from "next/image";
import { clearCart, placeOrder } from "@/firebase/order";
import { openRazorpayPayment } from '@/app/utils/razorpayHandler';

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cart, loading } = useCart();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    pincode: "",
    city: "",
    state: "",
    address: "",
  });
  const [addressSaved, setAddressSaved] = useState(false);

  const productHandles = cart.map(item => item.handle);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    const fetchAddress = async () => {
      if (!user) return;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().address) {
        setAddress(docSnap.data().address);
        setAddressSaved(true);
        setStep(1);
      }
    };
    fetchAddress();
  }, [user]);

  const handleAddressSubmit = async () => {
    if (!user) return;
    const addressRef = doc(db, "users", user.uid);
    await setDoc(addressRef, { address }, { merge: true });
    setAddressSaved(true);
    setStep(1);
  };
  const handlePayNow = async () => {
  await openRazorpayPayment({
    key: 'rzp_test_zoiBCtMTQU3kPx',
    amount: total,
    user: user,
    onSuccess: async (response) => {
      console.log('Payment Success:', response);
      // 1. Save Order in Firestore
  if (user) {
        try {
          const order = await placeOrder(user.uid, cart, total,address); // <-- Save to Firestore
          console.log('Order placed:', order);

          await clearCart(user.uid);
          router.push(`/my-order`); // <-- Navigate to Success Page
        } catch (error) {
          console.error("Order placement failed:", error);
        }
      }
    },
  });
};



  if (!user) return <div className="p-6 text-center">Please login to continue.</div>;
  if (loading) return <div className="p-6 text-center">Loading your cart...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      {/* Step 0: Address Form */}
      {step === 0 && (
        <div className="space-y-6 bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold border-b pb-2">1. Delivery Address</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input className="border p-2 rounded w-full" placeholder="Full Name" value={address.name} onChange={e => setAddress({ ...address, name: e.target.value })} />
            <input className="border p-2 rounded w-full" placeholder="10-digit mobile number" value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} />
            <input className="border p-2 rounded w-full" placeholder="Pincode" value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} />
            <input className="border p-2 rounded w-full" placeholder="City" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} />
            <input className="border p-2 rounded w-full" placeholder="State" value={address.state} onChange={e => setAddress({ ...address, state: e.target.value })} />
            <textarea className="border p-2 rounded w-full sm:col-span-2" placeholder="Full Address (Street, Area, etc.)" rows={3} value={address.address} onChange={e => setAddress({ ...address, address: e.target.value })}></textarea>
          </div>
          <button onClick={handleAddressSubmit} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded">Save & Continue</button>
        </div>
      )}

      {/* Step 1: Show Saved Address + Order Summary */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold border-b pb-2">2. Delivery Address</h2>
            <div className="space-y-2">
              <p className="font-semibold">{address.name} <span className="ml-2 text-sm font-normal">{address.phone}</span></p>
              <p className="text-gray-600">{address.address}, {address.city}, {address.state} - {address.pincode}</p>
              <button onClick={() => setStep(0)} className="text-blue-600 hover:underline text-sm mt-2">Edit Address</button>
            </div>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold border-b pb-2">3. Order Summary</h2>
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-4">
                    <Image src={item.images?.[0] ||item.image || "/placeholder.png"} alt={item.title} width={80} height={80} className="rounded" />
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-gray-500">₹{item.price} × {item.quantity}</p>
                    </div>
                  </div>
                  <div className="font-bold">₹{item.price * item.quantity}</div>
                </div>
              ))}
            </div>
            <h3 className="text-right text-xl font-bold mt-4">Total: ₹{total.toFixed(2)}</h3>
            <button onClick={handlePayNow} className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded mt-4">Pay Now</button>
          </div>
        </div>
      )}
    </div>
  );
}

// 'use client';
// import { useEffect, useState } from 'react';
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth } from '@/firebase/config';
// import { placeOrder } from '@/firebase/order';
// import { useRouter } from 'next/navigation';
// import { doc, getDocs, collection, deleteDoc } from 'firebase/firestore';
// import { db } from '@/firebase/config';

// export default function CheckoutPage() {
//   const [user, setUser] = useState(null);
//   const [isRazorpayReady, setIsRazorpayReady] = useState(false);
//   const [cartItems, setCartItems] = useState([]);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const router = useRouter();

//   useEffect(() => {
//     // Load Razorpay script
//     const script = document.createElement('script');
//     script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//     script.async = true;
//     script.onload = () => setIsRazorpayReady(true);
//     document.body.appendChild(script);
//   }, []);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
//       if (firebaseUser) {
//         setUser(firebaseUser);
//         fetchCart(firebaseUser.uid);
//       } else {
//         router.push('/login');
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const fetchCart = async (userId) => {
//     const snapshot = await getDocs(collection(db, 'cart', userId, 'userCart'));
//     const items = [];
//     let total = 0;

//     snapshot.forEach((docSnap) => {
//       const data = docSnap.data();
//       items.push({ id: docSnap.id, ...data });
//       total += data.price * (data.quantity || 1);
//     });

//     setCartItems(items);
//     setTotalAmount(total);
//   };

//   const clearCart = async (userId) => {
//     const snapshot = await getDocs(collection(db, 'cart', userId, 'userCart'));
//     for (const docSnap of snapshot.docs) {
//       await deleteDoc(doc(db, 'cart', userId, 'userCart', docSnap.id));
//     }
//   };

//   const handlePayment = () => {
//     if (!isRazorpayReady || typeof window === 'undefined' || !window.Razorpay) {
//       alert('Razorpay is not ready. Please try again shortly.');
//       return;
//     }

//     const options = {
//       key: 'rzp_test_zoiBCtMTQU3kPx',
//       amount: totalAmount * 100, // in paise
//       currency: 'INR',
//       name: 'Harjot Store',
//       description: 'Order Payment',
//       handler: async function (response) {
//         console.log('Payment Success:', response);

//         if (user) {
//           const orderData = await placeOrder(user.uid, cartItems, totalAmount);
//           console.log('Order placed:', orderData);

//           await clearCart(user.uid);
//           router.push('/order-success');
//         }
//       },
//       prefill: {
//         name: user?.displayName || '',
//         email: user?.email || '',
//         contact: '',
//       },
//       theme: {
//         color: '#0f172a',
//       },
//     };

//     const razorpay = new window.Razorpay(options);
//     razorpay.open();
//   };

//   return (
//     <div className="p-4 max-w-2xl mx-auto">
//       <h1 className="text-3xl font-bold mb-4">Checkout</h1>

//       {cartItems.length === 0 ? (
//         <p>Your cart is empty.</p>
//       ) : (
//         <>
//           <ul className="mb-4">
//             {cartItems.map((item) => (
//               <li key={item.id} className="border p-2 rounded mb-2">
//                 <div className="font-medium">{item.title}</div>
//                 <div>Qty: {item.quantity || 1}</div>
//                 <div>Price: ₹{item.price}</div>
//               </li>
//             ))}
//           </ul>

//           <div className="text-xl font-semibold mb-4">
//             Total: ₹{totalAmount.toFixed(2)}
//           </div>

//           <button
//             onClick={handlePayment}
//             className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
//           >
//             Pay Now
//           </button>
//         </>
//       )}
//     </div>
//   );
// }