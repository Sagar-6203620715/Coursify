// AI Course Recommendation — uses Claude API (Anthropic) via RAG-style context injection
// Flow: User query → Express backend → MongoDB courses → Claude API → ranked results
import React, { useState } from 'react';
import axios from 'axios';

const EXAMPLE_QUERIES = [
  'Best DSA course under ₹3000',
  'Top rated ML course for beginners',
  'Affordable English communication course',
];

const CourseFinder = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setRecommendations(null);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/ai/recommend`,
        { query: query.trim() }
      );
      setRecommendations(data.recommendations || []);
    } catch (err) {
      const msg = err.response?.data?.message;
      setError(msg && typeof msg === 'string' ? msg : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewCourse = (affiliate_link) => {
    const url = affiliate_link?.startsWith('http')
      ? affiliate_link
      : `https://${affiliate_link}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. I'm a beginner who wants to learn web development under ₹5000"
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none text-gray-900 placeholder-gray-400"
          disabled={loading}
        />
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_QUERIES.map((text) => (
            <button
              key={text}
              type="button"
              onClick={() => setQuery(text)}
              disabled={loading}
              className="px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {text}
            </button>
          ))}
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
        >
          Find My Course →
        </button>
      </form>

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-600 border-t-transparent"></div>
          <p className="text-gray-600">Finding best courses for you...</p>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {!loading && recommendations && recommendations.length > 0 && (
        <>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((course, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-indigo-100 hover:-translate-y-1 flex flex-col"
              >
                <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2">
                  {course.name}
                </h3>
                <div className="flex gap-4 text-sm text-gray-600 mb-3">
                  <span className="flex items-center gap-1">
                    ⭐ {course.rating ?? 'N/A'}
                  </span>
                  <span className="flex items-center gap-1">
                    💰 ₹{course.price?.toLocaleString('en-IN') ?? 'N/A'}
                  </span>
                </div>
                <p className="text-gray-500 text-sm italic flex-1 line-clamp-2 mb-4">
                  {course.reason}
                </p>
                <button
                  onClick={() => handleViewCourse(course.affiliate_link)}
                  className="w-full py-2.5 px-4 rounded-lg bg-indigo-100 text-indigo-700 font-medium hover:bg-indigo-200 transition-colors"
                >
                  View Course →
                </button>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-gray-500">
            Recommendations are AI-generated based on available courses.
          </p>
        </>
      )}

      {!loading && recommendations && recommendations.length === 0 && (
        <p className="mt-6 text-gray-500 text-center">
          No courses found. Try a different query.
        </p>
      )}
    </div>
  );
};

export default CourseFinder;
