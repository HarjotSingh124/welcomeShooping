'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';

export default function CategoryProductsPage() {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, 'categories', categoryId, 'products');
        const snapshot = await getDocs(productsRef);

        const productList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log('Fetched Products:', productList);

        setProducts(productList);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    if (categoryId) {
      fetchProducts();
    }
  }, [categoryId]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products in {categoryId}</h1>
        <Link href={`/admin/products/${categoryId}/add-product`} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center text-gray-500 text-lg mt-20">No products found in this category.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map(product => (
            <Link
              key={product.id}
              href={`/admin/products/${categoryId}/${product.id}`}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-white"
            >
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                {product.images && product.images.length > 0 ? (
                  <Image src={product.image} alt={product.title} width={150} height={150} className="object-contain" />
                ) : (
                  <span className="text-gray-400 text-sm">No Image</span>
                )}
              </div>
              <div className="p-4">
                <h2 className="font-semibold text-base mb-1 truncate">{product.title}</h2>
                <p className="text-green-600 font-bold mb-2">₹{product.price}</p>
                <p className="text-xs text-gray-500 capitalize">Type: {product.type || 'N/A'}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}