// // src/context/CartContext.jsx
// "use client";

// import { createContext, useContext, useEffect, useState } from "react";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "@/firebase/config";
// import {
//   addToCartDB,
//   getCartItems,
//   removeFromCartDB,
//   updateCartQuantity,
// } from "@/firebase/cart";
// import {
//   setDoc,
//   deleteDoc,
//   doc,
//   getFirestore,
// } from "firebase/firestore";

// const CartContext = createContext();

// export const useCart = () => useContext(CartContext);

// export const CartProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [cart, setCart] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const db = getFirestore();

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (user) => {
//       setUser(user);
//       if (user) {
//         const items = await getCartItems(user.uid);
//         setCart(items);
//       } else {
//         setCart([]);
//       }
//       setLoading(false);
//     });

//     return () => unsub();
//   }, []);

//   const addToCart = async (product) => {
//     if (!user) return alert("Please login to add to cart");
//     await addToCartDB(user.uid, product);
//     const updated = await getCartItems(user.uid);
//     setCart(updated);
//   };

//   const removeFromCart = async (id) => {
//     await removeFromCartDB(user.uid, id);
//     const updated = await getCartItems(user.uid);
//     setCart(updated);
//   };

//   const updateQuantity = async (id, qty) => {
//     await updateCartQuantity(user.uid, id, qty);
//     const updated = await getCartItems(user.uid);
//     setCart(updated);
//   };

//   const saveForLater = async (item) => {
//     if (!user) return;
//     await setDoc(doc(db, "saved", user.uid, "savedItems", item.id), item);
//     await deleteDoc(doc(db, "cart", user.uid, "userCart", item.id));
//     const updated = await getCartItems(user.uid);
//     setCart(updated);
//   };

//   const moveToCart = async (item) => {
//     if (!user) return;
//     await setDoc(doc(db, "cart", user.uid, "userCart", item.id), item);
//     await deleteDoc(doc(db, "saved", user.uid, "savedItems", item.id));
//     const updated = await getCartItems(user.uid);
//     setCart(updated);
//   };

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         loading,
//         addToCart,
//         removeFromCart,
//         updateQuantity,
//         saveForLater,
//         moveToCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };




"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  collection
} from "firebase/firestore";

import { auth, db } from "@/firebase/config";
import {
  addToCartDB,
  getCartItems,
  removeFromCartDB,
  updateCartQuantity,
} from "@/firebase/cart";

// 1. Create Context
const CartContext = createContext();

// 2. Create Hook to Use Context
export const useCart = () => useContext(CartContext);

// 3. Provider Component
export const CartProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Saved Items
  const fetchSavedItems = async (uid) => {
    const snapshot = await getDocs(collection(db, "saved", uid, "savedItems"));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  // Auth Listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const items = await getCartItems(user.uid);
        const savedItems = await fetchSavedItems(user.uid);
        setCart(items);
        setSaved(savedItems);
      } else {
        setCart([]);
        setSaved([]);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Add to Cart
  const addToCart = async (product) => {
    if (!user) return alert("Please login to add to cart");
    await addToCartDB(user.uid, product);
    const updated = await getCartItems(user.uid);
    setCart(updated);
  };

  // Remove from Cart
  const removeFromCart = async (id) => {
    await removeFromCartDB(user.uid, id);
    const updated = await getCartItems(user.uid);
    setCart(updated);
  };

  // Update Quantity
  const updateQuantity = async (id, qty) => {
    await updateCartQuantity(user.uid, id, qty);
    const updated = await getCartItems(user.uid);
    setCart(updated);
  };

  // Save for Later
  const saveForLater = async (item) => {
    await setDoc(doc(db, "saved", user.uid, "savedItems", item.id), item);
    await deleteDoc(doc(db, "cart", user.uid, "userCart", item.id));
    const [updatedCart, updatedSaved] = await Promise.all([
      getCartItems(user.uid),
      fetchSavedItems(user.uid),
    ]);
    setCart(updatedCart);
    setSaved(updatedSaved);
  };

  // Move back to Cart
  const moveToCart = async (item) => {
    await setDoc(doc(db, "cart", user.uid, "userCart", item.id), item);
    await deleteDoc(doc(db, "saved", user.uid, "savedItems", item.id));
    const [updatedCart, updatedSaved] = await Promise.all([
      getCartItems(user.uid),
      fetchSavedItems(user.uid),
    ]);
    setCart(updatedCart);
    setSaved(updatedSaved);
  };

  // Remove from Saved
  const removeFromSaved = async (id) => {
    await deleteDoc(doc(db, "saved", user.uid, "savedItems", id));
    const updatedSaved = await fetchSavedItems(user.uid);
    setSaved(updatedSaved);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        saved,
        addToCart,
        removeFromCart,
        updateQuantity,
        saveForLater,
        moveToCart,
        removeFromSaved,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};