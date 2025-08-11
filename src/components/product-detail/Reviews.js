"use client";
import { useState } from "react";

export default function Reviews({ reviews, onSubmit }) {
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = () => {
    if (!newReview.trim()) return;
    onSubmit(newReview, rating);
    setNewReview("");
    setRating(0);
  };

  return (
    <div className="mt-12 w-full">
      <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
      {reviews.length > 0 ? (
        reviews.map((rev) => (
          <div key={rev.id} className="border-b py-2">
            <p className="text-sm">Rating: {rev.rating} ★</p>
            <p>{rev.text}</p>
          </div>
        ))
      ) : (
        <p>No reviews yet.</p>
      )}
      <div className="mt-4">
        <textarea
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          className="w-full border rounded p-2"
          placeholder="Write your review..."
        />
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border rounded p-2 w-20 mt-2"
          placeholder="Rating"
        />
        <button
          onClick={handleSubmit}
          className="ml-2 bg-green-600 text-white px-4 py-2 rounded"
        >
          Submit Review
        </button>
      </div>
    </div>
  );
}