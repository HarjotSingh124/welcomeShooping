"use client";

import { usePathname } from "next/navigation";
import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "./globals.css";
import Footer from "../components/Footer";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-white text-gray-900 font-sans antialiased">
        <AuthProvider>
          <CartProvider>
            {!isAdminRoute && <Navbar />}
            <main className="pt-28">{children}</main>
            {!isAdminRoute && <Footer />}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}