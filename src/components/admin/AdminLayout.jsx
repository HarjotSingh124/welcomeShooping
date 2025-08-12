"use client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import "@/app/globals.css";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-6">{children}</main>
    </div>
  );
}