"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/firebase/config";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

export default function AdminProductsPage() {
  const params = useParams();
   const categoryId = decodeURIComponent(params.categoryId);
  const [products, setProducts] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, "categories", categoryId, "products"));
      const data = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setProducts(data);
    };
    fetchProducts();
  }, [categoryId]);

  const handleExpand = (product) => {
    if (expandedId === product.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(product.id);
    setEditData(product);
  };

  const handleChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const productRef = doc(db, "categories", categoryId, "products", expandedId);
    await updateDoc(productRef, editData);
    setProducts(prev =>
      prev.map(p => (p.id === expandedId ? { ...p, ...editData } : p))
    );
    setExpandedId(null);
  };

 if (!products.length) {
    return <p className="text-gray-500 p-6">No products found in this category.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{categoryId}</h1>

        <h1 className="text-2xl font-bold mb-6">Products in Category</h1>
      <div className="divide-y border rounded-md">
        {products.map((prod) => (
          <div key={prod.id} className="p-4">
            {/* Product Row */}
            <div
              className="flex justify-between items-center cursor-pointer hover:bg-gray-50"
              onClick={() => handleExpand(prod)}
            >
               {/* Image */}
              <div className="w-24 h-24 bg-gray-50 flex items-center justify-center overflow-hidden rounded-lg">
                <img
                  src={prod.image || prod.images?.[0] || "/placeholder.png"}
                  alt={prod.title}
                  className="h-full object-contain p-2"
                />
              </div>
              <div>
                <p className="font-semibold">{prod.title || "Untitled"}</p>
                <p className="text-sm text-gray-500">₹{prod.price}</p>
              </div>
              <p className="text-blue-600 text-sm">Edit</p>
            </div>

            {/* Expanded Edit Form */}
            {expandedId === prod.id && (
              <div className="mt-4 space-y-3 bg-gray-50 p-4 rounded-md">
                <label className="block">
                  <span className="text-sm font-medium">Title</span>
                  <input
                    type="text"
                    value={editData.title || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="mt-1 block w-full border rounded p-2"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium">Handle</span>
                  <input
                    type="text"
                    value={editData.handle || ""}
                    onChange={(e) => handleChange("handle", e.target.value)}
                    className="mt-1 block w-full border rounded p-2"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium">Image URL</span>
                  <input
                    type="text"
                    value={editData.image || ""}
                    onChange={(e) => handleChange("image", e.target.value)}
                    className="mt-1 block w-full border rounded p-2"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium">Price</span>
                  <input
                    type="number"
                    value={editData.price || ""}
                    onChange={(e) => handleChange("price", Number(e.target.value))}
                    className="mt-1 block w-full border rounded p-2"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium">Status</span>
                  <select
                    value={editData.status || "active"}
                    onChange={(e) => handleChange("status", e.target.value)}
                    className="mt-1 block w-full border rounded p-2"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-medium">Tags</span>
                  <input
                    type="text"
                    value={editData.tags || ""}
                    onChange={(e) => handleChange("tags", e.target.value)}
                    className="mt-1 block w-full border rounded p-2"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium">Type</span>
                  <input
                    type="text"
                    value={editData.type || ""}
                    onChange={(e) => handleChange("type", e.target.value)}
                    className="mt-1 block w-full border rounded p-2"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium">Data Sheets</span>
                  <textarea
                    value={editData["data sheets"] || ""}
                    onChange={(e) => handleChange("data sheets", e.target.value)}
                    className="mt-1 block w-full border rounded p-2 h-32"
                  />
                </label>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setExpandedId(null)}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}