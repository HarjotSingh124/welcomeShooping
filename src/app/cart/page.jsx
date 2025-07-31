
// "use client";

// import { useCart } from "@/context/CartContext";
// import Image from "next/image";
// import Link from "next/link";

// export default function CartPage() {
//   const { cart, removeFromCart, updateQuantity, loading } = useCart();

//   if (loading) return <div className="p-10">Loading...</div>;
//   if (cart.length === 0) return <div className="p-10 text-center">Your cart is empty.</div>;

//   const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

//   return (
//     <div className="max-w-5xl mx-auto p-6 space-y-6">
//       <h1 className="text-2xl font-bold">Your Cart</h1>

//       {cart.map(item => (
//         <div key={item.id} className="flex items-center justify-between bg-white p-4 shadow rounded">
//           <div className="flex items-center gap-4">
//             <Image src={item.images?.[0]|| item.image || "/placeholder.png"} alt={item.title} width={80} height={80} className="rounded" />
//             <div>
//               <h2 className="font-semibold">{item.title}</h2>
//               <p className="text-gray-500">₹{item.price} × {item.quantity}</p>
//               <div className="mt-1">
//                 <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity === 1} className="px-2">-</button>
//                 <span className="px-3">{item.quantity}</span>
//                 <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2">+</button>
//               </div>
//             </div>
//           </div>
//           <button onClick={() => removeFromCart(item.id)} className="text-red-600 hover:underline">
//             Remove
//           </button>
//         </div>
//       ))}

//       <div className="text-right">
//         <h2 className="text-xl font-bold">Total: ₹{total.toFixed(2)}</h2>
//         <Link href="/checkout">
//           <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Proceed to Checkout</button>
//         </Link>
//       </div>
//     </div>
//   );
// }



"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function CartPage() {
  const {
    cart,
    saved,
    removeFromCart,
    updateQuantity,
    saveForLater,
    moveToCart,
    removeFromSaved,
    loading,
  } = useCart();

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  if (!cart || cart.length === 0)
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty 🛒</h2>
        <p className="text-gray-600">Explore products and add them to your cart.</p>
        <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to Home
        </Link>
      </div>
    );

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Your Cart</h1>

      {cart.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between bg-white p-4 shadow-sm rounded-md"
        >
          <div className="flex items-center gap-4">
            <Image
              src={item.images?.[0] || item.image || "/placeholder.png"}
              alt={item.title}
              width={80}
              height={80}
              className="rounded object-cover"
            />
            <div>
              <h2 className="font-semibold text-lg">{item.title}</h2>
              <p className="text-gray-500 text-sm">
                ₹{item.price} × {item.quantity}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity === 1}
                  className="px-2 py-1 border rounded"
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="px-2 py-1 border rounded"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div className="text-right flex flex-col items-end gap-2">
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-600 hover:underline text-sm"
            >
              Remove
            </button>
            <button
              onClick={() => saveForLater(item)}
              className="text-blue-600 hover:underline text-sm"
            >
              Save for later
            </button>
          </div>
        </div>
      ))}

      <div className="text-right">
        <h2 className="text-xl font-bold">Total: ₹{total.toFixed(2)}</h2>
        <Link href="/checkout">
          <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Proceed to Checkout
          </button>
        </Link>
      </div>

      {/* Saved for later */}
      {saved && saved.length > 0 && (
        <div className="pt-10">
          <h2 className="text-xl font-semibold mb-4">Saved for Later</h2>
          <div className="space-y-4">
            {saved.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-gray-100 p-4 rounded-md"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={item.images?.[0] || item.image || "/placeholder.png"}
                    alt={item.title}
                    width={70}
                    height={70}
                    className="rounded object-cover"
                  />
                  <div>
                    <h2 className="font-semibold text-md">{item.title}</h2>
                    <p className="text-gray-600 text-sm">₹{item.price}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <button
                    onClick={() => moveToCart(item)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Move to Cart
                  </button>
                  <button
                    onClick={() => removeFromSaved(item.id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}