import React from 'react';
import { FiUsers, FiTarget, FiAward, FiTrendingUp, FiHeart, FiShield, FiZap, FiBook } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const About = () => {
  const stats = [
    { number: '50,000+', label: 'Students Enrolled', icon: FiUsers },
    { number: '500+', label: 'Courses Available', icon: FiBook },
    { number: '95%', label: 'Success Rate', icon: FiTrendingUp },
    { number: '100+', label: 'Expert Instructors', icon: FiAward }
  ];

  const values = [
    {
      icon: FiHeart,
      title: 'Passion for Learning',
      description: 'We believe in the transformative power of education and are passionate about making quality learning accessible to everyone.'
    },
    {
      icon: FiShield,
      title: 'Quality Assurance',
      description: 'Every course is carefully curated and reviewed to ensure the highest standards of educational excellence.'
    },
    {
      icon: FiZap,
      title: 'Innovation',
      description: 'We continuously innovate our platform to provide cutting-edge learning experiences and stay ahead of industry trends.'
    },
    {
      icon: FiUsers,
      title: 'Community',
      description: 'We foster a supportive learning community where students can connect, collaborate, and grow together.'
    }
  ];

  const team = [
    {
      name: 'Rajesh Kumar',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      bio: 'Former Google engineer with 15+ years in edtech. Passionate about democratizing education.'
    },
    {
      name: 'Priya Sharma',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      bio: 'Tech leader with expertise in AI and machine learning. Drives our platform innovation.'
    },
    {
      name: 'Amit Patel',
      role: 'Head of Content',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      bio: 'Education specialist with 10+ years creating engaging learning experiences.'
    },
    {
      name: 'Neha Singh',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      bio: 'Operations expert ensuring smooth learning experiences for all our students.'
    }
  ];

  const achievements = [
    {
      year: '2024',
      title: 'Best EdTech Platform',
      description: 'Awarded by Education Excellence Awards for outstanding contribution to online learning.'
    },
    {
      year: '2023',
      title: '1 Million Students',
      description: 'Reached the milestone of 1 million students enrolled across our platform.'
    },
    {
      year: '2022',
      title: 'AI-Powered Learning',
      description: 'Launched AI-driven personalized learning paths for enhanced student experience.'
    },
    {
      year: '2021',
      title: 'Series A Funding',
      description: 'Secured $10M in funding to expand our course offerings and technology platform.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">About Coursify</h1>
            <p className="text-xl mb-8 text-blue-100">
              Empowering millions of learners worldwide with quality education, innovative technology, 
              and a passion for lifelong learning.
            </p>
            <div className="flex justify-center space-x-4">
              <Link 
                to="/contact" 
                className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
              >
                Get in Touch
              </Link>
              <Link 
                to="/features" 
                className="border-2 border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Explore Features
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-6">
                Founded in 2020, Coursify began with a simple mission: to make quality education 
                accessible to everyone, everywhere. What started as a small team of passionate educators 
                and technologists has grown into a global platform serving millions of learners.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We believe that education is the great equalizer and that everyone deserves access to 
                world-class learning opportunities. Our platform combines cutting-edge technology with 
                expert instruction to create engaging, effective learning experiences.
              </p>
              <p className="text-lg text-gray-600">
                Today, we're proud to serve students from over 150 countries, offering courses in 
                technology, business, creative arts, and more. Our commitment to excellence and 
                innovation continues to drive us forward.
              </p>
            </div>
            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center text-gray-600">
                <FiBook className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium">Our Journey</p>
                <p className="text-sm">Visual timeline or story illustration</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiTarget className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To democratize education by providing high-quality, accessible learning experiences 
                that empower individuals to achieve their goals and transform their lives through 
                knowledge and skills development.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiTrendingUp className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600">
                To become the world's leading platform for lifelong learning, where anyone can access 
                the knowledge and skills they need to succeed in an ever-changing world, regardless 
                of their background or location.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do and shape the culture of our organization.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our leadership team brings together decades of experience in education, technology, 
              and business to drive innovation and growth.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Achievements</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Milestones and recognition that mark our journey of growth and impact.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">{achievement.year}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{achievement.title}</h3>
                    <p className="text-gray-600">{achievement.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join Our Learning Community</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Ready to start your learning journey? Explore our courses and discover the perfect 
            path to achieve your goals.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              to="/" 
              className="bg-white text-blue-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
            >
              Browse Courses
            </Link>
            <Link 
              to="/contact" 
              className="border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 