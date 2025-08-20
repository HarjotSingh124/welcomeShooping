"use client";

import Toast from "@/components/Toast";  // Import the Toast component we created earlier

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
import { useRouter } from "next/navigation";  // Use Next.js router for navigation
// /context/CartIconContext.js


export const CartIconContext = createContext(null);
// 1. Create Context
const CartContext = createContext();

// 2. Create Hook to Use Context
export const useCart = () => useContext(CartContext);

// 3. Provider Component
export const CartProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [saved, setSaved] = useState([]);
    const router = useRouter();
  const [loading, setLoading] = useState(true);
    const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
   const showCartToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
  };


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
    if (!user) {
      router.push("/login");
      return alert("Please login to add to cart");
    }
    await addToCartDB(user.uid, product,);
    const updated = await getCartItems(user.uid);
    setCart(updated);

    showCartToast(`${product.title} added to cart 🛒`);
  };

  // Remove from Cart
  const removeFromCart = async (id) => {
    await removeFromCartDB(user.uid, id);
    const updated = await getCartItems(user.uid);
    setCart(updated);
  };

  // Update Quantity
  const updateQuantity = async (id, qty) => {
    await updateCartQuantity(user.uid, id, qty || 1);
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
         {/* Toast Component */}
      <Toast
        message={toastMessage}
        visible={showToast}
        onClose={() => setShowToast(false)}
      />
    </CartContext.Provider>
  );
};


