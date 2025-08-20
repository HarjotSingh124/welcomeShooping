"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  getActiveProductByHandle,
  getReviewsByProductKey,
  addReviewByProductKey,
  checkStockByHandle,
  getRelatedByCategory,
} from "@/firebase/products";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from '@/firebase/config';

export default function ProductDetailPage() {
  const { id } = useParams(); // product handle
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);
  const [qty, setQty] = useState(1);

  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, text: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

const incrementViewCount = async (category, handle) => {
  const productRef = doc(db, "categories", category, "products", handle);
  await updateDoc(productRef, {
    viewCount: increment(1),
  });
};


  useEffect(() => {
    if (!id) return;
    setLoading(true);

    (async () => {
      try {
        // get product by handle (only active returned)
        const prod = await getActiveProductByHandle(id);
        if (!prod) {
          setProduct(null);
          setLoading(false);
          return;
        }
        setProduct(prod);
        setActiveImage(prod.images?.[0] || prod.image || null);

        // reviews (top-level collection)
        setReviewLoading(true);
        const revs = await getReviewsByProductKey(prod.handle || prod.id);
        setReviews(revs || []);
        setReviewLoading(false);

        // stock
        const stock = await checkStockByHandle(prod.handle || prod.id);
        setProduct((p) => ({ ...prod, stock }));

        // related
        const rel = await getRelatedByCategory(prod.category, 8, prod.handle || prod.id);
        setRelated(rel);
      } catch (err) {
        console.error("Error loading product:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const avgRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return null;
    const sum = reviews.reduce((s, r) => s + (r.rating || 0), 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  const handleAddToCart = async () => {
    if (!product) return;
    const item = {
      id: product.id,
      handle: product.handle,
      title: product.title,
      price: product.price,
      image: product.images?.[0] || product.image || "",
      quantity: qty,
      stock: product.stock ?? null,
    };
    await addToCart(item);
    // optionally show a toast / animation here
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push("/checkout");
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login to add a review.");
    if (!newReview.text.trim()) return alert("Please write a review.");
    setSubmittingReview(true);
    try {
      const productKey = product.handle || product.id;
      await addReviewByProductKey(productKey, user.uid, user.displayName || user.email, Number(newReview.rating), newReview.text.trim());
      const revs = await getReviewsByProductKey(productKey);
      setReviews(revs);
      setNewReview({ rating: 5, text: "" });
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Unable to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-72 bg-gray-200 rounded" />
          <div className="h-6 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="max-w-4xl mx-auto p-6 text-center text-red-600">Product not found or inactive.</div>;
  }

  const originalPrice = product.originalPrice ?? product.mrp ?? null;
  const discountedPrice = product.price;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Images */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white border rounded p-4">
            <div className="w-full h-[420px] md:h-[520px] flex items-center justify-center overflow-hidden rounded">
              <img src={activeImage || "/placeholder.png"} alt={product.title} className="w-full h-full object-contain" />
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto">
              {(product.images || []).map((img, idx) => (
                <button key={idx} onClick={() => setActiveImage(img)} className={`flex-none border rounded p-1 ${activeImage === img ? "ring-2 ring-[#BEB9B1]" : ""}`}>
                  <img src={img} alt={`thumb-${idx}`} className="w-20 h-20 object-contain" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="w-full lg:w-1/2 space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold">{product.title}</h1>

          <div className="flex items-center gap-4">
            {avgRating ? (
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold">{avgRating}</span>
                <span className="text-gray-500">({reviews.length} reviews)</span>
              </div>
            ) : (
              <div className="text-sm text-gray-500">No reviews yet</div>
            )}
            <div className={`ml-4 px-2 py-1 rounded text-xs ${product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {product.stock > 0 ? `In stock (${product.stock})` : "Out of stock"}
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            {originalPrice && originalPrice > discountedPrice ? (
              <>
                <div className="text-xl md:text-2xl font-bold text-green-600">₹{discountedPrice}</div>
                <div className="text-sm text-gray-500 line-through">₹{originalPrice}</div>
                <div className="text-sm text-red-500 font-semibold">{Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)}% off</div>
              </>
            ) : (
              <div className="text-2xl font-bold text-green-600">₹{discountedPrice}</div>
            )}
          </div>

          <p className="text-sm text-gray-600">{product.type ? `Category: ${product.type}` : `Category: ${product.category || "N/A"}`}</p>
{(product.stock === null || product.stock > 0) && (
  <div className="flex items-center gap-3">
    <div className="flex items-center border rounded">
      <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2">−</button>
      <div className="px-4 py-2">{qty}</div>
      <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2">+</button>
    </div>

    <button onClick={handleAddToCart} className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded">Add to cart</button>
    <button onClick={handleBuyNow} className="px-6 py-2 bg-[#BEB9B1] hover:opacity-90 text-white font-semibold rounded">Buy now</button>
  </div>
)}
          <ul className="mt-4 text-sm list-disc list-inside text-gray-600 space-y-1">
            <li>Easy returns within 10 days</li>
            <li>Secure payment</li>
            <li>Fast delivery</li>
          </ul>
        </div>
      </div>

      {/* Description & Reviews */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-3">Product Description</h2>
          <div className="prose max-w-none text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: product.description || "<p>No description provided.</p>" }} />
        </div>

        <aside className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-3">Customer Reviews</h3>

          {reviewLoading ? (
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
            </div>
          ) : (
            <>
              <div className="mb-4">
                <div className="text-sm text-gray-600">{avgRating ? `${avgRating} out of 5` : "Be the first to review"}</div>
                <div className="text-xs text-gray-500">{reviews.length} reviews</div>
              </div>

              <div className="space-y-3 max-h-64 overflow-auto pr-2">
                {reviews.length === 0 && <div className="text-sm text-gray-500">No reviews yet.</div>}
                {reviews.map((r) => (
                  <div key={r.id} className="border-b pb-2">
                    <div className="flex justify-between items-center">
                      <div className="font-medium text-sm">{r.userName || "Anonymous"}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(r.createdAt?.toDate ? r.createdAt.toDate() : (r.createdAt?.seconds || 0) * 1000).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-sm text-yellow-600">{"★".repeat(r.rating || 5)}</div>
                    <div className="text-sm text-gray-700 mt-1">{r.text || r.comment}</div>
                  </div>
                ))}
              </div>

              {/* Add review form */}
              <div className="mt-4">
                <h4 className="font-medium mb-2">Write a review</h4>
                <form onSubmit={submitReview} className="space-y-2">
                  <select value={newReview.rating} onChange={(e) => setNewReview((p) => ({ ...p, rating: e.target.value }))} className="input w-full">
                    <option value={5}>5 - Excellent</option>
                    <option value={4}>4 - Very good</option>
                    <option value={3}>3 - Average</option>
                    <option value={2}>2 - Poor</option>
                    <option value={1}>1 - Terrible</option>
                  </select>
                  <textarea value={newReview.text} onChange={(e) => setNewReview((p) => ({ ...p, text: e.target.value }))} className="input w-full" rows={3} placeholder="Write about your experience..." />
                  <button type="submit" disabled={submittingReview} className="w-full px-3 py-2 bg-[#BEB9B1] text-white rounded font-medium">
                    {submittingReview ? "Submitting..." : (user ? "Submit Review" : "Login to review")}
                  </button>
                </form>
              </div>
            </>
          )}
        </aside>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Related Products</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <a key={p.id} href={`/product/${p.handle || p.id}`} className="block bg-white rounded p-3 shadow hover:shadow-md">
                <img src={p.images?.[0] || p.image || "/placeholder.png"} alt={p.title} className="object-contain w-full h-36 mb-2" />
                <div className="font-medium text-sm truncate">{p.title}</div>
                <div className="text-sm text-green-600">₹{p.price}</div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}