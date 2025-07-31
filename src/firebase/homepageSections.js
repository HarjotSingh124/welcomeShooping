import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { app } from "./config";

// Fetch all enabled sections sorted by order


// Add a new section
export const addHomepageSection = async (data) => {
  const db = getFirestore(app);
  await addDoc(collection(db, "homepage_sections"), data);
};

// Optional: Edit or delete
export const updateHomepageSection = async (id, data) => {
  const db = getFirestore(app);
  await updateDoc(doc(db, "homepage_sections", id), data);
};

export const deleteHomepageSection = async (id) => {
  const db = getFirestore(app);
  await deleteDoc(doc(db, "homepage_sections", id));
};


export const fetchHomepageSections = async () => {
  const db = getFirestore(app);
  const snapshot = await getDocs(collection(db, "homepage_sections"));
  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(sec => sec.enabled)
    .sort((a, b) => a.order - b.order);
};

export const fetchHomeSections = async () => {
  const db = getFirestore(app);
  const snapshot = await getDocs(collection(db, "home_sections"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
