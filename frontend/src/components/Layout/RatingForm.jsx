// RatingForm.jsx
import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { FiX, FiTrash2, FiUser } from 'react-icons/fi';
import axios from 'axios';

const RatingForm = ({ course, onClose }) => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const currentUserId = userInfo?._id;
  const isAdmin = userInfo?.role === 'admin';

  useEffect(() => {
    if (!course?._id) {
      setReviews([]);
      setReviewsLoading(false);
      setSubmitError('Invalid course. Please try again.');
      return;
    }
    fetchReviews();
  }, [course?._id]);

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/courses/${course._id}/reviews`);
      setReviews(res.data);
      setSubmitError('');
    } catch (error) {
      setReviews([]);
      setSubmitError('Failed to load reviews. Please try again later.');
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedRating) {
      setSubmitError('Please select a rating');
      return;
    }
    
    if (!reviewText.trim()) {
      setSubmitError('Please write a review');
      return;
    }

    const token = localStorage.getItem("userToken");
    if (!token) {
      setSubmitError("You must be logged in to submit a review.");
      return;
    }

    setLoading(true);
    setSubmitError('');
    

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/courses/${course._id}/reviews`,
        {
          rating: selectedRating,
          comment: reviewText.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
     
      
      setSelectedRating(0);
      setReviewText('');
      await fetchReviews();
      //if (onClose) onClose();
    } catch (error) {
      setSubmitError(error?.response?.data?.message || 'Failed to submit review');
      console.error("Failed to submit review", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      setSubmitError("You must be logged in to delete a review.");
      return;
    }
    
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }
    
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/courses/${course._id}/reviews/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchReviews();
    } catch (error) {
      setSubmitError(error?.response?.data?.message || 'Failed to delete review');
    }
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.classList.contains('modal-backdrop')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="modal-backdrop fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">
            Rate & Review
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            aria-label="Close modal"
          >
            <FiX className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Course Info */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">{course.name}</h4>
            <p className="text-sm text-gray-600">Share your experience with this course</p>
          </div>

          {/* Rating Form */}
          <form onSubmit={handleSubmit} className="space-y-6 mb-6">
            {/* Star Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Your Rating
              </label>
              <div className="flex justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelectedRating(star)}
                    className="p-1 hover:scale-110 transition-transform duration-200"
                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  >
                    <FaStar
                      className={`h-8 w-8 transition-colors duration-200 ${
                        selectedRating >= star ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {selectedRating > 0 && (
                <p className="text-center text-sm text-gray-600 mt-2">
                  You rated this course {selectedRating} star{selectedRating > 1 ? 's' : ''}
                </p>
              )}
            </div>

            {/* Review Text */}
            <div>
              <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                id="review"
                rows="4"
                placeholder="Share your thoughts about this course..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                maxLength="500"
              />
              <p className="text-xs text-gray-500 mt-1 text-right">
                {reviewText.length}/500
              </p>
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{submitError}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !selectedRating || !reviewText.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                'Submit Review'
              )}
            </button>
          </form>

          {/* Reviews Section */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <FiUser className="h-4 w-4 mr-2" />
              All Reviews ({reviews.length})
            </h4>
            {submitError && !loading && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-red-600">{submitError}</p>
              </div>
            )}
            {reviewsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading reviews...</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-60 overflow-y-auto">
                {reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                  </div>
                ) : (
                  reviews.map((review) => {
                    const canDelete = review.user?._id === currentUserId || isAdmin;
                    return (
                      <div key={review._id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                              {review.user?.name?.charAt(0) || 'U'}
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {review.user?.name || 'Anonymous'}
                            </span>
                          </div>
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(review._id)}
                              className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors duration-200"
                              aria-label="Delete review"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <div className="flex items-center space-x-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`h-3 w-3 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                          <span className="text-xs text-gray-500 ml-1">
                            {review.rating}/5
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingForm;
