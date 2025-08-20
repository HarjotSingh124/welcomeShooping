"use client";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 ">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        
        {/* About */}
        <div>
          <h3 className="text-white font-semibold mb-3">About</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-white">Our Story</Link></li>
            <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
            <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h3 className="text-white font-semibold mb-3">Help</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
            <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
            <li><Link href="/returns" className="hover:text-white">Returns</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-white font-semibold mb-3">Shop</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/categories/electronics" className="hover:text-white">Electronics</Link></li>
            <li><Link href="/categories/fashion" className="hover:text-white">Fashion</Link></li>
            <li><Link href="/categories/home" className="hover:text-white">Home & Living</Link></li>
          </ul>
        </div>

        {/* Policy */}
        <div>
          <h3 className="text-white font-semibold mb-3">Policy</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms & Conditions</Link></li>
            <li><Link href="/shipping" className="hover:text-white">Shipping Policy</Link></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-white font-semibold mb-3">Follow Us</h3>
          <div className="flex space-x-4">
            <Link href="https://facebook.com" target="_blank" className="hover:text-white"><Facebook size={20} /></Link>
            <Link href="https://instagram.com" target="_blank" className="hover:text-white"><Instagram size={20} /></Link>
            <Link href="https://twitter.com" target="_blank" className="hover:text-white"><Twitter size={20} /></Link>
            <Link href="https://youtube.com" target="_blank" className="hover:text-white"><Youtube size={20} /></Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} YourStore. All rights reserved.
      </div>
    </footer>
  );
}