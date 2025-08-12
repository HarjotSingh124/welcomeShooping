// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { db } from "@/firebase/config";
// import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

// export default function AdminProductsPage() {
//   const params = useParams();
//   const categoryId = decodeURIComponent(params.categoryId);
//   const [products, setProducts] = useState([]);
//   const [expandedId, setExpandedId] = useState(null);
//   const [editData, setEditData] = useState({});

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const snapshot = await getDocs(
//         collection(db, "categories", categoryId, "products")
//       );
//       const data = snapshot.docs.map((docSnap) => ({
//         id: docSnap.id,
//         ...docSnap.data(),
//       }));
//       setProducts(data);
//     };
//     fetchProducts();
//   }, [categoryId]);

//   const handleExpand = (product) => {
//     if (expandedId === product.id) {
//       setExpandedId(null);
//       return;
//     }
//     setExpandedId(product.id);
//     setEditData(product);
//   };

//   const handleChange = (field, value) => {
//     setEditData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleSave = async () => {
//     const productRef = doc(
//       db,
//       "categories",
//       categoryId,
//       "products",
//       expandedId
//     );
//     await updateDoc(productRef, editData);
//     setProducts((prev) =>
//       prev.map((p) => (p.id === expandedId ? { ...p, ...editData } : p))
//     );
//     setExpandedId(null);
//   };

//   if (!products.length) {
//     return (
//       <p className="text-gray-500 p-6">
//         No products found in this category.
//       </p>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-6">{categoryId}</h1>

//       <h1 className="text-2xl font-bold mb-6">Products in Category</h1>
//       <div className="divide-y border rounded-md">
//         {products.map((prod) => (
//           <div key={prod.id} className="p-4">
//             {/* Product Row */}
//             <div
//               className="flex justify-between items-center cursor-pointer hover:bg-gray-50"
//               onClick={() => handleExpand(prod)}
//             >
//               {/* Image */}
//               <div className="w-24 h-24 bg-gray-50 flex items-center justify-center overflow-hidden rounded-lg">
//                 <img
//                   src={prod.image || prod.images?.[0] || "/placeholder.png"}
//                   alt={prod.title}
//                   className="h-full object-contain p-2"
//                 />
//               </div>
//               <div>
//                 <p className="font-semibold">{prod.title || "Untitled"}</p>
//                 <p className="text-sm text-gray-500">₹{prod.price}</p>
//               </div>
//               <p className="text-blue-600 text-sm">Edit</p>
//             </div>

//             {/* Expanded Edit Form */}
//             {expandedId === prod.id && (
//               <div className="mt-4 space-y-3 bg-gray-50 p-4 rounded-md">
//                 <label className="block">
//                   <span className="text-sm font-medium">Title</span>
//                   <input
//                     type="text"
//                     value={editData.title || ""}
//                     onChange={(e) => handleChange("title", e.target.value)}
//                     className="mt-1 block w-full border rounded p-2"
//                   />
//                 </label>

//                 <label className="block">
//                   <span className="text-sm font-medium">Handle</span>
//                   <input
//                     type="text"
//                     value={editData.handle || ""}
//                     onChange={(e) => handleChange("handle", e.target.value)}
//                     className="mt-1 block w-full border rounded p-2"
//                   />
//                 </label>

//                 <label className="block">
//                   <span className="text-sm font-medium">Image URL</span>
//                   <input
//                     type="text"
//                     value={editData.image || ""}
//                     onChange={(e) => handleChange("image", e.target.value)}
//                     className="mt-1 block w-full border rounded p-2"
//                   />
//                 </label>

//                 <label className="block">
//                   <span className="text-sm font-medium">Price</span>
//                   <input
//                     type="number"
//                     value={editData.price || ""}
//                     onChange={(e) =>
//                       handleChange("price", Number(e.target.value))
//                     }
//                     className="mt-1 block w-full border rounded p-2"
//                   />
//                 </label>

//                 {/* New Stock Field */}
//                 <label className="block">
//                   <span className="text-sm font-medium">Stock</span>
//                   <input
//                     type="number"
//                     value={editData.stock || 0}
//                     onChange={(e) =>
//                       handleChange("stock", Number(e.target.value))
//                     }
//                     className="mt-1 block w-full border rounded p-2"
//                   />
//                 </label>

//                 <label className="block">
//                   <span className="text-sm font-medium">Status</span>
//                   <select
//                     value={editData.status || "active"}
//                     onChange={(e) => handleChange("status", e.target.value)}
//                     className="mt-1 block w-full border rounded p-2"
//                   >
//                     <option value="active">Active</option>
//                     <option value="inactive">Inactive</option>
//                   </select>
//                 </label>

//                 <label className="block">
//                   <span className="text-sm font-medium">Tags</span>
//                   <input
//                     type="text"
//                     value={editData.tags || ""}
//                     onChange={(e) => handleChange("tags", e.target.value)}
//                     className="mt-1 block w-full border rounded p-2"
//                   />
//                 </label>

//                 <label className="block">
//                   <span className="text-sm font-medium">Type</span>
//                   <input
//                     type="text"
//                     value={editData.type || ""}
//                     onChange={(e) => handleChange("type", e.target.value)}
//                     className="mt-1 block w-full border rounded p-2"
//                   />
//                 </label>

//                 <label className="block">
//                   <span className="text-sm font-medium">Data Sheets</span>
//                   <textarea
//                     value={editData["data sheets"] || ""}
//                     onChange={(e) =>
//                       handleChange("data sheets", e.target.value)
//                     }
//                     className="mt-1 block w-full border rounded p-2 h-32"
//                   />
//                 </label>

//                 {/* Action Buttons */}
//                 <div className="flex space-x-2">
//                   <button
//                     onClick={handleSave}
//                     className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//                   >
//                     Save
//                   </button>
//                   <button
//                     onClick={() => setExpandedId(null)}
//                     className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/firebase/config";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export default function AdminProductsPage() {
  const params = useParams();
  const categoryId = decodeURIComponent(params.categoryId);
  const [products, setProducts] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [editData, setEditData] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(
        collection(db, "categories", categoryId, "products")
      );
      const data = snapshot.docs.map((docSnap) => ({
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
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const productRef = doc(
      db,
      "categories",
      categoryId,
      "products",
      expandedId
    );
    await updateDoc(productRef, editData);
    setProducts((prev) =>
      prev.map((p) => (p.id === expandedId ? { ...p, ...editData } : p))
    );
    setExpandedId(null);
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return alert("No products selected.");
    if (!confirm("Delete selected products?")) return;

    await Promise.all(
      selectedIds.map((id) =>
        deleteDoc(doc(db, "categories", categoryId, "products", id))
      )
    );
    setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
    setSelectedIds([]);
  };

  const handleBulkStatusChange = async (status) => {
    if (!selectedIds.length) return alert("No products selected.");

    await Promise.all(
      selectedIds.map((id) =>
        updateDoc(doc(db, "categories", categoryId, "products", id), {
          status,
        })
      )
    );
    setProducts((prev) =>
      prev.map((p) =>
        selectedIds.includes(p.id) ? { ...p, status } : p
      )
    );
    setSelectedIds([]);
  };

  if (!products.length) {
    return (
      <p className="text-gray-500 p-6">
        No products found in this category.
      </p>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{categoryId}</h1>

   {/* Bulk Action Buttons */}
<div className="mb-4 flex gap-3 items-center">
  <button
    onClick={() => {
      if (selectedIds.length === products.length) {
        // Deselect all
        setSelectedIds([]);
      } else {
        // Select all
        setSelectedIds(products.map((p) => p.id));
      }
    }}
    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
  >
    {selectedIds.length === products.length ? "Deselect All" : "Select All"}
  </button>

  {selectedIds.length > 0 && (
    <>
      <button
        onClick={handleBulkDelete}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Delete Selected
      </button>
      <button
        onClick={() => handleBulkStatusChange("active")}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Set Active
      </button>
      <button
        onClick={() => handleBulkStatusChange("inactive")}
        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
      >
        Set Inactive
      </button>
    </>
  )}
</div>

      <div className="divide-y border rounded-md">
        {products.map((prod) => (
          <div key={prod.id} className="p-4">
            {/* Product Row */}
            <div
              className="flex justify-between items-center hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(prod.id)}
                onChange={() => toggleSelect(prod.id)}
              />

              {/* Image */}
              <div
                className="w-24 h-24 bg-gray-50 flex items-center justify-center overflow-hidden rounded-lg cursor-pointer"
                onClick={() => handleExpand(prod)}
              >
                <img
                  src={prod.image || prod.images?.[0] || "/placeholder.png"}
                  alt={prod.title}
                  className="h-full object-contain p-2"
                />
              </div>
              <div
                className="flex-1 ml-4 cursor-pointer"
                onClick={() => handleExpand(prod)}
              >
                <p className="font-semibold">{prod.title || "Untitled"}</p>
                <p className="text-sm text-gray-500">₹{prod.price}</p>
                <p
                  className={`text-xs mt-1 ${
                    prod.status === "active"
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {prod.status || "inactive"}
                </p>
              </div>
              <p
                className="text-blue-600 text-sm cursor-pointer"
                onClick={() => handleExpand(prod)}
              >
                Edit
              </p>
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
                  <span className="text-sm font-medium">Price</span>
                  <input
                    type="number"
                    value={editData.price || ""}
                    onChange={(e) =>
                      handleChange("price", Number(e.target.value))
                    }
                    className="mt-1 block w-full border rounded p-2"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium">Stock</span>
                  <input
                    type="number"
                    value={editData.stock || 0}
                    onChange={(e) =>
                      handleChange("stock", Number(e.target.value))
                    }
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