"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const { user } = useAuth();

  // Protect route
  if (!user || user.email !== "shoppingwelcome17@gmail.com") {
    redirect("/");
  }

  // Fetch categories with product count
  useEffect(() => {
    const fetchCategoriesWithProductCount = async () => {
      const snapshot = await getDocs(collection(db, "categories"));

      const categoryList = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const productsSnap = await getDocs(
            collection(db, "categories", docSnap.id, "products")
          );
          return {
            id: docSnap.id,
            name: docSnap.id,
            status: docSnap.data()?.status || "active",
            productCount: productsSnap.size,
          };
        })
      );

      setCategories(categoryList);
    };

    fetchCategoriesWithProductCount();
  }, []);

  // Toggle individual selection
  const toggleSelect = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };

  // Select or deselect all
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories.map((cat) => cat.id));
    }
    setSelectAll(!selectAll);
  };

  // Bulk delete
  const handleDeleteSelected = async () => {
    if (
      selectedCategories.length === 0 ||
      !confirm("Are you sure you want to delete selected categories?")
    )
      return;

    await Promise.all(
      selectedCategories.map(async (id) => {
        await deleteDoc(doc(db, "categories", id));
      })
    );

    setCategories((prev) =>
      prev.filter((cat) => !selectedCategories.includes(cat.id))
    );
    setSelectedCategories([]);
    setSelectAll(false);
  };

  // Bulk status update
  const handleStatusUpdate = async (status) => {
    if (selectedCategories.length === 0) return;

    await Promise.all(
      selectedCategories.map(async (id) => {
        await updateDoc(doc(db, "categories", id), { status });
      })
    );

    setCategories((prev) =>
      prev.map((cat) =>
        selectedCategories.includes(cat.id) ? { ...cat, status } : cat
      )
    );
    setSelectedCategories([]);
    setSelectAll(false);
  };

  if (!categories.length) {
    return (
      <p className="text-gray-500 p-6">No categories found in the database.</p>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Categories</h1>

      {/* Bulk Actions */}
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="checkbox"
          checked={selectAll}
          onChange={toggleSelectAll}
          className="w-4 h-4"
        />
        <span>Select All</span>
        <button
          onClick={handleDeleteSelected}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
        >
          Delete Selected
        </button>
        <button
          onClick={() => handleStatusUpdate("active")}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          Activate
        </button>
        <button
          onClick={() => handleStatusUpdate("inactive")}
          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
        >
          Deactivate
        </button>
      </div>

      {/* Categories Table */}
      <div className="border rounded-md overflow-hidden shadow">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3"></th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Products</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => toggleSelect(category.id)}
                    className="w-4 h-4"
                  />
                </td>
                <td className="p-3 font-medium">{category.name}</td>
                <td className="p-3">{category.productCount}</td>
                <td
                  className={`p-3 font-semibold ${
                    category.status === "active"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {category.status}
                </td>
                <td className="p-3">
                  <Link
                    href={`/admin/products/${encodeURIComponent(category.id)}`}
                    className="text-blue-600 hover:underline"
                  >
                    View Products
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}