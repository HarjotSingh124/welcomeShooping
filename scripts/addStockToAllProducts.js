// Run this script with: node scripts/addStockToAllProducts.js
// Make sure you have Firebase initialized correctly

import { initializeApp } from "firebase/app";
import { getFirestore, collectionGroup, getDocs, updateDoc, doc } from "firebase/firestore";

// 1️⃣ Firebase config — same as your /firebase/config.js
const firebaseConfig = {
  apiKey: "AIzaSyAm-RLnTCcdy76YD56rihUpqdXlZqxGp1g",
  authDomain: "welcomeshopping-8a43e.firebaseapp.com",
  projectId: "welcomeshopping-8a43e",
  storageBucket: "welcomeshopping-8a43e.firebasestorage.app",
  messagingSenderId: "979987838805",
  appId: "1:979987838805:web:bb287d1b71901de79c21dc"
};
// 2️⃣ Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 3️⃣ Script to update all products
async function addStockField(defaultStock = 20) {
  try {
    console.log(`🔍 Fetching all products...`);
    const productsQuery = collectionGroup(db, "products");
    const snapshot = await getDocs(productsQuery);

    if (snapshot.empty) {
      console.log("⚠️ No products found.");
      return;
    }

    console.log(`Found ${snapshot.size} products. Updating stock...`);

    const updates = snapshot.docs.map(async (prod) => {
      await updateDoc(doc(db, prod.ref.path), { stock: defaultStock });
      console.log(`✅ Updated stock for: ${prod.id}`);
    });

    await Promise.all(updates);
    console.log(`🎉 All products updated with stock = ${defaultStock}`);
  } catch (error) {
    console.error("❌ Error updating stock:", error);
  }
}

// 4️⃣ Run script
addStockField(20); // Change defaultStock if needed