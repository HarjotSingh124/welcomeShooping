import { app } from "./config";
import { collection, getDocs, getFirestore,collectionGroup } from "firebase/firestore";

export const fetchCategories = async () => {
  const db = getFirestore(app);
  const snapshot = await getDocs(collection(db, "products"));

  const allCategories = snapshot.docs.map(doc => doc.data().category).filter(Boolean);

  // Get unique categories
  const uniqueCategories = Array.from(new Set(allCategories));

  // Return in a format with `slug` and `name`
  return uniqueCategories.map(cat => ({
    id: cat,
    slug: cat,
    name: cat[0].toUpperCase() + cat.slice(1) // Capitalize for display
  }));



};

// Fetch all categories from products collection
export const fetchAllCategories = async () => {
  const db = getFirestore(app);
  const snapshot = await getDocs(collectionGroup(db, "products"));

  const categories = new Set();
  snapshot.forEach(doc => {
    const cat = doc.data()?.category?.split(">")?.[0]?.trim(); // clean main category
    if (cat) categories.add(cat);
  });

  return Array.from(categories);
};