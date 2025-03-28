import React, { useState } from 'react';
import { Star, Clock, ThumbsUp, Car, MessageCircle } from 'lucide-react';

interface RatingCriteria {
  punctuality: number;
  safety: number;
  cleanliness: number;
  communication: number;
}

interface RideRatingProps {
  rideId: string;
  driverId: string;
  onSubmit: (rating: RatingCriteria, review: string) => void;
}

const RideRating: React.FC<RideRatingProps> = ({ rideId, driverId, onSubmit }) => {
  const [rating, setRating] = useState<RatingCriteria>({
    punctuality: 0,
    safety: 0,
    cleanliness: 0,
    communication: 0,
  });
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingChange = (criteria: keyof RatingCriteria, value: number) => {
    setRating(prev => ({
      ...prev,
      [criteria]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(rating, review);
      // Reset form after successful submission
      setRating({
        punctuality: 0,
        safety: 0,
        cleanliness: 0,
        communication: 0,
      });
      setReview('');
    } catch (error) {
      console.error('Failed to submit rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (criteria: keyof RatingCriteria) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(criteria, star)}
            className={`focus:outline-none ${
              star <= rating[criteria]
                ? 'text-yellow-400'
                : 'text-gray-300'
            }`}
          >
            <Star
              size={24}
              fill={star <= rating[criteria] ? 'currentColor' : 'none'}
            />
          </button>
        ))}
      </div>
    );
  };

  const getCriteriaIcon = (criteria: keyof RatingCriteria) => {
    switch (criteria) {
      case 'punctuality':
        return <Clock className="text-blue-500" size={20} />;
      case 'safety':
        return <ThumbsUp className="text-green-500" size={20} />;
      case 'cleanliness':
        return <Car className="text-purple-500" size={20} />;
      case 'communication':
        return <MessageCircle className="text-orange-500" size={20} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Rate Your Ride</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating Criteria */}
        <div className="space-y-4">
          {Object.keys(rating).map((criteria) => (
            <div
              key={criteria}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                {getCriteriaIcon(criteria as keyof RatingCriteria)}
                <span className="text-gray-700 font-medium capitalize">
                  {criteria}
                </span>
              </div>
              {renderStars(criteria as keyof RatingCriteria)}
            </div>
          ))}
        </div>

        {/* Written Review */}
        <div>
          <label
            htmlFor="review"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Write your review
          </label>
          <textarea
            id="review"
            rows={4}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Share your experience with other riders..."
          />
        </div>

        {/* Average Rating Display */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800">
              Average Rating
            </span>
            <div className="flex items-center space-x-1">
              <Star
                size={20}
                className="text-yellow-400"
                fill="currentColor"
              />
              <span className="text-lg font-bold text-blue-800">
                {(
                  Object.values(rating).reduce((a, b) => a + b, 0) /
                  Object.values(rating).length
                ).toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Rating'}
        </button>
      </form>
    </div>
  );
};

export default RideRating;