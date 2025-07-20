import React from 'react'
import { FaSignOutAlt, FaUser, FaBook, FaLayerGroup, FaListAlt, FaChartLine, FaHome, FaTimes, FaUsers } from 'react-icons/fa'
import { NavLink, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../../redux/slices/authSlice'

const AdminSidebar = ({ onClose }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const navItems = [
    { 
      to: '/admin', 
      icon: FaChartLine, 
      label: 'Dashboard',
      description: 'Overview and analytics'
    },
    { 
      to: '/admin/users', 
      icon: FaUser, 
      label: 'Users',
      description: 'Manage user accounts'
    },
    { 
      to: '/admin/courses', 
      icon: FaBook, 
      label: 'Courses',
      description: 'Manage course listings'
    },
    { 
      to: '/admin/sections', 
      icon: FaListAlt, 
      label: 'Sections',
      description: 'Organize course sections'
    },
    { 
      to: '/admin/domains', 
      icon: FaLayerGroup, 
      label: 'Domains',
      description: 'Manage course domains'
    },
    { 
      to: '/admin/visitors', 
      icon: FaUsers, 
      label: 'Visitors',
      description: 'Track website visitors'
    }
  ]

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <Link 
            to="/"
            className="text-2xl font-bold text-white hover:text-blue-400 transition-colors duration-200"
          >
            Coursify
          </Link>
          
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="md:hidden p-2 hover:bg-gray-700 rounded-md transition-colors duration-200"
            aria-label="Close sidebar"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <h2 className="text-lg font-medium mt-4 text-gray-300">
          Admin Dashboard
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) => `
              group flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
              ${isActive 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }
            `}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium">{item.label}</div>
              <div className="text-xs text-gray-400 group-hover:text-gray-300">
                {item.description}
              </div>
            </div>
          </NavLink>
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-700 space-y-3">
        <Link 
          to="/" 
          onClick={onClose}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200 font-medium"
        >
          <FaHome className="h-4 w-4" />
          <span>Go to Coursify</span>
        </Link>
        
        <button 
          onClick={handleLogout} 
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200 font-medium"
        >
          <FaSignOutAlt className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default AdminSidebar