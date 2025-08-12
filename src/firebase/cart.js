// src/firebase/cart.js
import { collection, doc, setDoc, getDocs, deleteDoc, updateDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { app } from "@/firebase/config";

const db = getFirestore(app);

// Firestore Path: cart/{userId}/userCart/{cartItemId}

export const addToCartDB = async (userId, product) => {
  const cartRef = doc(db, "cart", userId, "userCart", product.id);
  await setDoc(cartRef, { ...product, });
};

export const getCartItems = async (userId) => {
  const snapshot = await getDocs(collection(db, "cart", userId, "userCart"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const removeFromCartDB = async (userId, cartItemId) => {
  await deleteDoc(doc(db, "cart", userId, "userCart", cartItemId));
};

export const updateCartQuantity = async (userId, cartItemId, quantity) => {
  const ref = doc(db, "cart", userId, "userCart", cartItemId);
  await updateDoc(ref, { quantity });
};