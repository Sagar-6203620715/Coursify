const express = require('express');
const Visitor = require('../models/Visitor');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Track a new visit
router.post('/track', async (req, res) => {
  try {
    const {
      page,
      pageTitle,
      sessionId,
      guestId,
      userId,
      timeOnPage,
      isBounce,
      converted,
      conversionType
    } = req.body;

    // Get visitor information from request
    const ip = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
    const userAgent = req.headers['user-agent'];
    const referrer = req.headers['referer'] || 'direct';

    // Check for existing visit from the same session on the same page
    const existingVisit = await Visitor.findOne({
      sessionId,
      page
    }).sort({ createdAt: -1 });

    if (existingVisit) {
      // Update the existing visit instead of creating a new one
      existingVisit.lastVisit = new Date();
      existingVisit.timeOnPage += timeOnPage || 0;
      existingVisit.isBounce = false; // User is engaging with the page
      await existingVisit.save();
      
      return res.json({ 
        success: true, 
        message: 'Visit updated',
        visitorId: existingVisit._id
      });
    }

    // Detect device type
    let device = 'desktop';
    if (userAgent) {
      if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
        device = /iPad/.test(userAgent) ? 'tablet' : 'mobile';
      }
    }

    // Detect browser and OS (basic detection)
    let browser = '';
    let os = '';
    if (userAgent) {
      if (userAgent.includes('Chrome')) browser = 'Chrome';
      else if (userAgent.includes('Firefox')) browser = 'Firefox';
      else if (userAgent.includes('Safari')) browser = 'Safari';
      else if (userAgent.includes('Edge')) browser = 'Edge';
      else browser = 'Other';

      if (userAgent.includes('Windows')) os = 'Windows';
      else if (userAgent.includes('Mac')) os = 'macOS';
      else if (userAgent.includes('Linux')) os = 'Linux';
      else if (userAgent.includes('Android')) os = 'Android';
      else if (userAgent.includes('iOS')) os = 'iOS';
      else os = 'Other';
    }

    // Create visitor record
    const visitor = new Visitor({
      ip,
      userAgent,
      referrer,
      userId: userId || null,
      guestId: guestId || null,
      sessionId,
      page,
      pageTitle,
      device,
      browser,
      os,
      timeOnPage: timeOnPage || 0,
      isBounce: isBounce !== undefined ? isBounce : true,
      converted: converted || false,
      conversionType: conversionType || ''
    });

    await visitor.save();

    res.json({ 
      success: true, 
      message: 'Visit tracked successfully',
      visitorId: visitor._id
    });
  } catch (error) {
    console.error('Error tracking visit:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update visit (for time on page, conversions, etc.)
router.put('/update/:id', async (req, res) => {
  try {
    const { timeOnPage, sessionTime, isBounce, converted, conversionType } = req.body;
    
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) {
      return res.status(404).json({ message: 'Visit not found' });
    }

    if (timeOnPage !== undefined) visitor.timeOnPage = timeOnPage;
    if (sessionTime !== undefined) visitor.sessionTime = sessionTime;
    if (isBounce !== undefined) visitor.isBounce = isBounce;
    if (converted !== undefined) visitor.converted = converted;
    if (conversionType !== undefined) visitor.conversionType = conversionType;
    
    visitor.lastVisit = new Date();
    await visitor.save();

    res.json({ success: true, message: 'Visit updated successfully' });
  } catch (error) {
    console.error('Error updating visit:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get visitor analytics (admin only)
router.get('/analytics', protect, admin, async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    // Calculate date range
    const endDate = new Date();
    let startDate = new Date();
    
    switch (period) {
      case '1d':
        startDate.setDate(endDate.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      default:
        startDate.setDate(endDate.getDate() - 7);
    }

    // Get overall statistics
    const stats = await Visitor.getStats(startDate, endDate);
    
    // Get page analytics
    const pageAnalytics = await Visitor.getPageAnalytics(startDate, endDate);
    
    // Get device analytics
    const deviceAnalytics = await Visitor.getDeviceAnalytics(startDate, endDate);
    
    // Get country analytics
    const countryAnalytics = await Visitor.getCountryAnalytics(startDate, endDate);

    res.json({
      period,
      dateRange: { startDate, endDate },
      stats,
      pageAnalytics,
      deviceAnalytics,
      countryAnalytics
    });
  } catch (error) {
    console.error('Error getting analytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recent visits (admin only, on demand)
router.get('/recent', protect, admin, async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const recentVisits = await Visitor.find({})
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate('userId', 'name email')
      .select('-userAgent');
    res.json(recentVisits);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update session time across all visits in a session
router.put('/update-session/:sessionId', async (req, res) => {
  try {
    const { sessionTime } = req.body;
    const { sessionId } = req.params;
    
    if (sessionTime === undefined) {
      return res.status(400).json({ message: 'sessionTime is required' });
    }

    // Update all visits for this session with the total session time
    const result = await Visitor.updateMany(
      { sessionId },
      { 
        sessionTime,
        lastVisit: new Date()
      }
    );

    res.json({ 
      success: true, 
      message: 'Session time updated successfully',
      updatedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error updating session time:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get visitor list (admin only)
router.get('/visitors', protect, admin, async (req, res) => {
  try {
    const { page = 1, limit = 50, search = '' } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query.$or = [
        { ip: { $regex: search, $options: 'i' } },
        { page: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ];
    }

    const visitors = await Visitor.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'name email')
      .select('-userAgent');

    const total = await Visitor.countDocuments(query);

    res.json({
      visitors,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalVisitors: total,
        hasNext: skip + visitors.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error getting visitors:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get real-time visitor count (admin only)
router.get('/realtime', protect, admin, async (req, res) => {
  try {
    // Get visitors in the last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    // Get all visits in the last 5 minutes
    const recentVisits = await Visitor.find({
      lastVisit: { $gte: fiveMinutesAgo }
    }).select('ip sessionId createdAt lastVisit');

    // Count unique IPs (actual visitors)
    const uniqueIPs = [...new Set(recentVisits.map(v => v.ip))];
    
    // Count unique sessions
    const uniqueSessions = [...new Set(recentVisits.map(v => v.sessionId))];

    // Get the most recent visit for each IP to show last activity
    const visitorActivity = uniqueIPs.map(ip => {
      const visitsForIP = recentVisits.filter(v => v.ip === ip);
      const mostRecent = visitsForIP.reduce((latest, current) => 
        current.lastVisit > latest.lastVisit ? current : latest
      );
      return {
        ip,
        lastActivity: mostRecent.lastVisit,
        sessionCount: visitsForIP.length
      };
    });

    res.json({
      activeVisitors: uniqueIPs.length,
      activeSessions: uniqueSessions.length,
      totalVisits: recentVisits.length,
      visitorActivity,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error getting real-time data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Debug endpoint to see recent visits (admin only)
router.get('/debug', protect, admin, async (req, res) => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    const recentVisits = await Visitor.find({
      createdAt: { $gte: fiveMinutesAgo }
    })
    .sort({ createdAt: -1 })
    .limit(20)
    .select('ip sessionId page createdAt');

    const stats = {
      totalVisits: recentVisits.length,
      uniqueIPs: [...new Set(recentVisits.map(v => v.ip))].length,
      uniqueSessions: [...new Set(recentVisits.map(v => v.sessionId))].length,
      visits: recentVisits
    };

    res.json(stats);
  } catch (error) {
    console.error('Error getting debug data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cleanup duplicate visits (admin only)
router.post('/cleanup', protect, admin, async (req, res) => {
  try {
    // Remove all visitor records older than 1 hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const deleteResult = await Visitor.deleteMany({
      createdAt: { $lt: oneHourAgo }
    });

    // Also remove duplicate records from the same session within 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const duplicates = await Visitor.aggregate([
      {
        $match: {
          createdAt: { $gte: fiveMinutesAgo }
        }
      },
      {
        $group: {
          _id: {
            sessionId: '$sessionId',
            page: '$page'
          },
          count: { $sum: 1 },
          docs: { $push: '$_id' }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]);

    let duplicateDeletions = 0;
    for (const duplicate of duplicates) {
      // Keep the first record, delete the rest
      const toDelete = duplicate.docs.slice(1);
      if (toDelete.length > 0) {
        await Visitor.deleteMany({ _id: { $in: toDelete } });
        duplicateDeletions += toDelete.length;
      }
    }

    res.json({
      message: 'Cleanup completed',
      oldRecordsDeleted: deleteResult.deletedCount,
      duplicateRecordsDeleted: duplicateDeletions,
      remainingRecords: await Visitor.countDocuments()
    });
  } catch (error) {
    console.error('Error during cleanup:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



// Cleanup all visitor data (admin only)
router.delete('/cleanup-all', protect, admin, async (req, res) => {
  try {
    const result = await Visitor.deleteMany({});
    
    res.json({ 
      success: true, 
      message: `Removed ${result.deletedCount} visitor records`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error cleaning up all visitor data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 