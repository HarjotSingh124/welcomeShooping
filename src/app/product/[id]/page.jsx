"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import {
  collection,
  collectionGroup,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";


export default function ProductDetailPage() {
  const { id } = useParams(); // product handle / id
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

  const mainImageRef = useRef(null);



  useEffect(() => {
    if (!id) return;
    setLoading(true);

    (async () => {
      try {
        // Search product in collectionGroups "products" where handle or id matches
        const q = query(collectionGroup(db, "products"), where("handle", "==", id));
        const snapshot = await getDocs(q);

        // fallback: maybe doc id stored as `id`
        let prodDoc = null;
        if (!snapshot.empty) prodDoc = snapshot.docs[0];
        else {
          // try match by 'id' field (some setups store handle as id or vice versa)
          const q2 = query(collectionGroup(db, "products"), where("id", "==", id));
          const s2 = await getDocs(q2);
          if (!s2.empty) prodDoc = s2.docs[0];
        }

        if (!prodDoc) {
          // Optionally: try top-level products collection
          const q3 = query(collection(db, "products"), where("handle", "==", id));
          const s3 = await getDocs(q3);
          if (!s3.empty) prodDoc = s3.docs[0];
        }

        if (!prodDoc) {
          console.error("Product not found for id:", id);
          setProduct(null);
          setLoading(false);
          return;
        }
        

        const data = { id: prodDoc.id, ...prodDoc.data() };
        // Normalize images array
        const images = data.images || (data.image ? [data.image] : []);
        data.images = images;
        setProduct(data);
        setActiveImage(images[0] || null);

        // related products by category (simple fetch)
        if (data.category) {
          const relSnap = await getDocs(collectionGroup(db, "products"));
          const relList = relSnap.docs
            .map((d) => ({ id: d.id, ...d.data() }))
            .filter((p) => p.category === data.category && (p.handle || p.id) !== id)
            .slice(0, 8);
          setRelated(relList);
        }

      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Fetch reviews for this product
  useEffect(() => {
    if (!product) return;
    setReviewLoading(true);
    (async () => {
      try {
        // collection "reviews" with field productId equals product.handle or product.id
        const productKey = product.handle || product.id;
        const revCol = collection(db, "reviews");
        const q = query(revCol, where("productId", "==", productKey));
        const snap = await getDocs(q);
        const revs = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => b.createdAt?.toMillis?.() - a.createdAt?.toMillis?.());
        setReviews(revs);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setReviewLoading(false);
      }
    })();
  }, [product]);

  const avgRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return null;
    const sum = reviews.reduce((s, r) => s + (r.rating || 0), 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  // Add to cart
  const handleAddToCart = async () => {
    if (!product) return;
    // Build cart item shape consistent with your cart logic
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
    // Simple visual feedback: bump qty briefly or toast (not implemented here)
  };

  // Buy now: add to cart (one item), navigate to checkout
  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push("/checkout");
  };

  // Submit review
  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login to add a review.");
    if (!newReview.text.trim()) return alert("Please write a review.");
    setSubmittingReview(true);
    try {
      const productKey = product.handle || product.id;
      await addDoc(collection(db, "reviews"), {
        productId: productKey,
        userId: user.uid,
        userName: user.displayName || user.email,
        rating: Number(newReview.rating) || 5,
        text: newReview.text.trim(),
        createdAt: serverTimestamp(),
      });
      // Refresh reviews
      const revSnap = await getDocs(query(collection(db, "reviews"), where("productId", "==", productKey)));
      const revs = revSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setReviews(revs.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0)));
      setNewReview({ rating: 5, text: "" });
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Unable to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Image zoom style uses CSS - apply class to container
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
    return <div className="max-w-4xl mx-auto p-6 text-center text-red-600">Product not found.</div>;
  }

  const originalPrice = product.originalPrice ?? product.mrp ?? null; // try a few fields
  const discountedPrice = product.price;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: images */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white border rounded p-4">
            <div className="w-full h-[420px] md:h-[520px] flex items-center justify-center overflow-hidden rounded">
              {/* zoom on hover: wrapper */}
              <div
                className="relative w-full h-full overflow-hidden"
                style={{ willChange: "transform" }}
                ref={mainImageRef}
              >
                <img
                  src={activeImage || "/placeholder.png"}
                  alt={product.title}
                  className="w-full h-full object-contain transform transition-transform duration-500 hover:scale-110"
                />
              </div>
            </div>
          
            {/* thumbnails */}
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {(product.images || []).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => { setActiveImage(img); }}
                  className={`flex-none border rounded p-1 ${activeImage === img ? "ring-2 ring-[#BEB9B1]" : ""}`}
                >
                  <img src={img} alt={`thumb-${idx}`} className="w-20 h-20 object-contain" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: product details */}
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

          <div className="flex items-center gap-3">
         

            <button
              onClick={handleAddToCart}
              className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded"
            >
              Add to cart
            </button>

            <button
              onClick={handleBuyNow}
              className="px-6 py-2 bg-[#BEB9B1] hover:opacity-90 text-white font-semibold rounded"
            >
              Buy now
            </button>
          </div>

          {/* quick bullets */}
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
                      <div className="text-xs text-gray-500">{new Date(r.createdAt?.toDate ? r.createdAt.toDate() : (r.createdAt?.seconds || 0) * 1000).toLocaleDateString()}</div>
                    </div>
                    <div className="text-sm text-yellow-600">{"★".repeat(r.rating || 5)}</div>
                    <div className="text-sm text-gray-700 mt-1">{r.text}</div>
                  </div>
                ))}
              </div>

              {/* Add review form */}
              <div className="mt-4">
                <h4 className="font-medium mb-2">Write a review</h4>
                <form onSubmit={submitReview} className="space-y-2">
                  <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview((p) => ({ ...p, rating: e.target.value }))}
                    className="input w-full"
                  >
                    <option value={5}>5 - Excellent</option>
                    <option value={4}>4 - Very good</option>
                    <option value={3}>3 - Average</option>
                    <option value={2}>2 - Poor</option>
                    <option value={1}>1 - Terrible</option>
                  </select>
                  <textarea
                    value={newReview.text}
                    onChange={(e) => setNewReview((p) => ({ ...p, text: e.target.value }))}
                    className="input w-full"
                    rows={3}
                    placeholder="Write about your experience..."
                  />
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full px-3 py-2 bg-[#BEB9B1] text-white rounded font-medium"
                  >
                    {submittingReview ? "Submitting..." : (user ? "Submit Review" : "Login to review")}
                  </button>
                </form>
              </div>
            </>
          )}
        </aside>
      </div>

      {/* Related products */}
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

// "use client";
// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import ImageGallery from "@/components/product-detail/ImageGallery";
// import ProductInfo from "@/components/product-detail/ProductInfo";
// import Reviews from "@/components/product-detail/Reviews";
// import { fetchProductById, fetchReviews, addReview } from "@/firebase/products";

// export default function ProductDetailPage() {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const [reviews, setReviews] = useState([]);
//   const [selectedImage, setSelectedImage] = useState("");

//   useEffect(() => {
//     (async () => {
//       const prod = await fetchProductById(id);
//       if (prod) {
//         setProduct(prod);
//         setSelectedImage(prod.images?.[0] || "");
//         const revs = await fetchReviews(prod.id);
//         setReviews(revs);
//       }
//     })();
//   }, [id]);

//   const handleReviewSubmit = async (text, rating) => {
//     await addReview(product.id, text, rating);
//     const updated = await fetchReviews(product.id);
//     setReviews(updated);
//   };

//   if (!product) return <p className="p-6 text-gray-500">Loading...</p>;

//   return (
//     <div className="max-w-6xl mx-auto p-6 flex flex-col lg:flex-row gap-8">
//       <ImageGallery
//         images={product.images}
//         selectedImage={selectedImage}
//         setSelectedImage={setSelectedImage}
//         title={product.title}
//       />
//       <ProductInfo product={product} />
//       <Reviews reviews={reviews} onSubmit={handleReviewSubmit} />
//     </div>
//   );
// }