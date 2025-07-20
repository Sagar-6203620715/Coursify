import React from 'react';
import { 
  FiPlay, 
  FiDownload, 
  FiWifi, 
  FiAward, 
  FiUsers, 
  FiClock, 
  FiShield, 
  FiZap, 
  FiBook, 
  FiTarget, 
  FiTrendingUp, 
  FiStar,
  FiCheck,
  FiSmartphone,
  FiMonitor,
  FiTablet
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Features = () => {
  const mainFeatures = [
    {
      icon: FiPlay,
      title: 'Video-Based Learning',
      description: 'High-quality video lectures with HD streaming and offline download capabilities.',
      benefits: ['HD Quality', 'Offline Access', 'Multiple Formats', 'Interactive Elements']
    },
    {
      icon: FiUsers,
      title: 'Expert Instructors',
      description: 'Learn from industry professionals and certified experts in their respective fields.',
      benefits: ['Industry Experts', 'Certified Teachers', 'Real-world Experience', 'Personal Mentoring']
    },
    {
      icon: FiTarget,
      title: 'Personalized Learning',
      description: 'AI-powered recommendations and adaptive learning paths tailored to your goals.',
      benefits: ['Smart Recommendations', 'Adaptive Paths', 'Progress Tracking', 'Custom Goals']
    },
    {
      icon: FiClock,
      title: 'Flexible Schedule',
      description: 'Learn at your own pace with 24/7 access to courses and materials.',
      benefits: ['24/7 Access', 'Self-Paced Learning', 'Lifetime Access', 'Mobile Learning']
    }
  ];

  const platformFeatures = [
    {
      icon: FiShield,
      title: 'Secure Platform',
      description: 'Your data and progress are protected with enterprise-grade security measures.',
      features: ['SSL Encryption', 'Data Protection', 'Privacy Controls', 'Secure Payments']
    },
    {
      icon: FiZap,
      title: 'Fast Performance',
      description: 'Optimized platform ensuring smooth learning experience across all devices.',
      features: ['CDN Delivery', 'Optimized Videos', 'Quick Loading', 'Mobile Optimized']
    },
    {
      icon: FiBook,
      title: 'Rich Content',
      description: 'Comprehensive course materials including videos, notes, quizzes, and projects.',
      features: ['Video Lectures', 'Study Notes', 'Practice Quizzes', 'Real Projects']
    },
    {
      icon: FiTrendingUp,
      title: 'Progress Analytics',
      description: 'Track your learning progress with detailed analytics and performance insights.',
      features: ['Progress Tracking', 'Performance Metrics', 'Learning Analytics', 'Achievement Badges']
    }
  ];

  const facts = [
    {
      number: '500+',
      label: 'Courses Available',
      description: 'Comprehensive library covering technology, business, creative arts, and more.'
    },
    {
      number: '50,000+',
      label: 'Active Students',
      description: 'Join a thriving community of learners from around the world.'
    },
    {
      number: '95%',
      label: 'Completion Rate',
      description: 'Our structured approach helps students successfully complete their courses.'
    },
    {
      number: '24/7',
      label: 'Support Available',
      description: 'Round-the-clock customer support to help you with any questions.'
    },
    {
      number: '100+',
      label: 'Expert Instructors',
      description: 'Learn from industry professionals with years of teaching experience.'
    },
    {
      number: '30+',
      label: 'Categories',
      description: 'Diverse course categories to match every learning interest and career goal.'
    }
  ];

  const deviceSupport = [
    {
      icon: FiMonitor,
      title: 'Desktop',
      description: 'Full-featured experience on Windows, Mac, and Linux computers.',
      features: ['Full HD Streaming', 'Download Manager', 'Advanced Analytics', 'Multi-tab Support']
    },
    {
      icon: FiSmartphone,
      title: 'Mobile',
      description: 'Optimized learning experience on iOS and Android smartphones.',
      features: ['Mobile App', 'Offline Downloads', 'Touch Controls', 'Push Notifications']
    },
    {
      icon: FiTablet,
      title: 'Tablet',
      description: 'Perfect learning companion for iPad and Android tablets.',
      features: ['Tablet Optimized', 'Large Screen View', 'Touch Interface', 'Split Screen Support']
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Developer',
      content: 'The personalized learning paths helped me transition from marketing to software development. The quality of instructors is outstanding!',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Business Analyst',
      content: 'I love the flexibility of learning at my own pace. The mobile app makes it easy to study anywhere, anytime.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Graphic Designer',
      content: 'The project-based learning approach helped me build a strong portfolio. Highly recommended for creative professionals!',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">Platform Features</h1>
            <p className="text-xl mb-8 text-blue-100">
              Discover the powerful features that make Coursify the ultimate learning platform 
              for your educational journey.
            </p>
            <div className="flex justify-center space-x-4">
              <Link 
                to="/" 
                className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
              >
                Start Learning
              </Link>
              <Link 
                to="/contact" 
                className="border-2 border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Get Support
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Features */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need for an exceptional learning experience, designed to help you succeed.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mainFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                      <feature.icon className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center text-sm text-gray-600">
                          <FiCheck className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Features */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Capabilities</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built with cutting-edge technology to provide the best learning experience possible.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {platformFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="space-y-2 text-sm">
                  {feature.features.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-gray-600">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Facts Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Facts</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Impressive numbers that showcase our commitment to quality education and student success.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facts.map((fact, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{fact.number}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{fact.label}</h3>
                <p className="text-gray-600">{fact.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Device Support */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Learn Anywhere</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Access your courses on any device, anytime, anywhere. Your learning journey follows you.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {deviceSupport.map((device, index) => (
              <div key={index} className="text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <device.icon className="h-12 w-12 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{device.title}</h3>
                <p className="text-gray-600 mb-4">{device.description}</p>
                <ul className="space-y-2 text-sm">
                  {device.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="text-gray-600">
                      • {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Students Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from our community of learners about their experience with Coursify.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Coursify?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how we compare to other learning platforms in the market.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="grid grid-cols-4 gap-0">
              <div className="bg-gray-50 p-6 font-semibold text-gray-900">Features</div>
              <div className="bg-blue-50 p-6 font-semibold text-blue-900 text-center">Coursify</div>
              <div className="bg-gray-50 p-6 font-semibold text-gray-900 text-center">Other Platforms</div>
              <div className="bg-gray-50 p-6 font-semibold text-gray-900 text-center">Traditional Learning</div>
              
              <div className="p-6 border-t border-gray-200">HD Video Quality</div>
              <div className="p-6 border-t border-gray-200 text-center text-green-600 font-semibold">✓</div>
              <div className="p-6 border-t border-gray-200 text-center text-red-600">✗</div>
              <div className="p-6 border-t border-gray-200 text-center text-gray-400">-</div>
              
              <div className="p-6 border-t border-gray-200">Offline Downloads</div>
              <div className="p-6 border-t border-gray-200 text-center text-green-600 font-semibold">✓</div>
              <div className="p-6 border-t border-gray-200 text-center text-red-600">✗</div>
              <div className="p-6 border-t border-gray-200 text-center text-gray-400">-</div>
              
              <div className="p-6 border-t border-gray-200">Personalized Learning</div>
              <div className="p-6 border-t border-gray-200 text-center text-green-600 font-semibold">✓</div>
              <div className="p-6 border-t border-gray-200 text-center text-red-600">✗</div>
              <div className="p-6 border-t border-gray-200 text-center text-gray-400">-</div>
              
              <div className="p-6 border-t border-gray-200">24/7 Access</div>
              <div className="p-6 border-t border-gray-200 text-center text-green-600 font-semibold">✓</div>
              <div className="p-6 border-t border-gray-200 text-center text-green-600">✓</div>
              <div className="p-6 border-t border-gray-200 text-center text-red-600">✗</div>
              
              <div className="p-6 border-t border-gray-200">Expert Instructors</div>
              <div className="p-6 border-t border-gray-200 text-center text-green-600 font-semibold">✓</div>
              <div className="p-6 border-t border-gray-200 text-center text-green-600">✓</div>
              <div className="p-6 border-t border-gray-200 text-center text-green-600">✓</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Experience These Features?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are already benefiting from our comprehensive platform.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              to="/" 
              className="bg-white text-blue-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Free Trial
            </Link>
            <Link 
              to="/contact" 
              className="border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features; 