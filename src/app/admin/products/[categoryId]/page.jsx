// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { db } from "@/firebase/config";
// import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

// export default function AdminProductsPage() {
//   const { categoryId } = useParams();
//   const [products, setProducts] = useState([]);
//   const [openProductId, setOpenProductId] = useState(null);
//   const [editData, setEditData] = useState({});

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const snapshot = await getDocs(collection(db, "categories", categoryId, "products"));
//       const data = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setProducts(data);
//     };
//     fetchProducts();
//   }, [categoryId]);

//   const handleEditToggle = (product) => {
//     if (openProductId === product.id) {
//       setOpenProductId(null);
//     } else {
//       setOpenProductId(product.id);
//       setEditData({
//         title: product.title || "",
//         price: product.price || "",
//         category: product.category || "",
//         image: product.image || product.images?.[0] || "",
//       });
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEditData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSave = async (id) => {
//     try {
//       await updateDoc(doc(db, "categories", categoryId, "products", id), editData);
//       setProducts(prev =>
//         prev.map(p => (p.id === id ? { ...p, ...editData } : p))
//       );
//       setOpenProductId(null);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (confirm("Are you sure you want to delete this product?")) {
//       await deleteDoc(doc(db, "categories", categoryId, "products", id));
//       setProducts(prev => prev.filter(p => p.id !== id));
//     }
//   };

//   if (!products.length) {
//     return <p className="text-gray-500 p-6">No products found in this category.</p>;
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-8">
//       <h1 className="text-3xl font-bold mb-8 text-gray-800">Manage Products</h1>

//       <div className="space-y-6">
//         {products.map(prod => (
//           <div
//             key={prod.id}
//             className="border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-200"
//           >
//             {/* Row layout */}
//             <div className="flex items-center gap-6 p-5">
              // {/* Image */}
              // <div className="w-24 h-24 bg-gray-50 flex items-center justify-center overflow-hidden rounded-lg">
              //   <img
              //     src={prod.image || prod.images?.[0] || "/placeholder.png"}
              //     alt={prod.title}
              //     className="h-full object-contain p-2"
              //   />
              // </div>

//               {/* Info */}
//               <div className="flex-1">
//                 <h3 className="text-lg font-semibold text-gray-900">{prod.title}</h3>
//                 <p className="text-gray-600">₹{prod.price}</p>
//                 <p className="text-sm text-gray-400">{prod.category}</p>
//               </div>

//               {/* Actions */}
//               <div className="flex flex-col gap-2">
//                 <button
//                   onClick={() => handleEditToggle(prod)}
//                   className="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
//                 >
//                   {openProductId === prod.id ? "Cancel" : "Edit"}
//                 </button>
//                 <button
//                   onClick={() => handleDelete(prod.id)}
//                   className="text-sm font-medium text-red-600 hover:text-red-800 transition"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>

//             {/* Edit Section */}
//             {openProductId === prod.id && (
//               <div className="px-5 pb-5 border-t border-gray-200 bg-gray-50">
//                 <div className="mt-4 space-y-3">
//                   <input
//                     name="title"
//                     value={editData.title}
//                     onChange={handleChange}
//                     className="border border-gray-300 rounded-lg p-2 w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//                     placeholder="Title"
//                   />
//                   <input
//                     name="price"
//                     value={editData.price}
//                     onChange={handleChange}
//                     type="number"
//                     className="border border-gray-300 rounded-lg p-2 w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//                     placeholder="Price"
//                   />
//                   <input
//                     name="category"
//                     value={editData.category}
//                     onChange={handleChange}
//                     className="border border-gray-300 rounded-lg p-2 w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//                     placeholder="Category"
//                   />
//                   <input
//                     name="image"
//                     value={editData.image}
//                     onChange={handleChange}
//                     className="border border-gray-300 rounded-lg p-2 w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//                     placeholder="Image URL"
//                   />

//                   <button
//                     onClick={() => handleSave(prod.id)}
//                     className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
//                   >
//                     Save Changes
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
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

export default function AdminProductsPage() {
  const { categoryId } = useParams();
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