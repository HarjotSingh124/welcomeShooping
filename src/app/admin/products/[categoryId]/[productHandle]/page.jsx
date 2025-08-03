'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Image from 'next/image';

export default function ProductDetailPage() {
  const { categoryId, productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', price: '', type: '', images: [] });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, 'categories', categoryId, 'products', productId);
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
          setProduct(productSnap.data());
          setFormData(productSnap.data());
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId && productId) {
      fetchProduct();
    }
  }, [categoryId, productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const productRef = doc(db, 'categories', categoryId, 'products', productId);
      await updateDoc(productRef, formData);
      alert('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!product) return <div className="p-6">Product not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Type</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Images</label>
          <div className="grid grid-cols-2 gap-4">
            {formData.images?.map((imgUrl, idx) => (
              <Image key={idx} src={imgUrl} alt="Product Image" width={150} height={150} className="object-contain border rounded" />
            ))}
          </div>
        </div>

        <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Save Changes
        </button>
      </div>
    </div>
  );
}
