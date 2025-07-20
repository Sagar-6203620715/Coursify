import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const useVisitorTracking = () => {
  const location = useLocation();
  const { user, guestId } = useSelector(state => state.auth);
  const sessionId = useRef(sessionStorage.getItem('sessionId') || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const currentVisitId = useRef(null);
  const pageStartTime = useRef(Date.now());
  const sessionStartTime = useRef(Date.now());
  const isTracking = useRef(false);
  const trackingInProgress = useRef(false);
  const sessionUpdateInterval = useRef(null);

  // Initialize session ID
  useEffect(() => {
    if (!sessionStorage.getItem('sessionId')) {
      sessionStorage.setItem('sessionId', sessionId.current);
    }
    
    // Clean up old tracking data (older than 1 hour)
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('tracked_')) {
        const timestamp = sessionStorage.getItem(key);
        if (timestamp && parseInt(timestamp) < oneHourAgo) {
          sessionStorage.removeItem(key);
        }
      }
    });
  }, []);

  // Update session time across all visits in this session
  const updateSessionTime = async () => {
    if (!sessionId.current) return;

    try {
      const totalSessionTime = Math.floor((Date.now() - sessionStartTime.current) / 1000);
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/visitors/update-session/${sessionId.current}`,
        { sessionTime: totalSessionTime }
      );
    } catch (error) {
      console.error('Failed to update session time:', error);
    }
  };

  // Track page visit
  const trackPageVisit = async (page, pageTitle) => {
    // Prevent multiple simultaneous tracking calls
    if (trackingInProgress.current) {
      return;
    }
    
    trackingInProgress.current = true;
    
    try {
      // Use a more robust deduplication key
      const trackingKey = `tracked_${sessionId.current}_${page}`;
      const lastTracked = sessionStorage.getItem(trackingKey);
      const now = Date.now();
      
      // Only track if we haven't tracked this page in the last 30 seconds
      if (lastTracked && (now - parseInt(lastTracked)) < 30000) {
        trackingInProgress.current = false;
        return;
      }
      
      const visitData = {
        page,
        pageTitle,
        sessionId: sessionId.current,
        guestId: guestId,
        userId: user?._id || null,
        timeOnPage: 0,
        sessionTime: Math.floor((now - sessionStartTime.current) / 1000),
        isBounce: true,
        converted: false,
        conversionType: ''
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/visitors/track`,
        visitData
      );

      if (response.data.success) {
        currentVisitId.current = response.data.visitorId;
        isTracking.current = true;
        pageStartTime.current = Date.now();
        
        // Mark this page as tracked for this session
        sessionStorage.setItem(trackingKey, now.toString());
      }
    } catch (error) {
      console.error('Failed to track page visit:', error);
    } finally {
      trackingInProgress.current = false;
    }
  };

  // Update visit with time on page and engagement data
  const updateVisit = async (timeOnPage, isBounce = false, converted = false, conversionType = '') => {
    if (!currentVisitId.current || !isTracking.current) return;

    try {
      const totalSessionTime = Math.floor((Date.now() - sessionStartTime.current) / 1000);
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/visitors/update/${currentVisitId.current}`,
        {
          timeOnPage,
          sessionTime: totalSessionTime,
          isBounce,
          converted,
          conversionType
        }
      );
    } catch (error) {
      console.error('Failed to update visit:', error);
    }
  };

  // Track conversion
  const trackConversion = (conversionType) => {
    if (!currentVisitId.current) return;
    
    const timeOnPage = Math.floor((Date.now() - pageStartTime.current) / 1000);
    updateVisit(timeOnPage, false, true, conversionType);
  };

  // Track page view on route change
  useEffect(() => {
    const page = location.pathname;
    const pageTitle = document.title || 'Course Comparator';

    // Update previous visit before tracking new one
    if (currentVisitId.current && isTracking.current) {
      const timeOnPage = Math.floor((Date.now() - pageStartTime.current) / 1000);
      updateVisit(timeOnPage, false);
    }

    // Only track new page visit if it's a different page or first visit
    const currentPage = sessionStorage.getItem('currentPage');
    if (currentPage !== page) {
      trackPageVisit(page, pageTitle);
      sessionStorage.setItem('currentPage', page);
    } else {
      // Same page refresh - just update the existing visit
      if (currentVisitId.current && isTracking.current) {
        const timeOnPage = Math.floor((Date.now() - pageStartTime.current) / 1000);
        updateVisit(timeOnPage, false);
      }
    }

    // Cleanup function to update visit when component unmounts
    return () => {
      if (currentVisitId.current && isTracking.current) {
        const timeOnPage = Math.floor((Date.now() - pageStartTime.current) / 1000);
        updateVisit(timeOnPage, false);
      }
    };
  }, [location.pathname, user?._id]); // Add user ID to dependencies to track when user logs in/out

  // Periodic session time updates (every 30 seconds)
  useEffect(() => {
    sessionUpdateInterval.current = setInterval(() => {
      if (isTracking.current) {
        updateSessionTime();
      }
    }, 30000); // Update every 30 seconds

    return () => {
      if (sessionUpdateInterval.current) {
        clearInterval(sessionUpdateInterval.current);
      }
    };
  }, []);

  // Track beforeunload to update final time on page and session
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentVisitId.current && isTracking.current) {
        const timeOnPage = Math.floor((Date.now() - pageStartTime.current) / 1000);
        const totalSessionTime = Math.floor((Date.now() - sessionStartTime.current) / 1000);
        
        // Use sendBeacon for more reliable tracking on page unload
        const data = JSON.stringify({
          timeOnPage,
          sessionTime: totalSessionTime,
          isBounce: false,
          converted: false,
          conversionType: ''
        });
        
        navigator.sendBeacon(
          `${import.meta.env.VITE_BACKEND_URL}/api/visitors/update/${currentVisitId.current}`,
          data
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Track visibility change to handle tab switching
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, update current visit and session
        if (currentVisitId.current && isTracking.current) {
          const timeOnPage = Math.floor((Date.now() - pageStartTime.current) / 1000);
          updateVisit(timeOnPage, false);
          updateSessionTime();
        }
      } else {
        // Page is visible again, reset page start time but keep session time
        pageStartTime.current = Date.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return {
    trackConversion,
    sessionId: sessionId.current,
    currentVisitId: currentVisitId.current
  };
};

export default useVisitorTracking; 