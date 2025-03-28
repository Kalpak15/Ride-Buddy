import React from 'react';
import { Star, Clock, ThumbsUp, Car, MessageCircle } from 'lucide-react';

interface Rating {
  punctuality: number;
  safety: number;
  cleanliness: number;
  communication: number;
}

interface Review {
  id: string;
  rating: Rating;
  review: string;
  userName: string;
  userImage: string;
  createdAt: string;
}

interface RideRatingDisplayProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

const RideRatingDisplay: React.FC<RideRatingDisplayProps> = ({
  reviews,
  averageRating,
  totalReviews,
}) => {
  const getCriteriaIcon = (criteria: keyof Rating) => {
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

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
            fill={star <= rating ? 'currentColor' : 'none'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      {/* Overall Rating Summary */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Rider Reviews</h2>
          <p className="text-gray-600">{totalReviews} reviews</p>
        </div>
        <div className="text-center">
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold text-gray-800">
              {averageRating.toFixed(1)}
            </span>
            <Star size={24} className="text-yellow-400" fill="currentColor" />
          </div>
          <p className="text-sm text-gray-600">Average rating</p>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border-b border-gray-200 pb-6 last:border-0"
          >
            {/* Review Header */}
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={review.userImage}
                alt={review.userName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-medium text-gray-800">{review.userName}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Rating Criteria */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {Object.entries(review.rating).map(([criteria, rating]) => (
                <div
                  key={criteria}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded"
                >
                  <div className="flex items-center space-x-2">
                    {getCriteriaIcon(criteria as keyof Rating)}
                    <span className="text-sm text-gray-700 capitalize">
                      {criteria}
                    </span>
                  </div>
                  {renderStars(rating)}
                </div>
              ))}
            </div>

            {/* Review Text */}
            {review.review && (
              <p className="text-gray-700 mt-2">{review.review}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RideRatingDisplay;