"use client";
import { usePathname } from "next/navigation";
import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "./globals.css";
import Footer from "../components/Footer"; // Import Footer component

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
<html lang="en">
  <body >
        <AuthProvider>
          <CartProvider>
            {!isAdminRoute && <Navbar />}
            <main>{children}</main>
            <Footer /> 
          </CartProvider>
        </AuthProvider>
        </body>
</html>
  );
}