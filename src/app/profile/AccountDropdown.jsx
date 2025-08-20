"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { IoPerson } from "react-icons/io5";

export default function AccountDropdown() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Account Button */}
      <button
        className="px-4 py-2 hover:bg-gray-200 rounded text-black"
        onClick={() => setOpen(!open)}
      >
        <IoPerson className="inline-block mr-2" />
        {user ? ` ${"Account"}` : "Login"}
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0  w-48 bg-white text-black rounded shadow-lg z-50">
          {user ? (
            <>
              <Link href="/my-order" className="block px-4 py-2 hover:bg-gray-100">
                My Orders
              </Link>
              <Link href="/profile/account" className="block px-4 py-2 hover:bg-gray-100">
                Account
              </Link>
              <Link href="/profile/wishlist" className="block px-4 py-2 hover:bg-gray-100">
                Wishlist
              </Link>
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="block px-4 py-2 hover:bg-gray-100">
              Sign In
            </Link>
          )}
        </div>
      )}
    </div>
  );
}