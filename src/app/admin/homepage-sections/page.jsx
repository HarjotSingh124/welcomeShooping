
// "use client";
// import { useEffect, useState } from "react";
// import {
//   fetchHomepageSections,
//   addHomepageSection,
//   updateHomepageSection,
//   deleteHomepageSection,
// } from "@/firebase/homepageSections";

// export default function HomepageSectionsAdmin() {
//   const [sections, setSections] = useState([]);
//   const [form, setForm] = useState({
//     title: "",
//     icon: "",
//     category: "",
//     enabled: true,
//     order: 0,
//     limit: 8,
//   });
//   const [editId, setEditId] = useState(null);

//   useEffect(() => {
//     fetchHomepageSections().then(setSections);
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm({ ...form, [name]: type === "checkbox" ? checked : value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (editId) {
//       await updateHomepageSection(editId, form);
//       alert("Section updated!");
//     } else {
//       await addHomepageSection(form);
//       alert("Section added!");
//     }

//     setForm({
//       title: "",
//       icon: "",
//       category: "",
//       enabled: true,
//       order: 0,
//       limit: 8,
//     });
//     setEditId(null);
//     fetchHomepageSections().then(setSections);
//   };

//   const handleEdit = (section) => {
//     setForm({ ...section });
//     setEditId(section.id);
//   };

//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this section?");
//     if (!confirmDelete) return;

//     await deleteHomepageSection(id);
//     fetchHomepageSections().then(setSections);
//   };

//   return (
//     <div className="max-w-xl mx-auto p-6 space-y-6">
//       <h2 className="text-xl font-bold">{editId ? "Edit Homepage Section" : "Add Homepage Section"}</h2>

//       <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
//         <input name="title" value={form.title} onChange={handleChange} placeholder="Title (e.g. Fashion Picks)" className="input w-full" />
//         <input name="icon" value={form.icon} onChange={handleChange} placeholder="Icon (e.g. 👕)" className="input w-full" />
//         <input name="category" value={form.category} onChange={handleChange} placeholder="Category slug (e.g. fashion)" className="input w-full" />
//         <input name="order" type="number" value={form.order} onChange={handleChange} placeholder="Display Order" className="input w-full" />
//         <input name="limit" type="number" value={form.limit} onChange={handleChange} placeholder="Product Limit" className="input w-full" />
//         <label className="flex items-center gap-2">
//           <input type="checkbox" name="enabled" checked={form.enabled} onChange={handleChange} />
//           Enabled
//         </label>
//         <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
//           {editId ? "Update Section" : "Add Section"}
//         </button>
//       </form>

//       <div>
//         <h3 className="text-lg font-semibold mt-6">Current Sections</h3>
//         <ul className="mt-2 space-y-2">
//           {sections.map((sec) => (
//             <li key={sec.id} className="bg-gray-100 p-3 rounded flex justify-between items-center">
//               <div>
//                 <strong>{sec.icon} {sec.title}</strong><br />
//                 <span className="text-sm text-gray-600">
//                   {sec.category} | Order: {sec.order} | Limit: {sec.limit} | {sec.enabled ? "✅" : "❌"}
//                 </span>
//               </div>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => handleEdit(sec)}
//                   className="text-sm px-3 py-1 bg-yellow-500 text-white rounded"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(sec.id)}
//                   className="text-sm px-3 py-1 bg-red-600 text-white rounded"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }
// File: src/app/admin/homepageSections/page.jsx

"use client";
import { useEffect, useState } from "react";
import {
  fetchHomepageSections,
  addHomepageSection,
  updateHomepageSection,
  deleteHomepageSection,
} from "@/firebase/homepageSections";
import { fetchAllCategories } from "@/firebase/categories";

export default function HomepageSectionsAdmin() {
  const [sections, setSections] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [form, setForm] = useState({
    type: "productRow",
    title: "",
    icon: "",
    category: "",
    enabled: true,
    order: 0,
    limit: 8,
    images: [],
    image: "",
    categories: [],
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchHomepageSections().then(setSections);
    fetchAllCategories().then(setAllCategories);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "images") {
      setForm({ ...form, images: value.split(",").map((img) => img.trim()) });
    } else {
      setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sectionData = { ...form };

    if (form.type !== "productRow") {
      delete sectionData.category;
      delete sectionData.limit;
    }
    if (form.type !== "hero") delete sectionData.images;
    if (form.type !== "banner") delete sectionData.image;
    if (form.type !== "categoryGrid") delete sectionData.categories;

    if (editId) {
      await updateHomepageSection(editId, sectionData);
      alert("Section updated!");
    } else {
      await addHomepageSection(sectionData);
      alert("Section added!");
    }

    setForm({
      type: "productRow",
      title: "",
      icon: "",
      category: "",
      enabled: true,
      order: 0,
      limit: 8,
      images: [],
      image: "",
      categories: [],
    });
    setEditId(null);
    fetchHomepageSections().then(setSections);
  };

  const handleEdit = (section) => {
    setForm({ ...section });
    setEditId(section.id);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this section?");
    if (!confirmDelete) return;
    await deleteHomepageSection(id);
    fetchHomepageSections().then(setSections);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h2 className="text-xl font-bold">{editId ? "Edit Homepage Section" : "Add Homepage Section"}</h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
        <select name="type" value={form.type} onChange={handleChange} className="input w-full">
          <option value="productRow">Product Row</option>
          <option value="hero">Hero Carousel</option>
          <option value="banner">Banner</option>
          <option value="categoryGrid">Category Grid</option>
        </select>

        <input name="title" value={form.title} onChange={handleChange} placeholder="Title (e.g. Fashion Picks)" className="input w-full" />
        <input name="icon" value={form.icon} onChange={handleChange} placeholder="Icon (e.g. 🛒)" className="input w-full" />

        {/* Conditional Inputs */}
        {form.type === "productRow" && (
          <>
            <input name="category" value={form.category} onChange={handleChange} placeholder="Category slug (e.g. fashion)" className="input w-full" />
            <input name="limit" type="number" value={form.limit} onChange={handleChange} placeholder="Product Limit" className="input w-full" />
          </>
        )}

        {form.type === "hero" && (
          <textarea
            name="images"
            value={form.images.join(", ")}
            onChange={handleChange}
            placeholder="Comma-separated image URLs"
            className="input w-full"
          />
        )}

        {form.type === "banner" && (
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="Banner image URL"
            className="input w-full"
          />
        )}

        {form.type === "categoryGrid" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Categories</label>
            <select
              multiple
              value={form.categories}
              onChange={(e) =>
                setForm({
                  ...form,
                  categories: Array.from(e.target.selectedOptions, (option) => option.value),
                })
              }
              className="input w-full h-40"
            >
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl (Cmd on Mac) to select multiple</p>
          </div>
        )}

        <input name="order" type="number" value={form.order} onChange={handleChange} placeholder="Display Order" className="input w-full" />

        <label className="flex items-center gap-2">
          <input type="checkbox" name="enabled" checked={form.enabled} onChange={handleChange} />
          Enabled
        </label>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editId ? "Update Section" : "Add Section"}
        </button>
      </form>

      <div>
        <h3 className="text-lg font-semibold mt-6">Current Sections</h3>
        <ul className="mt-2 space-y-2">
          {sections.map((sec) => (
            <li key={sec.id} className="bg-gray-100 p-3 rounded flex justify-between items-center">
              <div>
                <strong>{sec.icon} {sec.title}</strong><br />
                <span className="text-sm text-gray-600">
                  {sec.type} | {sec.category || "-"} | Order: {sec.order} | {sec.enabled ? "✅" : "❌"}
                </span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(sec)} className="text-sm px-3 py-1 bg-yellow-500 text-white rounded">Edit</button>
                <button onClick={() => handleDelete(sec.id)} className="text-sm px-3 py-1 bg-red-600 text-white rounded">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
