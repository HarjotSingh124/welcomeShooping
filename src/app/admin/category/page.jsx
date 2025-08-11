
'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useAuth } from "@/context/AuthContext";
import { redirect } from 'next/navigation';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
    const { user } = useAuth();
  

    if (!user || user.email !== "shoppingwelcome17@gmail.com") {
      redirect("/");
    }
  useEffect(() => {
    const fetchCategoriesWithProductCount = async () => {
      const snapshot = await getDocs(collection(db, 'categories'));

      const categoryList = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const productsSnap = await getDocs(collection(db, 'categories', doc.id, 'products'));
          return {
            id: doc.id,
            name: doc.id,
            productCount: productsSnap.size  // <-- Here we are counting products
          };
        })
      );

      setCategories(categoryList);
    };

    fetchCategoriesWithProductCount();
  }, []);

  return (
   <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <div className="divide-y border rounded-md">
        {categories.map(category => (
          <Link key={category.id} href={`/admin/products/${encodeURIComponent(category.id)}`}>
            <div className="border rounded p-4 shadow cursor-pointer hover:bg-gray-100">
              <h2 className="font-semibold">{category.name}</h2>
              <p>{category.productCount} Products</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

