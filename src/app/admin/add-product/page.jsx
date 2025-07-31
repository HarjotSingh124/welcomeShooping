// "use client";

// import { useState } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { redirect } from "next/navigation";
// import {
//   addDoc,
//   collection,
//   getFirestore,
//   doc,
//   setDoc,
//   getDoc,
// } from "firebase/firestore";
// import { app } from "@/firebase/config";
// import * as XLSX from "xlsx";

// export default function AddProductPage() {
//   const { user } = useAuth();
//   const db = getFirestore(app);

//   const [form, setForm] = useState({
//     title: "",
//     handle: "",
//     price: "",
//     image: "",
//     category: "",
//     description: "",
//     type: "",
//     tags: "",
//     status: "active",
//   });

//   const [loading, setLoading] = useState(false);

//   if (!user || user.email !== "shoppingwelcome17@gmail.com") {
//     redirect("/");
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const cleanHTML = (raw) =>
//     raw?.replace(/â€¢/g, "•").replace(/â€“/g, "-") || "";

//   const saveProductToFirestore = async (product) => {
//     const categorySlug = product.category;
//     const categoryRef = doc(db, "categories", categorySlug);
//     const catSnap = await getDoc(categoryRef);

//     if (!catSnap.exists()) {
//       await setDoc(categoryRef, { name: categorySlug });
//     }

//     const productRef = doc(collection(categoryRef, "products"), product.handle);
//     await setDoc(productRef, {
//       ...product,
//       description: cleanHTML(product.description),
//     });
//   };

//   const handleAddProduct = async () => {
//     setLoading(true);
//     try {
//       await saveProductToFirestore(form);
//       alert("✅ Product added successfully");
//       setForm({
//         title: "",
//         handle: "",
//         price: "",
//         image: "",
//         category: "",
//         description: "",
//         type: "",
//         tags: "",
//         status: "active",
//       });
//     } catch (err) {
//       console.error(err);
//       alert("❌ Error adding product");
//     }
//     setLoading(false);
//   };

//   const handleFileUpload = async (e) => {
//     setLoading(true);
//     const file = e.target.files[0];
//     const reader = new FileReader();

//     reader.onload = async (evt) => {
//       const data = new Uint8Array(evt.target.result);
//       const workbook = XLSX.read(data, { type: "array" });

//       const sheet = workbook.Sheets[workbook.SheetNames[0]];
//       const jsonData = XLSX.utils.sheet_to_json(sheet);

//       for (const item of jsonData) {
//         const firstCategory = (item["Product Category"] || "general")
//           .split(">")[0]
//           .trim();

//         const product = {
//           title: item["Title"] || item["Product title"] || "Untitled",
//           handle: item["Handle"],
//           price: +item["Variant Price"] || 0,
//           image: item["Image Src"],
//           category: firstCategory,
//           description: item["Body (HTML)"] || "",
//           type: item["Type"] || "",
//           tags: item["Tags"] || "",
//           status: item["Status"] || "active",
//         };

//         if (product.handle) {
//           await saveProductToFirestore(product);
//         }
//       }

//       alert("✅ Bulk upload complete");
//       setLoading(false);
//     };

//     reader.readAsArrayBuffer(file);
//   };

//   return (
//     <div className="max-w-5xl mx-auto px-6 py-10 bg-white rounded-lg shadow space-y-6">
//       <h1 className="text-3xl font-bold text-gray-800">🛒 Add New Product</h1>

     

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <input
//           name="title"
//           value={form.title}
//           onChange={handleChange}
//           placeholder="Product Title"
//           className="border border-gray-300 p-3 rounded-md focus:ring focus:ring-blue-300"
//         />
//         <input
//           name="handle"
//           value={form.handle}
//           onChange={handleChange}
//           placeholder="Unique Handle (e.g. red-tshirt)"
//           className="border border-gray-300 p-3 rounded-md focus:ring focus:ring-blue-300"
//         />
//         <input
//           name="price"
//           type="number"
//           value={form.price}
//           onChange={handleChange}
//           placeholder="Price (₹)"
//           className="border border-gray-300 p-3 rounded-md focus:ring focus:ring-blue-300"
//         />
//         <input
//           name="image"
//           value={form.image}
//           onChange={handleChange}
//           placeholder="Image URL"
//           className="border border-gray-300 p-3 rounded-md focus:ring focus:ring-blue-300"
//         />
//         <input
//           name="category"
//           value={form.category}
//           onChange={handleChange}
//           placeholder="Category (e.g. fashion)"
//           className="border border-gray-300 p-3 rounded-md focus:ring focus:ring-blue-300"
//         />
//         <input
//           name="type"
//           value={form.type}
//           onChange={handleChange}
//           placeholder="Type / Sub-category (e.g. tshirt)"
//           className="border border-gray-300 p-3 rounded-md focus:ring focus:ring-blue-300"
//         />
//         <input
//           name="tags"
//           value={form.tags}
//           onChange={handleChange}
//           placeholder="Tags (comma separated)"
//           className="border border-gray-300 p-3 rounded-md focus:ring focus:ring-blue-300"
//         />
//         <select
//           name="status"
//           value={form.status}
//           onChange={handleChange}
//           className="border border-gray-300 p-3 rounded-md focus:ring focus:ring-blue-300"
//         >
//           <option value="active">Active</option>
//           <option value="inactive">Inactive</option>
//         </select>
//       </div>

//       <textarea
//         name="description"
//         value={form.description}
//         onChange={handleChange}
//         placeholder="Product Description (HTML allowed)"
//         rows={4}
//         className="w-full border border-gray-300 p-3 rounded-md focus:ring focus:ring-blue-300"
//       />

//       <div className="flex justify-end">
//         <button
//           onClick={handleAddProduct}
//           disabled={loading}
//           className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50"
//         >
//           Add Product
//         </button>
//       </div>

//       <hr className="my-6 border-gray-300" />

//       <div>
//         <h2 className="text-xl font-semibold mb-2">📄 Bulk Upload (Excel/CSV)</h2>
//         <input
//           type="file"
//           accept=".xlsx, .xls, .csv"
//           onChange={handleFileUpload}
//           disabled={loading}
//           className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//         />
//         <p className="text-sm text-gray-500 mt-2">
//           Required columns: <b>Handle, Title, Variant Price, Image Src, Body (HTML), Product Category, Type, Tags, Status</b>
//         </p>

//          {loading && (
//         <div className="text-blue-600 font-medium">Uploading... Please wait.</div>
//       )}
//       </div>
//     </div>
//   );
// }






"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import {
  addDoc,
  collection,
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { app } from "@/firebase/config";
import * as XLSX from "xlsx";
import Image from "next/image";

export default function AddProductPage() {
  const { user } = useAuth();
  const db = getFirestore(app);

  const [form, setForm] = useState({
    title: "",
    handle: "",
    price: "",
    image: "",
    category: "",
    description: "",
    type: "",
    tags: "",
    status: "active",
  });

  const [loading, setLoading] = useState(false);

  if (!user || user.email !== "shoppingwelcome17@gmail.com") {
    redirect("/");
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const cleanHTML = (raw) =>
    raw?.replace(/â€¢/g, "•").replace(/â€“/g, "-") || "";

  const saveProductToFirestore = async (product) => {
    const categorySlug = product.category;
    const categoryRef = doc(db, "categories", categorySlug);
    const catSnap = await getDoc(categoryRef);

    if (!catSnap.exists()) {
      await setDoc(categoryRef, { name: categorySlug });
    }

    const productRef = doc(collection(categoryRef, "products"), product.handle);
    await setDoc(productRef, {
      ...product,
      description: cleanHTML(product.description),
    });
  };

  const handleAddProduct = async () => {
    setLoading(true);
    try {
      await saveProductToFirestore(form);
      alert("✅ Product added successfully");
      setForm({
        title: "",
        handle: "",
        price: "",
        image: "",
        category: "",
        description: "",
        type: "",
        tags: "",
        status: "active",
      });
    } catch (err) {
      console.error(err);
      alert("❌ Error adding product");
    }
    setLoading(false);
  };

  const handleFileUpload = async (e) => {
    setLoading(true);
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      for (const item of jsonData) {
        const firstCategory = (item["Product Category"] || "general")
          .split(">")[0]
          .trim();

        const product = {
          title: item["Title"] || item["Product title"] || "Untitled",
          handle: item["Handle"],
          price: +item["Variant Price"] || 0,
          image: item["Image Src"],
          category: firstCategory,
          description: item["Body (HTML)"] || "",
          type: item["Type"] || "",
          tags: item["Tags"] || "",
          status: item["Status"] || "active",
        };

        if (product.handle) {
          await saveProductToFirestore(product);
        }
      }

      alert("✅ Bulk upload complete");
      setLoading(false);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📦 Add New Product</h1>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Product Title"
          className="input-style"
        />
        <input
          name="handle"
          value={form.handle}
          onChange={handleChange}
          placeholder="Unique Handle"
          className="input-style"
        />
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="input-style"
        />
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="input-style"
        />
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Main Category"
          className="input-style"
        />
        <input
          name="type"
          value={form.type}
          onChange={handleChange}
          placeholder="Sub-category / Type"
          className="input-style"
        />
        <input
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="Tags (comma separated)"
          className="input-style"
        />
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="input-style"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description (HTML supported)"
        className="input-style w-full h-32 mb-4"
      ></textarea>

      <button
        onClick={handleAddProduct}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        ➕ Add Product
      </button>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mb-4">📁 Bulk Upload (Excel/CSV)</h2>
      <input
        type="file"
        accept=".xlsx, .xls, .csv"
        onChange={handleFileUpload}
        disabled={loading}
        className="input-style"
      />
         {loading && (
        <p className="text-blue-600 font-medium mb-4">Uploading... Please wait.</p>
      )}
      <p className="text-sm text-gray-500 mt-2">
        Required columns: <b>Handle, Title, Variant Price, Image Src, Body (HTML), Product Category, Type, Tags, Status</b>
      </p>

      <style jsx>{`
        .input-style {
          border: 1px solid #ddd;
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          width: 100%;
          transition: all 0.2s;
        }
        .input-style:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 1px #3b82f6;
        }
      `}</style>
    </div>
  );
}
