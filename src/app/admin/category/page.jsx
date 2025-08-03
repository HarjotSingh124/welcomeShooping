
'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useParams } from 'next/navigation';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);

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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <div className="grid grid-cols-4 gap-4">
        {categories.map(category => (
          <Link key={category.id} href={`/admin/products/${category.id}`}>
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