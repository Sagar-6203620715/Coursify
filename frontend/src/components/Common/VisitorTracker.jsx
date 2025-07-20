import React from 'react';
import useVisitorTracking from '../../hooks/useVisitorTracking';

const VisitorTracker = () => {
  // Initialize visitor tracking
  useVisitorTracking();
  
  // This component doesn't render anything
  return null;
};

export default VisitorTracker; 