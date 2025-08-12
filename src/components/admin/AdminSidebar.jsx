"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaTachometerAlt,
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaChevronDown,
} from "react-icons/fa";
import { Home, ShoppingCart, Box, Users, LayoutDashboard } from "lucide-react";


export default function AdminSidebar() {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <div className="h-screen w-64 bg-white shadow-lg flex flex-col fixed left-0 top-0">
      <div className="px-6 py-4 font-bold text-lg border-b">
        Admin Dashboard
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1 px-2">
          <li>
            <Link
              href="/admin"
              className="flex items-center px-4 py-2 rounded hover:bg-gray-100 cursor-pointer"
            >
              <FaTachometerAlt className="mr-3 text-gray-600" /> Dashboard
            </Link>
          </li>
        
     <Link href="/admin/homepage-sections" className="flex items-center px-4 py-2 rounded hover:bg-gray-100 p-2 cursor-pointer">
          <LayoutDashboard size={20} />
          Homepage
        </Link>
          <li></li>
          <li>
            <div
              onClick={() => toggleMenu("products")}
              className="flex justify-between items-center px-4 py-2 rounded hover:bg-gray-100 cursor-pointer"
            >
              <span className="flex items-center">
                <FaBox className="mr-3 text-gray-600" /> Products
              </span>
              <FaChevronDown
                className={`transition-transform duration-200 ${
                  openMenu === "products" ? "rotate-180" : ""
                }`}
              />
            </div>
            {openMenu === "products" && (
              <ul className="ml-8 space-y-1 text-sm text-gray-700">
                <li>
                  <Link href="/admin/category" className="block px-2 py-1 hover:bg-gray-50 rounded">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/admin/add-product" className="block px-2 py-1 hover:bg-gray-50 rounded">
                    Add Product
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <Link
              href="/admin/orders"
              className="flex items-center px-4 py-2 rounded hover:bg-gray-100 cursor-pointer"
            >
              <FaShoppingCart className="mr-3 text-gray-600" /> Orders
            </Link>
          </li>

          <li>
            <Link
              href="/admin/customers"
              className="flex items-center px-4 py-2 rounded hover:bg-gray-100 cursor-pointer"
            >
              <FaUsers className="mr-3 text-gray-600" /> Customers
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}