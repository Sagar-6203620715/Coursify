const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  // Basic visitor info
  ip: {
    type: String,
    required: true,
    index: true
  },
  userAgent: {
    type: String,
    required: true
  },
  referrer: {
    type: String,
    default: 'direct'
  },
  
  // User identification
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  guestId: {
    type: String,
    default: null,
    index: true
  },
  
  // Session info
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  
  // Page visit details
  page: {
    type: String,
    required: true
  },
  pageTitle: {
    type: String,
    default: ''
  },
  
  // Device and browser info
  device: {
    type: String,
    enum: ['desktop', 'mobile', 'tablet'],
    default: 'desktop'
  },
  browser: {
    type: String,
    default: ''
  },
  os: {
    type: String,
    default: ''
  },
  
  // Location info (if available)
  country: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: ''
  },
  
  // Engagement metrics
  timeOnPage: {
    type: Number, // in seconds
    default: 0
  },
  sessionTime: {
    type: Number, // in seconds - total time for this session
    default: 0
  },
  isBounce: {
    type: Boolean,
    default: true
  },
  
  // Conversion tracking
  converted: {
    type: Boolean,
    default: false
  },
  conversionType: {
    type: String,
    enum: ['signup', 'purchase', 'click', ''],
    default: ''
  },
  
  // Timestamps
  firstVisit: {
    type: Date,
    default: Date.now
  },
  lastVisit: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better performance
visitorSchema.index({ ip: 1, createdAt: -1 });
visitorSchema.index({ userId: 1, createdAt: -1 });
visitorSchema.index({ guestId: 1, createdAt: -1 });
visitorSchema.index({ sessionId: 1, createdAt: -1 });
visitorSchema.index({ page: 1, createdAt: -1 });
visitorSchema.index({ createdAt: -1 });
visitorSchema.index({ country: 1, createdAt: -1 });
visitorSchema.index({ device: 1, createdAt: -1 });

// Static method to get visitor statistics
visitorSchema.statics.getStats = async function(startDate, endDate) {
  const matchStage = {
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  };

  // First get total page views
  const totalPageViews = await this.countDocuments(matchStage);

  const stats = await this.aggregate([
    { $match: matchStage },
    // First, group by sessionId to get unique session data
    {
      $group: {
        _id: '$sessionId',
        sessionTime: { $first: '$sessionTime' }, // Take the session time from first visit
        ip: { $first: '$ip' },
        userId: { $first: '$userId' },
        isBounce: { $first: '$isBounce' },
        converted: { $first: '$converted' }
      }
    },
    // Then group all sessions together
    {
      $group: {
        _id: null,
        uniqueVisitors: { $addToSet: '$ip' },
        uniqueUsers: { $addToSet: '$userId' },
        uniqueSessions: { $addToSet: '$_id' },
        totalTimeOnSite: { $sum: '$sessionTime' },
        bounces: { $sum: { $cond: ['$isBounce', 1, 0] } },
        conversions: { $sum: { $cond: ['$converted', 1, 0] } }
      }
    },
    {
      $project: {
        _id: 0,
        totalPageViews: { $literal: totalPageViews },
        totalVisits: { $size: '$uniqueSessions' },
        uniqueVisitors: { $size: '$uniqueVisitors' },
        uniqueUsers: { $size: { $filter: { input: '$uniqueUsers', cond: { $ne: ['$$this', null] } } } },
        uniqueSessions: { $size: '$uniqueSessions' },
        totalTimeOnSite: 1,
        bounces: 1,
        conversions: 1,
        bounceRate: { $multiply: [{ $divide: ['$bounces', { $size: '$uniqueSessions' }] }, 100] },
        conversionRate: { $multiply: [{ $divide: ['$conversions', { $size: '$uniqueSessions' }] }, 100] },
        avgTimeOnSite: { $divide: ['$totalTimeOnSite', { $size: '$uniqueSessions' }] }
      }
    }
  ]);

  return stats[0] || {
    totalPageViews: 0,
    totalVisits: 0,
    uniqueVisitors: 0,
    uniqueUsers: 0,
    uniqueSessions: 0,
    totalTimeOnSite: 0,
    bounces: 0,
    conversions: 0,
    bounceRate: 0,
    conversionRate: 0,
    avgTimeOnSite: 0
  };
};

// Static method to get page analytics
visitorSchema.statics.getPageAnalytics = async function(startDate, endDate) {
  return await this.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: '$page',
        visits: { $sum: 1 },
        uniqueVisitors: { $addToSet: '$ip' },
        avgTimeOnPage: { $avg: '$timeOnPage' },
        bounces: { $sum: { $cond: ['$isBounce', 1, 0] } }
      }
    },
    {
      $project: {
        page: '$_id',
        visits: 1,
        uniqueVisitors: { $size: '$uniqueVisitors' },
        avgTimeOnPage: { $round: ['$avgTimeOnPage', 2] },
        bounces: 1,
        bounceRate: { $multiply: [{ $divide: ['$bounces', '$visits'] }, 100] }
      }
    },
    { $sort: { visits: -1 } }
  ]);
};

// Static method to get device analytics
visitorSchema.statics.getDeviceAnalytics = async function(startDate, endDate) {
  return await this.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: '$device',
        visits: { $sum: 1 },
        uniqueVisitors: { $addToSet: '$ip' }
      }
    },
    {
      $project: {
        device: '$_id',
        visits: 1,
        uniqueVisitors: { $size: '$uniqueVisitors' }
      }
    },
    { $sort: { visits: -1 } }
  ]);
};

// Static method to get country analytics
visitorSchema.statics.getCountryAnalytics = async function(startDate, endDate) {
  return await this.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate
        },
        country: { $ne: '' }
      }
    },
    {
      $group: {
        _id: '$country',
        visits: { $sum: 1 },
        uniqueVisitors: { $addToSet: '$ip' }
      }
    },
    {
      $project: {
        country: '$_id',
        visits: 1,
        uniqueVisitors: { $size: '$uniqueVisitors' }
      }
    },
    { $sort: { visits: -1 } },
    { $limit: 10 }
  ]);
};

module.exports = mongoose.model('Visitor', visitorSchema); 