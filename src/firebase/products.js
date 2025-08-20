// // src/firebase/products.js

// import { collection, getDocs, getFirestore, query, where,limit as limitFn, collectionGroup} from "firebase/firestore";
// import { app } from "./config";
// import { doc, getDoc, addDoc, updateDoc, serverTimestamp, increment } from "firebase/firestore";
      

// const db = getFirestore(app);

// export async function getActiveProductById(categoryId, productId) {
//   const productRef = doc(db, "categories", categoryId, "products", productId);
//   const snap = await getDoc(productRef);

//   if (snap.exists()) {
//     const data = snap.data();
//     if (data.status === "active") {
//       return { id: snap.id, ...data };
//     }
//   }
//   return null; // means inactive or not found
// }
// // ✅ Fetch all products Fetch products by category

// export const searchProducts = async (query) => {
//   const lower = query.toLowerCase();
//   const snapshot = await getDocs(collectionGroup(db, "products"));

//   return snapshot.docs
//     .map((doc) => ({ id: doc.id, ...doc.data() }))
//     .filter(
//       (item) =>
//         item.status === "active" &&
//         (item.title?.toLowerCase().includes(lower) ||
//          item.category?.toLowerCase().includes(lower))
//     );
// };

// export async function addProductReview(categoryId, productId, userId, userName, rating, comment) {
//   const reviewsRef = collection(db, "categories", categoryId, "products", productId, "reviews");
//   await addDoc(reviewsRef, {
//     userId,
//     userName,
//     rating,
//     comment,
//     createdAt: serverTimestamp(),
//   });
// }

// export async function getProductReviews(categoryId, productId) {
//   const reviewsRef = collection(db, "categories", categoryId, "products", productId, "reviews");
//   const q = query(reviewsRef, orderBy("createdAt", "desc"));
//   const snapshot = await getDocs(q);
//   return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// }

// export async function reduceStock(categoryId, productId, quantity) {
//   const productRef = doc(db, "categories", categoryId, "products", productId);
//   await updateDoc(productRef, {
//     stock: increment(-quantity),
//   });
// }

// export async function checkStock(categoryId, productId) {
//   const productRef = doc(db, "categories", categoryId, "products", productId);
//   const snap = await getDoc(productRef);
//   if (snap.exists()) {
//     return snap.data().stock || 0;
//   }
//   return 0;
// }


// src/firebase/products.js
import {
  getFirestore,
  collection,
  collectionGroup,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  orderBy,
  serverTimestamp,
  increment,
  limit 
} from "firebase/firestore";
import { app } from "./config";

const db = getFirestore(app);

/**
 * Find an active product by its handle (search across category subcollections).
 * Returns null if not found OR not active.
 * Also returns categoryId and refPath (useful for admin updates).
 */
export async function getActiveProductByHandle(handle) {
  if (!handle) return null;

  const q = query(
    collectionGroup(db, "products"),
    where("handle", "==", handle),
    where("status", "==", "active")
  );

  const snap = await getDocs(q);
  if (snap.empty) return null;

  const d = snap.docs[0];
  const data = { id: d.id, ...d.data() };

  // derive categoryId from parent collection (products -> parent is category doc)
  const productsCollectionRef = d.ref.parent; // .../categories/{categoryId}/products
  const categoryDocRef = productsCollectionRef?.parent;
  const categoryId = categoryDocRef ? categoryDocRef.id : null;

  return { ...data, categoryId, refPath: d.ref.path };
}

/**
 * If you have category & productId, this returns the product only if active.
 */
export async function getActiveProductById(categoryId, productId) {
  if (!categoryId || !productId) return null;
  const productRef = doc(db, "categories", categoryId, "products", productId);
  const snap = await getDoc(productRef);
  if (!snap.exists()) return null;
  const data = snap.data();
  if (data.status !== "active") return null;
  return { id: snap.id, ...data, categoryId };
}

/**
 * Top-level reviews collection helpers (fast and simple).
 * We store reviews in top-level "reviews" with field productId = product.handle || product.id
 */
export async function getReviewsByProductKey(productKey) {
  if (!productKey) return [];
  const revCol = collection(db, "reviews");
  const q = query(revCol, where("productId", "==", productKey), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addReviewByProductKey(productKey, userId, userName, rating, text) {
  const revCol = collection(db, "reviews");
  await addDoc(revCol, {
    productId: productKey,
    userId,
    userName,
    rating,
    text,
    createdAt: serverTimestamp(),
  });
}

/**
 * Stock helpers by handle (collectionGroup lookup used)
 */
export async function checkStockByHandle(handle) {
  if (!handle) return 0;
  const q = query(collectionGroup(db, "products"), where("handle", "==", handle));
  const snap = await getDocs(q);
  if (snap.empty) return 0;
  return snap.docs[0].data().stock ?? 0;
}

export async function reduceStockByHandle(handle, quantity) {
  if (!handle) throw new Error("handle required");
  const q = query(collectionGroup(db, "products"), where("handle", "==", handle));
  const snap = await getDocs(q);
  if (snap.empty) throw new Error("Product not found");
  const prodDoc = snap.docs[0];
  await updateDoc(prodDoc.ref, { stock: increment(-Math.abs(quantity)) });
}

/**
 * Optional helper: get related products by category (returns active products).
 */
export async function getRelatedByCategory(category, limit = 8, excludeHandle = null) {
  if (!category) return [];
  const snap = await getDocs(collectionGroup(db, "products"));
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((p) => p.status === "active" && p.category === category && p.handle !== excludeHandle)
    .slice(0, limit);
}
