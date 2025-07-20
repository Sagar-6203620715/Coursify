import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiSearch, FiBook, FiCreditCard, FiUser, FiSettings } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const FAQs = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleItem = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const categories = [
    { id: 'general', name: 'General', icon: FiBook },
    { id: 'account', name: 'Account & Billing', icon: FiUser },
    { id: 'courses', name: 'Courses & Learning', icon: FiBook },
    { id: 'technical', name: 'Technical Support', icon: FiSettings }
  ];

  const faqs = {
    general: [
      {
        id: 'gen-1',
        question: 'What is Coursify?',
        answer: 'Coursify is an online learning platform that offers high-quality courses in technology, business, creative arts, and more. We provide expert-led instruction with flexible learning options to help you achieve your educational and career goals.'
      },
      {
        id: 'gen-2',
        question: 'How much do courses cost?',
        answer: 'Course prices vary depending on the complexity and duration. We offer both individual course purchases and subscription plans. Many courses are also available for free with basic access. Check individual course pages for specific pricing.'
      },
      {
        id: 'gen-3',
        question: 'Do you offer certificates upon completion?',
        answer: 'Yes! Most of our courses offer certificates of completion. These certificates can be downloaded as PDFs and shared on your LinkedIn profile or resume. Some courses also offer industry-recognized certifications.'
      },
      {
        id: 'gen-4',
        question: 'Can I access courses on mobile devices?',
        answer: 'Absolutely! Our platform is fully responsive and works on smartphones, tablets, and desktop computers. We also have a mobile app available for iOS and Android devices for an optimized mobile learning experience.'
      }
    ],
    account: [
      {
        id: 'acc-1',
        question: 'How do I create an account?',
        answer: 'Creating an account is simple! Click the "Sign Up" button in the top right corner, fill in your details, and verify your email address. You can also sign up using your Google or Facebook account for faster registration.'
      },
      {
        id: 'acc-2',
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and digital wallets like Apple Pay and Google Pay. We also offer payment plans for higher-priced courses.'
      },
      {
        id: 'acc-3',
        question: 'Can I cancel my subscription?',
        answer: 'Yes, you can cancel your subscription at any time from your account settings. You\'ll continue to have access to your courses until the end of your current billing period. No questions asked!'
      },
      {
        id: 'acc-4',
        question: 'How do I update my payment information?',
        answer: 'You can update your payment information in your account settings under the "Billing" section. Simply click "Update Payment Method" and enter your new card details or select a different payment option.'
      },
      {
        id: 'acc-5',
        question: 'Do you offer refunds?',
        answer: 'We offer a 30-day money-back guarantee for all course purchases. If you\'re not satisfied with your course, contact our support team within 30 days of purchase for a full refund.'
      }
    ],
    courses: [
      {
        id: 'course-1',
        question: 'How long do I have access to my courses?',
        answer: 'You have lifetime access to all courses you purchase! This means you can revisit the content anytime, even after completing the course. Course updates and new content are also included at no additional cost.'
      },
      {
        id: 'course-2',
        question: 'Can I download course materials?',
        answer: 'Yes! Most courses allow you to download video lectures for offline viewing. You can also download course materials like PDFs, worksheets, and project files. Look for the download icon next to each lesson.'
      },
      {
        id: 'course-3',
        question: 'Do courses have prerequisites?',
        answer: 'Prerequisites vary by course. Beginner courses typically require no prior knowledge, while advanced courses may require specific skills or experience. Check the course description for detailed prerequisites.'
      },
      {
        id: 'course-4',
        question: 'Can I interact with instructors?',
        answer: 'Yes! Many courses include Q&A sections where you can ask questions directly to instructors. Some courses also offer live sessions, office hours, and community forums for additional interaction.'
      },
      {
        id: 'course-5',
        question: 'How do I track my progress?',
        answer: 'Your progress is automatically tracked as you complete lessons. You can view your progress in the course dashboard, which shows completed lessons, quiz scores, and overall completion percentage.'
      },
      {
        id: 'course-6',
        question: 'Are there assignments or projects?',
        answer: 'Many courses include hands-on projects, assignments, and quizzes to reinforce learning. These are optional but highly recommended for the best learning experience and skill development.'
      }
    ],
    technical: [
      {
        id: 'tech-1',
        question: 'What are the system requirements?',
        answer: 'Our platform works on any modern web browser (Chrome, Firefox, Safari, Edge) with an internet connection. For video streaming, we recommend a minimum of 5 Mbps download speed for HD quality.'
      },
      {
        id: 'tech-2',
        question: 'Why are videos not loading?',
        answer: 'This could be due to slow internet connection, browser cache issues, or firewall settings. Try refreshing the page, clearing your browser cache, or switching to a different browser. Contact support if the issue persists.'
      },
      {
        id: 'tech-3',
        question: 'Can I watch courses offline?',
        answer: 'Yes! You can download course videos for offline viewing using our mobile app or web platform. Downloaded content is available for 30 days and can be re-downloaded as needed.'
      },
      {
        id: 'tech-4',
        question: 'How do I reset my password?',
        answer: 'Click "Forgot Password" on the login page, enter your email address, and we\'ll send you a password reset link. Make sure to check your spam folder if you don\'t receive the email immediately.'
      },
      {
        id: 'tech-5',
        question: 'Is my data secure?',
        answer: 'Absolutely! We use industry-standard encryption (SSL/TLS) to protect your personal and payment information. We never store your credit card details and follow strict data protection protocols.'
      }
    ]
  };

  const filteredFAQs = Object.keys(faqs).reduce((acc, category) => {
    if (category === activeCategory) {
      const categoryFAQs = faqs[category].filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (categoryFAQs.length > 0) {
        acc[category] = categoryFAQs;
      }
    }
    return acc;
  }, {});

  const allFAQs = Object.values(faqs).flat().filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our platform, courses, and services. 
              Can't find what you're looking for? Contact our support team.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <category.icon className="h-5 w-5" />
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* FAQs Content */}
        <div className="max-w-4xl mx-auto">
          {searchTerm ? (
            // Search Results
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Search Results ({allFAQs.length} found)
              </h2>
              {allFAQs.length > 0 ? (
                allFAQs.map((faq) => (
                  <div key={faq.id} className="bg-white rounded-lg shadow-md">
                    <button
                      onClick={() => toggleItem(faq.id)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      {expandedItems.has(faq.id) ? (
                        <FiChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <FiChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    {expandedItems.has(faq.id) && (
                      <div className="px-6 pb-4">
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">No results found for "{searchTerm}"</p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear search and view all FAQs
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Category Content
            Object.keys(filteredFAQs).map((category) => (
              <div key={category} className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  {categories.find(cat => cat.id === category)?.name} Questions
                </h2>
                {filteredFAQs[category].map((faq) => (
                  <div key={faq.id} className="bg-white rounded-lg shadow-md">
                    <button
                      onClick={() => toggleItem(faq.id)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      {expandedItems.has(faq.id) ? (
                        <FiChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <FiChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    {expandedItems.has(faq.id) && (
                      <div className="px-6 pb-4">
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Contact Support Section */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our support team is here to help you 
            with any questions or concerns you might have.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/contact"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-semibold transition-colors"
            >
              Contact Support
            </Link>
            <a
              href="mailto:support@coursify.com"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-md font-semibold transition-colors"
            >
              Email Us
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <FiBook className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Course Guide</h3>
            <p className="text-gray-600 mb-4">Learn how to get the most out of your courses</p>
            <Link to="/features" className="text-blue-600 hover:text-blue-700 font-medium">
              Explore Features →
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <FiUser className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Help</h3>
            <p className="text-gray-600 mb-4">Manage your account and billing settings</p>
            <Link to="/contact" className="text-blue-600 hover:text-blue-700 font-medium">
              Get Help →
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <FiSettings className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Technical Support</h3>
            <p className="text-gray-600 mb-4">Resolve technical issues and platform problems</p>
            <Link to="/contact" className="text-blue-600 hover:text-blue-700 font-medium">
              Contact Support →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQs; 