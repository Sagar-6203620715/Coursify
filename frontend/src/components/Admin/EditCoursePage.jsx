import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchSections } from '../../redux/slices/sectionsSlice';
import { createCourse, updateCourse, fetchAdminCourses } from '../../redux/slices/adminCourseSlice';
import { fetchAllDomains } from '../../redux/slices/domainsSlice';
import axios from 'axios';

const EditCoursePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { courses, loading, error } = useSelector(state => state.adminCourses);
  const { sections } = useSelector(state => state.sections);
  const { domains } = useSelector(state => state.domains);

  const [courseData, setCourseData] = useState({
    name: '',
    price: '',
    image: '',
    duration: { years: 0, months: 0 },
    affiliate_link: '',
    rating: 0,
    domain: '',
    section: '',
    dimensions: '',
    weight: ''
  });

  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    dispatch(fetchSections());
    dispatch(fetchAllDomains());
    if (isEdit) {
      dispatch(fetchAdminCourses());
    }
  }, [dispatch, isEdit]);

  useEffect(() => {
    if (isEdit && courses.length > 0) {
      const course = courses.find(c => c._id === id);
      if (course) {
        setCourseData({ 
          ...course, 
          image: course.image?.url || course.image || '',
          section: course.section?._id || course.section || '' 
        });
      }
    }
  }, [isEdit, courses, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'years' || name === 'months') {
      setCourseData(prev => ({ ...prev, duration: { ...prev.duration, [name]: Number(value) } }));
    } else {
      setCourseData(prev => ({ ...prev, [name]: name === 'price' || name === 'rating' ? Number(value) : value }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setCourseData(prev => ({ ...prev, image: response.data.imageUrl }));
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Failed to upload image');
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!courseData.name || !courseData.price || !courseData.domain || !courseData.section) {
      alert('Please fill in all required fields: Name, Price, Domain, and Section');
      return;
    }
    // Validate affiliate link
    let affiliateLink = courseData.affiliate_link.trim();
    if (affiliateLink && !/^https?:\/\//i.test(affiliateLink)) {
      affiliateLink = 'https://' + affiliateLink;
    }
    const submitData = { ...courseData, affiliate_link: affiliateLink };
    console.log('Submitting course data:', submitData);

    try {
    if (isEdit) {
        await dispatch(updateCourse({ id, courseData: submitData })).unwrap();
    } else {
        await dispatch(createCourse(submitData)).unwrap();
      }
      navigate('/admin/courses');
    } catch (error) {
      console.error('Course operation failed:', error);
      alert(`Failed to ${isEdit ? 'update' : 'create'} course: ${error}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">{isEdit ? 'Edit' : 'Add'} Course</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block font-semibold mb-2">Course Name</label>
          <input type="text" name="name" value={courseData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" required />
        </div>
        <div className="mb-6">
          <label className="block font-semibold mb-2">Course Price</label>
          <input type="number" name="price" value={courseData.price} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" required />
        </div>
        <div className="mb-6">
          <label className="block font-semibold mb-2">Course Image</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            className="w-full border border-gray-300 rounded-md p-2" 
            disabled={imageUploading}
          />
          {imageUploading && <p className="text-blue-600 mt-1">Uploading image...</p>}
          {courseData.image && (
            <div className="mt-2">
              <img src={courseData.image} alt="Course preview" className="w-32 h-24 object-cover rounded" />
            </div>
          )}
        </div>
        <div className="mb-6">
          <label className="block font-semibold mb-2">Course Duration</label>
          <div className="flex gap-4">
            <input type="number" name="years" value={courseData.duration.years} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" required />
            <input type="number" name="months" value={courseData.duration.months} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" required />
          </div>
        </div>
        <div className="mb-6">
          <label className="block font-semibold mb-2">Affiliate Link</label>
          <input type="text" name="affiliate_link" value={courseData.affiliate_link} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" required />
        </div>
        <div className="mb-6">
          <label className="block font-semibold mb-2">Course Domain</label>
          <select
            name="domain"
            value={courseData.domain}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">Select domain</option>
            {domains.map(domain => (
              <option key={domain._id} value={domain._id}>{domain.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-6">
          <label className="block font-semibold mb-2">Course Section</label>
          <select name="section" value={courseData.section} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" required>
            <option value="">Select section</option>
            {sections.map(section => (
              <option key={section._id} value={section._id}>{section.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-6">
          <label className="block font-semibold mb-2">Course Rating</label>
          <input type="number" name="rating" value={courseData.rating} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" min={0} max={5} required />
        </div>
        {/* Add image, dimensions, weight fields as needed */}
        <button 
          type="submit" 
          disabled={loading || imageUploading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditCoursePage;
