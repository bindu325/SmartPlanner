const StudyPlan = require('../models/StudyPlan');
const Topic = require('../models/Topic');
const {
  generateStudyPlan,
  rescheduleMissedTask,
  getProgressStats,
} = require('../services/plannerService');

// @desc    Generate full study schedule
// @route   POST /api/planner/generate
// @access  Private
exports.generatePlan = async (req, res) => {
  try {
    const { dailyHoursAvailable, startDate } = req.body;
    const result = await generateStudyPlan(req.user._id, dailyHoursAvailable, startDate);
    res.status(200).json({
      success: true,
      message: 'Study plan generated successfully',
      data: result,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get all study plans (with optional filters) for authenticated user
// @route   GET /api/planner
// @access  Private
exports.getPlans = async (req, res) => {
  try {
    const { status, subjectId, startDate, endDate } = req.query;
    const query = { userId: req.user._id };

    if (status) query.status = status;
    if (subjectId) query.subjectId = subjectId;
    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
      query.date = { $gte: startDate };
    }

    const plans = await StudyPlan.find(query)
      .populate('subjectId', 'name color examDate')
      .populate('topicId', 'name difficulty estimatedMinutes completionStatus')
      .sort({ date: 1, priority: -1 });

    res.status(200).json({ success: true, count: plans.length, data: plans });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get study plan for a specific date (YYYY-MM-DD) for authenticated user
// @route   GET /api/planner/date/:date
// @access  Private
exports.getPlanByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const plans = await StudyPlan.find({ userId: req.user._id, date })
      .populate('subjectId', 'name color examDate')
      .populate('topicId', 'name difficulty estimatedMinutes completionStatus')
      .sort({ priority: -1 });

    res.status(200).json({ success: true, count: plans.length, data: plans });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update task status (PENDING, COMPLETED, MISSED)
// @route   PUT /api/planner/:id/status
// @access  Private
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status, completedMinutes } = req.body;
    if (!['PENDING', 'COMPLETED', 'MISSED'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    const task = await StudyPlan.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    task.status = status;
    if (completedMinutes !== undefined) {
      task.completedMinutes = Number(completedMinutes);
    } else if (status === 'COMPLETED') {
      task.completedMinutes = task.plannedMinutes;
    }
    await task.save();

    // Check if all tasks for this topic are completed
    if (status === 'COMPLETED') {
      const remainingTopicTasks = await StudyPlan.find({
        userId: req.user._id,
        topicId: task.topicId,
        status: { $ne: 'COMPLETED' },
      });
      if (remainingTopicTasks.length === 0) {
        await Topic.findOneAndUpdate({ _id: task.topicId, userId: req.user._id }, { completionStatus: 'COMPLETED' });
      } else {
        await Topic.findOneAndUpdate({ _id: task.topicId, userId: req.user._id }, { completionStatus: 'IN_PROGRESS' });
      }
    }

    res.status(200).json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Reschedule a missed task
// @route   POST /api/planner/reschedule
// @access  Private
exports.rescheduleTask = async (req, res) => {
  try {
    const { taskId, dailyHoursAvailable } = req.body;
    if (!taskId) {
      return res.status(400).json({ success: false, error: 'TaskId is required' });
    }

    const result = await rescheduleMissedTask(req.user._id, taskId, dailyHoursAvailable || 4);
    res.status(200).json({
      success: true,
      message: 'Task rescheduled successfully',
      data: result,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get all progress stats for authenticated user
// @route   GET /api/planner/progress
// @access  Private
exports.getProgress = async (req, res) => {
  try {
    const stats = await getProgressStats(req.user._id);
    res.status(200).json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
