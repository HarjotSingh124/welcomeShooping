// src/firebase/products.js

import { collection, getDocs, getFirestore, query, where,limit as limitFn, collectionGroup} from "firebase/firestore";
import { app } from "./config";
const db = getFirestore(app);

// ✅ Fetch all products
export const fetchActiveProducts = async (category = null) => {
  const db = getFirestore(app);
  let q = collection(db, "products");

  if (category) {
    q = query(q, where("category", "==", category));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(prod => prod.status === "active");
};
// ✅ Fetch products by category

export const searchProducts = async (query) => {
  const lower = query.toLowerCase();
  const snapshot = await getDocs(collectionGroup(db, "products"));

  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter(
      (item) =>
        item.status === "active" &&
        (item.title?.toLowerCase().includes(lower) ||
         item.category?.toLowerCase().includes(lower))
    );
};