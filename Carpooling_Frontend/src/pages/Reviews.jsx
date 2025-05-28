import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Reviews() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState('');
  const [reviews, setReviews] = useState([]);
  const PORT=import.meta.env.VITE_API_URL
  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${PORT}/api/v1/reviews/get-reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const user_id = JSON.parse(atob(token.split('.')[1])).user_id; 
    try {
      await axios.post(
        `${PORT}/api/v1/reviews/post-review`,
        { user_id, title, content, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Review posted successfully!');
      fetchReviews(); // Refresh the reviews list
    } catch (error) {
      console.error('Error posting review:', error);
      alert('Failed to post review');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <h1 className="text-3xl font-bold mb-5">Post a Review</h1>
      <form onSubmit={handleSubmit} className="bg-white p-5 rounded shadow-md space-y-3">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <textarea
          placeholder="Your review"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <input
          type="number"
          placeholder="Rating (1-5)"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="border p-2 w-full"
          min="1"
          max="5"
          required
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Submit
        </button>
      </form>

      <h2 className="text-2xl font-bold mt-10 mb-5">User Reviews</h2>
      <div className="space-y-3">
        {reviews.map((review) => (
          <div key={review._id} className="bg-white p-3 rounded shadow">
            <h3 className="text-xl font-bold">{review.title}</h3>
            <p className="text-gray-700">{review.content}</p>
            <p className="text-gray-500">Rating: {review.rating} ★</p>
            <p className="text-gray-400 text-sm">Posted by: {review.userId?.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reviews;
