import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminCourses, deleteCourse, clearError } from '../../redux/slices/adminCourseSlice';
import CourseRow from './CourseRow';

const CourseManagement = () => {
  const dispatch = useDispatch();
  const { courses, loading, error } = useSelector(state => state.adminCourses);

  useEffect(() => {
    dispatch(fetchAdminCourses());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      dispatch(deleteCourse(id));
    }
  };

  const handleRetry = () => {
    dispatch(clearError());
    dispatch(fetchAdminCourses());
  };

  if (error && error.includes('Access denied')) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-red-800 mb-4">Access Denied</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-600 mb-6">
            You need administrator privileges to access this page. Please contact your system administrator 
            to grant you admin access, or use an account that has admin privileges.
          </p>
          <div className="space-x-4">
            <button 
              onClick={handleRetry}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Retry
            </button>
            <Link 
              to="/"
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Course Management</h2>
      {loading && <div className="text-center py-4">Loading...</div>}
      {error && !error.includes('Access denied') && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={handleRetry}
            className="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      )}
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Section</th>
              <th className="py-3 px-4">Domain</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.length > 0 ? (
              courses.map((course) => (
                <CourseRow key={course._id} course={course} onDelete={handleDelete}/>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">No courses found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-6">
        <Link to="/admin/courses/new" className="bg-blue-600 text-white px-4 py-2 rounded">Add New Course</Link>
      </div>
    </div>
  );
};

export default CourseManagement;