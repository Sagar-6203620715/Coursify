import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UserLayout from "./components/Layout/UserLayout";
import Home from "./pages/Home"
import { Toaster } from "sonner"
import Login from './pages/Login';
import Register from './pages/Register';
import Tech from './pages/Tech';
import CompetitiveExams from './pages/CompetitiveExams';
import Skills from './pages/Skills';
import School from './pages/School';
import Contact from './pages/Contact';
import About from './pages/About';
import Features from './pages/Features';
import FAQs from './pages/FAQs';
import NotFound from './pages/NotFound';
import AdminLayout from './components/Admin/AdminLayout';
import AdminHomePage from './pages/AdminHomePage';
import SearchResults from './pages/SearchResults';
import DomainAllCourses from './pages/DomainAllCourses';
import UserManagement from './components/Admin/UserManagement';
import CourseManagement from './components/Admin/CourseManagement';
import EditCoursePage from './components/Admin/EditCoursePage';
import SectionManagement from './components/Admin/SectionManagement';
import DomainManagement from './components/Admin/DomainManagement';
import VisitorAnalytics from './components/Admin/VisitorAnalytics';
import VisitorList from './components/Admin/VisitorList';
import { Provider } from "react-redux";
import store from "./redux/store";
import ErrorBoundary from "./components/Common/ErrorBoundary";
import ProtectedAdminRoute from './components/Admin/ProtectedAdminRoute';
import NotAuthorized from './pages/NotAuthorized';
import VisitorTracker from './components/Common/VisitorTracker';

const App = () => {
  const [backendHealthy, setBackendHealthy] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/health`);
        const data = await response.json();
        setBackendHealthy(data.status === "ok");
      } catch (error) {
        console.error('Backend health check failed:', error);
        setBackendHealthy(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkBackendHealth();
    
    // Check backend health every 30 seconds
    const interval = setInterval(checkBackendHealth, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <VisitorTracker />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
          
          {!backendHealthy && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center text-sm md:text-base">
              <strong className="font-bold">Warning: </strong>
              <span className="block sm:inline">Backend API is not reachable or unhealthy. Some features may not work properly.</span>
            </div>
          )}
          
          <Routes>
            <Route path="/" element={<UserLayout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="/tech" element={<Tech />} />
              <Route path="/competitive_exams" element={<CompetitiveExams />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/school" element={<School />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/features" element={<Features />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/domain/:domainId/courses" element={<DomainAllCourses />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="/not-authorized" element={<NotAuthorized />} />
            <Route path="/admin/*" element={<ProtectedAdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminHomePage />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="courses" element={<CourseManagement />} />
                <Route path="courses/new" element={<EditCoursePage />} />
                <Route path="courses/:id/edit" element={<EditCoursePage />} />
                <Route path="sections" element={<SectionManagement />} />
                <Route path="domains" element={<DomainManagement />} />
                <Route path="visitors" element={<VisitorAnalytics />} />
                <Route path="visitors/list" element={<VisitorList />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;