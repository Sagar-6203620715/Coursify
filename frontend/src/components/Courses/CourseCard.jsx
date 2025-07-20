import React, { useState } from 'react';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { FiExternalLink, FiClock, FiDollarSign, FiLock } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useVisitorTracking from '../../hooks/useVisitorTracking';

const formatDuration = ({ years, months }) => {
  const y = years ? `${years} year${years > 1 ? 's' : ''}` : '';
  const m = months ? `${months} month${months > 1 ? 's' : ''}` : '';
  return [y, m].filter(Boolean).join(' ') || 'Duration not specified';
};

const CourseCard = ({ course, onSelect }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const { trackConversion } = useVisitorTracking();

  // Debug: Log course data
  console.log('CourseCard - Full course object:', course);
  console.log('CourseCard - Affiliate link from course:', course.affiliate_link);
  console.log('CourseCard - User logged in:', !!user);

  // Calculate stars
  const fullStars = Math.floor(course.rating);
  const hasHalfStar = course.rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const handleAffiliateClick = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!user) {
      console.log('CourseCard - User not logged in, redirecting to login');
      navigate('/login?message=login-to-view-course');
      return;
    }
    
    setIsLoading(true);
    
    console.log('CourseCard - Affiliate link:', course.affiliate_link);
    console.log('CourseCard - Course ID:', course._id);
    
    try {
      // Track the click in the backend
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/courses/${course._id}/click`);
      console.log('Affiliate click tracked successfully');
      
      // Track conversion
      trackConversion('click');
      
      // Ensure the affiliate link is properly formatted
      let affiliateUrl = course.affiliate_link;
      if (affiliateUrl && !affiliateUrl.startsWith('http://') && !affiliateUrl.startsWith('https://')) {
        affiliateUrl = 'https://' + affiliateUrl;
        console.log('CourseCard - Normalized affiliate URL:', affiliateUrl);
      }
      
      // Open affiliate link in new tab
      window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Failed to track affiliate click:', error);
      // Still open the affiliate link even if tracking fails
      let affiliateUrl = course.affiliate_link;
      if (affiliateUrl && !affiliateUrl.startsWith('http://') && !affiliateUrl.startsWith('https://')) {
        affiliateUrl = 'https://' + affiliateUrl;
      }
      window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const defaultImage = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop";

  return (
    <div className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 h-full flex flex-col w-80 sm:w-96">
      {/* Course Image */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <img
          src={imageError ? defaultImage : (course.image?.url || defaultImage)}
          alt={course.image?.altText || course.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
          loading="lazy"
          decoding="async"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          onLoad={(e) => {
            // Optimize image loading
            if (e.target.complete) {
              e.target.style.opacity = '1';
            }
          }}
          style={{ opacity: 0, transition: 'opacity 0.3s ease-in-out' }}
        />
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3">
          <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
            {Array.from({ length: fullStars }).map((_, i) => (
              <FaStar key={`full-${i}`} className="text-xs text-yellow-500" />
            ))}
            {hasHalfStar && <FaStarHalfAlt className="text-xs text-yellow-500" />}
            {Array.from({ length: emptyStars }).map((_, i) => (
              <FaStar key={`empty-${i}`} className="text-xs text-gray-300" />
            ))}
            <span className="text-xs font-medium text-gray-700 ml-1">
              {course.rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Price Badge */}
        <div className="absolute top-3 left-3">
          <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            ₹{course.price?.toLocaleString() || 'Free'}
          </div>
        </div>



        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={handleAffiliateClick}
            disabled={isLoading}
            className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
            ) : (
              <FiExternalLink className="h-4 w-4" />
            )}
            <span>{isLoading ? 'Loading...' : 'View Course'}</span>
          </button>
        </div>
      </div>

      {/* Course Info */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
          {course.name}
        </h3>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <FiClock className="h-4 w-4 text-gray-400" />
            <span>{formatDuration(course.duration)}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <FiDollarSign className="h-4 w-4 text-gray-400" />
            <span className="font-medium text-green-600">
              ₹{course.price?.toLocaleString() || 'Free'}
            </span>
          </div>
        </div>

        {/* Domain/Section Info */}
        {(course.domain?.name || course.section?.name) && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex flex-wrap gap-1">
              {course.domain?.name && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {course.domain.name}
                </span>
              )}
              {course.section?.name && (
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                  {course.section.name}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Rating Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!user) {
              navigate('/login?message=login-to-rate-course');
              return;
            }
            onSelect(course);
          }}
          className="mt-auto w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <FaStar className="h-4 w-4 text-yellow-500" />
          <span>Rate this course</span>
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
