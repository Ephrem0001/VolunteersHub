const Volunteer = require("../models/Volunteer");
const Event = require("../models/Event");
const NGO = require("../models/NGO");
const User = require("../models/User");

const getMonthName = (monthNumber) => {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  return months[monthNumber - 1] || monthNumber;
};

// Helper function to ensure consistent status values
const normalizeStatus = (status) => {
  const statusMap = {
    approved: "approved",
    pending: "pending",
    rejected: "rejected",
    active: "active",
    inactive: "inactive"
  };
  return statusMap[status.toLowerCase()] || status;
};

exports.getDashboardStats = async (req, res) => {
  try {
    const isAdmin = req.user.role === "Admin";
    const isNGO = req.user.role === "ngo";

    const stats = {
      totalVolunteers: await Volunteer.countDocuments({}),
      activeVolunteers: await Volunteer.countDocuments({ status: "active" }),
      totalEvents: await Event.countDocuments({}),
      approvedEvents: await Event.countDocuments({ status: "approved" }),
      totalNGOs: await NGO.countDocuments({}),
      activeNGOs: await NGO.countDocuments({ status: "active" })
    };

    if (isNGO) {
      stats.myEvents = await Event.countDocuments({ createdBy: req.user.id });
      stats.myUpcomingEvents = await Event.countDocuments({
        createdBy: req.user.id,
        date: { $gte: new Date() }
      });
    }

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics"
    });
  }
};

exports.getVolunteerAnalytics = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admins can view volunteer analytics."
      });
    }

    const volunteersByStatus = await Volunteer.aggregate([
      { 
        $group: { 
          _id: { $toLower: "$status" },
          count: { $sum: 1 } 
        } 
      },
      { $sort: { count: -1 } }
    ]);

    const volunteersByMonth = await Volunteer.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json({
      success: true,
      data: {
        byStatus: volunteersByStatus.map(item => ({
          _id: normalizeStatus(item._id),
          count: item.count
        })),
        byMonth: volunteersByMonth.map(item => ({
          month: getMonthName(item._id),
          count: item.count
        }))
      }
    });
  } catch (error) {
    console.error("Volunteer analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch volunteer analytics"
    });
  }
};

exports.getEventAnalytics = async (req, res) => {
  try {
    const filter = req.user.role === "Admin" ? {} : { createdBy: req.user.id };

    // Get events by status with default zero counts
    const allStatuses = ["approved", "pending", "rejected"];
    const eventsByStatus = await Event.aggregate([
      { $match: filter },
      { 
        $group: { 
          _id: { $toLower: "$status" },
          count: { $sum: 1 } 
        } 
      },
      { $sort: { count: -1 } }
    ]);

    // Fill in missing statuses with zero counts
    const statusResults = allStatuses.map(status => {
      const found = eventsByStatus.find(item => item._id === status);
      return {
        _id: status,
        count: found ? found.count : 0
      };
    });

    // Get events by month for the current year
    const currentYear = new Date().getFullYear();
    const eventsByMonth = await Event.aggregate([
      { 
        $match: { 
          ...filter,
          date: { 
            $gte: new Date(`${currentYear}-01-01`),
            $lt: new Date(`${currentYear + 1}-01-01`)
          } 
        } 
      },
      {
        $group: {
          _id: { $month: "$date" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Fill in all months with zero counts if no events
    const monthResults = Array.from({ length: 12 }, (_, i) => {
      const monthNum = i + 1;
      const found = eventsByMonth.find(item => item._id === monthNum);
      return {
        month: getMonthName(monthNum),
        count: found ? found.count : 0
      };
    });

    res.json({
      success: true,
      data: {
        byStatus: statusResults,
        byMonth: monthResults
      }
    });
  } catch (error) {
    console.error("Event analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch event analytics"
    });
  }
};