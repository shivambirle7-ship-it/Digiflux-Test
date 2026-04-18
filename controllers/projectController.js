const Project = require('../models/Project');

/**
 * Get projects with sorting and filtering logic
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getProjects = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // 1. Default View (No Filters)
    if (!startDate || !endDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Records should be sorted based on the nearest due date from today (ascending order)
      const projects = await Project.find({
        dueDate: { $gte: today }
      }).sort({ dueDate: 1 });

      return res.status(200).json({
        success: true,
        count: projects.length,
        view: 'default',
        data: projects
      });
    }

    // 2. Filtered View (By Due Date Range)
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    // Set end date to end of day to include records on that day
    endDateObj.setHours(23, 59, 59, 999);

    const pipeline = [
      {
        $match: {
          $or: [
            { dueDate: { $gte: startDateObj, $lte: endDateObj } },
            { highlighters: 'Hour A Day' }
          ]
        }
      },
      {
        $addFields: {
          isInRange: {
            $and: [
              { $gte: ['$dueDate', startDateObj] },
              { $lte: ['$dueDate', endDateObj] }
            ]
          },
          // Extract date part for sorting (YYYY-MM-DD)
          dateOnly: { $dateToString: { format: '%Y-%m-%d', date: '$dueDate' } },
          // Assign numerical priority based on requirement
          priority: {
            $switch: {
              branches: [
                { case: { $eq: ['$status', 'Hot promise'] }, then: 1 },
                { case: { $eq: ['$status', 'Customer'] }, then: 2 },
                { 
                  case: { 
                    $and: [
                      { $eq: ['$status', 'promise'] }, 
                      { $eq: [{ $indexOfArray: ['$highlighters', 'Hour A Day'] }, -1] }
                    ] 
                  }, 
                  then: 3 
                },
                { 
                  case: { $ne: [{ $indexOfArray: ['$highlighters', 'Hour A Day'] }, -1] }, 
                  then: 4 
                }
              ],
              default: 5
            }
          }
        }
      },
      {
        $sort: {
          isInRange: -1,   // Filtered range first, then appended "Hour A Day"
          dateOnly: 1,      // Within each range group, sort by day
          priority: 1,      // Within each day, apply priority (Hot promise > ... > Hour A Day)
          dueDate: 1        // Secondary fallback for time within same day/priority
        }
      },
      {
        $project: {
          isInRange: 0,
          priority: 0,
          dateOnly: 0
        }
      }
    ];

    const projects = await Project.aggregate(pipeline);

    res.status(200).json({
      success: true,
      count: projects.length,
      view: 'filtered',
      range: { startDate, endDate },
      data: projects
    });

  } catch (error) {
    console.error('Error in getProjects:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred while fetching projects',
      error: error.message
    });
  }
};
