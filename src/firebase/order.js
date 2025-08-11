import { collection, setDoc, doc, Timestamp,getDocs,deleteDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { db } from './config';

// firestore/orders.js

export const placeOrder = async (userId, cartItems, totalAmount,address = null) => {
  const orderId = uuidv4(); // Generate a unique order ID

  const orderData = {
    orderId: orderId,
    userId: userId,
    totalAmount: totalAmount,
    status: "pending",
    createdAt: new Date(),
    items: cartItems.map((item) => ({
      productId: item.id,
      title: item.title,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
     address: address ? address : null,
    })),
  };

  await setDoc(doc(db, "orders", userId, "userOrders", orderId), orderData);
};

export const getUserOrders = async (userId) => {
  const snapshot = await getDocs(collection(db, "orders", userId, "userOrders"));
  return snapshot.docs.map((doc) => doc.data());
};

export const getOrderById = async (userId, orderId) => {
  const docRef = doc(db, "orders", userId, "userOrders", orderId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    throw new Error("Order not found");
  }
};




/**
 * Clear Cart after Order Placed
 * @param {string} userId - User's ID
 */
export const clearCart = async (userId) => {
  const cartRef = collection(db, 'cart', userId, 'userCart');
  const cartSnapshot = await getDocs(cartRef);

  const deletePromises = cartSnapshot.docs.map((docSnap) =>
    deleteDoc(doc(db, 'cart', userId, 'userCart', docSnap.id))
  );

  await Promise.all(deletePromises);
};

/**
 * Update Order Status
 * @param {string} userId 
 * @param {string} orderId 
 * @param {string} status 
 */
export const updateOrderStatus = async (userId, orderId, status) => {
  const orderRef = doc(db, 'orders', userId, 'userOrders', orderId);
  await setDoc(orderRef, { status }, { merge: true });
};