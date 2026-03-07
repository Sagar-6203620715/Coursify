// pages/Home.jsx
import React, { useEffect, useState } from 'react';
import Hero from '../components/Layout/Hero';
import CourseFinder from '../components/AI/CourseFinder';
import DomainCourses from '../components/Courses/DomainCourses';
import LoadMore from '../components/Common/LoadMore';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSections } from '../redux/slices/sectionsSlice';
import { fetchDomainsBySection } from '../redux/slices/domainsSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { sections, loading, error } = useSelector(state => state.sections);
  const { domains } = useSelector(state => state.domains);

  useEffect(() => {
    dispatch(fetchSections());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Hero />

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
          Find Your Perfect Course with AI
        </h2>
        <CourseFinder />
      </section>
      
      {sections.length === 0 ? (
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No courses available</h2>
            <p className="text-gray-600">Check back later for new courses!</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {sections.map(section => (
            <div key={section._id} className="container mx-auto px-4">
              <DynamicDomains sectionName={section.name} />
              <LoadMore x={section.name} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DynamicDomains = ({ sectionName }) => {
  const dispatch = useDispatch();
  const [firstDomain, setFirstDomain] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('Home - Fetching domains for section:', sectionName);
        const res = await dispatch(fetchDomainsBySection(sectionName));
        console.log('Home - Domains response:', res.payload);
        if (res.payload && res.payload.length > 0) {
          const domain = res.payload[0];
          console.log('Home - Selected domain:', domain);
          console.log('Home - Domain ID:', domain._id);
          console.log('Home - Domain Name:', domain.name);
          setFirstDomain(domain);
        } else {
          console.log('Home - No domains found for section:', sectionName);
        }
      } catch (err) {
        setError('Failed to load domains');
        console.error('Error fetching domains:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDomains();
  }, [dispatch, sectionName]);

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <div className="text-center">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!firstDomain) {
    return null;
  }

  return <DomainCourses domain={firstDomain} />;
};

export default Home;
