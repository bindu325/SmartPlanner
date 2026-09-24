const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const StudyPlan = require('../models/StudyPlan');

/**
 * Format Date to YYYY-MM-DD
 */
const formatDate = (date) => {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};

/**
 * Get difference in days between two dates
 */
const getDaysDifference = (futureDate, fromDate = new Date()) => {
  const future = new Date(futureDate);
  const current = new Date(fromDate);
  
  // Reset times to midnight for clean day calculation
  future.setHours(0, 0, 0, 0);
  current.setHours(0, 0, 0, 0);
  
  const diffTime = future.getTime() - current.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays); // Minimum 1 day
};

/**
 * Calculate Priority Score
 * Factors:
 * 1. Difficulty Weight: Hard=3.0, Medium=2.0, Easy=1.0
 * 2. Exam Urgency Weight: 100 / (daysRemaining + 1)
 * 3. Estimated Time Factor: min(estimatedMinutes / 60, 3)
 */
const calculatePriority = (topic, daysRemaining) => {
  const difficultyWeights = {
    Hard: 3.0,
    Medium: 2.0,
    Easy: 1.0,
  };

  const diffWeight = difficultyWeights[topic.difficulty] || 2.0;
  const urgencyWeight = 100 / (daysRemaining + 1);
  const timeFactor = Math.min((topic.estimatedMinutes || 60) / 60, 3.0);

  // Score formula
  return parseFloat((diffWeight * 25 + urgencyWeight * 1.5 + timeFactor * 10).toFixed(2));
};

/**
 * Generate Multi-phase sessions for a topic:
 * - LEARN: 60% of time
 * - PRACTICE: 25% of time
 * - REVISION: 15% of time
 */
const breakTopicIntoSessions = (userId, topic, subject, daysRemaining, priority) => {
  const totalMinutes = topic.estimatedMinutes;
  
  // If time is small (<= 45 mins), just 1 Learn session
  if (totalMinutes <= 45) {
    return [
      {
        userId,
        subjectId: subject._id,
        topicId: topic._id,
        taskType: 'LEARN',
        plannedMinutes: totalMinutes,
        priority: priority,
        status: 'PENDING',
        notes: `Focus learning for ${topic.name}`,
      },
    ];
  }

  const learnMinutes = Math.round(totalMinutes * 0.6);
  const practiceMinutes = Math.round(totalMinutes * 0.25);
  const revisionMinutes = totalMinutes - (learnMinutes + practiceMinutes);

  return [
    {
      userId,
      subjectId: subject._id,
      topicId: topic._id,
      taskType: 'LEARN',
      plannedMinutes: Math.max(20, learnMinutes),
      priority: priority,
      status: 'PENDING',
      notes: `Concept mastery & notes for ${topic.name}`,
    },
    {
      userId,
      subjectId: subject._id,
      topicId: topic._id,
      taskType: 'PRACTICE',
      plannedMinutes: Math.max(15, practiceMinutes),
      priority: priority * 0.9,
      status: 'PENDING',
      notes: `Exercises & practice problems for ${topic.name}`,
    },
    {
      userId,
      subjectId: subject._id,
      topicId: topic._id,
      taskType: 'REVISION',
      plannedMinutes: Math.max(15, revisionMinutes),
      priority: priority * 0.8,
      status: 'PENDING',
      notes: `Quick recall and revision before exam for ${topic.name}`,
    },
  ];
};

/**
 * Main Study Plan Generation Algorithm
 * @param {ObjectId} userId - The authenticated user's ID
 * @param {Number} dailyHoursAvailable - Daily study capacity in hours (e.g. 4)
 * @param {String|Date} startDate - Optional start date (defaults to today)
 */
const generateStudyPlan = async (userId, dailyHoursAvailable = 4, startDate = new Date()) => {
  const dailyCapacityMinutes = Math.max(60, Number(dailyHoursAvailable) * 60);

  // 1. Fetch only this user's subjects and uncompleted topics
  const subjects = await Subject.find({ userId });
  if (!subjects.length) {
    throw new Error('No subjects found. Please add subjects first.');
  }

  const subjectMap = {};
  subjects.forEach((s) => {
    subjectMap[s._id.toString()] = s;
  });

  const topics = await Topic.find({ userId, completionStatus: { $ne: 'COMPLETED' } });
  if (!topics.length) {
    throw new Error('No uncompleted topics found. Add topics or reset existing ones.');
  }

  // 2. Prepare task pool with calculated priorities
  let taskPool = [];

  for (const topic of topics) {
    const subject = subjectMap[topic.subjectId.toString()];
    if (!subject) continue;

    const daysRemaining = getDaysDifference(subject.examDate, startDate);
    const priority = calculatePriority(topic, daysRemaining);

    const sessions = breakTopicIntoSessions(userId, topic, subject, daysRemaining, priority);
    taskPool.push(...sessions);
  }

  // Sort tasks by priority descending (highest priority first)
  taskPool.sort((a, b) => b.priority - a.priority);

  // 3. Clear existing PENDING study plans from startDate onwards for this user
  const startFormatted = formatDate(startDate);
  await StudyPlan.deleteMany({
    userId,
    date: { $gte: startFormatted },
    status: 'PENDING',
  });

  // 4. Distribute tasks into daily slots
  const scheduledPlans = [];
  let currentDate = new Date(startDate);
  let currentDayMinutes = 0;
  let currentDayTasks = [];

  for (const task of taskPool) {
    // If adding this task exceeds capacity and we already have tasks scheduled today, move to next day
    if (currentDayMinutes + task.plannedMinutes > dailyCapacityMinutes && currentDayTasks.length > 0) {
      const dateStr = formatDate(currentDate);
      currentDayTasks.forEach((t) => {
        scheduledPlans.push({
          ...t,
          date: dateStr,
        });
      });

      // Advance to next day
      currentDate.setDate(currentDate.getDate() + 1);
      currentDayMinutes = 0;
      currentDayTasks = [];
    }

    currentDayTasks.push(task);
    currentDayMinutes += task.plannedMinutes;
  }

  // Add any remaining tasks for the last day
  if (currentDayTasks.length > 0) {
    const dateStr = formatDate(currentDate);
    currentDayTasks.forEach((t) => {
      scheduledPlans.push({
        ...t,
        date: dateStr,
      });
    });
  }

  // 5. Bulk insert into StudyPlan collection
  if (scheduledPlans.length > 0) {
    await StudyPlan.insertMany(scheduledPlans);
  }

  return {
    totalTasksGenerated: scheduledPlans.length,
    startDate: startFormatted,
    daysSpan: Math.ceil(scheduledPlans.length / Math.max(1, dailyCapacityMinutes / 60)),
    dailyCapacityMinutes,
  };
};

/**
 * Missed Task Rescheduling
 * Marks the task as MISSED and redistributes remaining time to future available slots for this user.
 */
const rescheduleMissedTask = async (userId, taskId, dailyHoursAvailable = 4) => {
  const task = await StudyPlan.findOne({ _id: taskId, userId }).populate('subjectId topicId');
  if (!task) {
    throw new Error('Task not found');
  }

  // Mark task as MISSED
  task.status = 'MISSED';
  await task.save();

  const dailyCapacityMinutes = Math.max(60, Number(dailyHoursAvailable) * 60);
  const remainingMinutes = Math.max(15, task.plannedMinutes - (task.completedMinutes || 0));

  // Determine starting date for rescheduling (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Calculate new priority score
  const daysRemaining = getDaysDifference(task.subjectId.examDate, tomorrow);
  const updatedPriority = calculatePriority(task.topicId, daysRemaining);

  // Find upcoming daily plans for this user
  let searchDate = new Date(tomorrow);
  let assignedDateStr = null;

  // Look ahead up to 60 days to find a day with capacity
  for (let i = 0; i < 60; i++) {
    const dateStr = formatDate(searchDate);
    const dayTasks = await StudyPlan.find({
      userId,
      date: dateStr,
      status: { $ne: 'MISSED' },
    });

    const totalMinutesScheduled = dayTasks.reduce((sum, t) => sum + t.plannedMinutes, 0);

    if (totalMinutesScheduled + remainingMinutes <= dailyCapacityMinutes) {
      assignedDateStr = dateStr;
      break;
    }

    searchDate.setDate(searchDate.getDate() + 1);
  }

  if (!assignedDateStr) {
    assignedDateStr = formatDate(searchDate);
  }

  // Create new replacement task
  const newTask = new StudyPlan({
    userId,
    date: assignedDateStr,
    subjectId: task.subjectId._id,
    topicId: task.topicId._id,
    taskType: task.taskType,
    plannedMinutes: remainingMinutes,
    completedMinutes: 0,
    priority: updatedPriority + 10, // boost priority since it was previously missed
    status: 'PENDING',
    notes: `Rescheduled from ${task.date} (${task.notes || 'Missed task catch-up'})`,
  });

  await newTask.save();

  return {
    originalTask: task,
    rescheduledTask: newTask,
  };
};

/**
 * Get aggregated progress statistics for this user
 */
const getProgressStats = async (userId) => {
  const totalTopics = await Topic.countDocuments({ userId });
  const completedTopics = await Topic.countDocuments({ userId, completionStatus: 'COMPLETED' });
  const inProgressTopics = await Topic.countDocuments({ userId, completionStatus: 'IN_PROGRESS' });
  const remainingTopics = totalTopics - completedTopics;

  const subjects = await Subject.find({ userId });
  const subjectProgress = [];

  for (const subject of subjects) {
    const subTopicsCount = await Topic.countDocuments({ userId, subjectId: subject._id });
    const subCompletedCount = await Topic.countDocuments({
      userId,
      subjectId: subject._id,
      completionStatus: 'COMPLETED',
    });

    subjectProgress.push({
      subjectId: subject._id,
      name: subject.name,
      color: subject.color,
      examDate: subject.examDate,
      daysRemaining: getDaysDifference(subject.examDate),
      totalTopics: subTopicsCount,
      completedTopics: subCompletedCount,
      percentage: subTopicsCount === 0 ? 0 : Math.round((subCompletedCount / subTopicsCount) * 100),
    });
  }

  const allTasks = await StudyPlan.find({ userId });
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter((t) => t.status === 'COMPLETED').length;
  const missedTasks = allTasks.filter((t) => t.status === 'MISSED').length;
  const pendingTasks = allTasks.filter((t) => t.status === 'PENDING').length;

  const plannedMinutes = allTasks.reduce((acc, curr) => acc + (curr.plannedMinutes || 0), 0);
  const completedMinutes = allTasks
    .filter((t) => t.status === 'COMPLETED')
    .reduce((acc, curr) => acc + (curr.completedMinutes || curr.plannedMinutes || 0), 0);

  return {
    overallPercentage: totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100),
    totalTopics,
    completedTopics,
    inProgressTopics,
    remainingTopics,
    totalTasks,
    completedTasks,
    missedTasks,
    pendingTasks,
    plannedHours: Number((plannedMinutes / 60).toFixed(1)),
    completedHours: Number((completedMinutes / 60).toFixed(1)),
    subjectProgress,
  };
};

module.exports = {
  generateStudyPlan,
  rescheduleMissedTask,
  getProgressStats,
  calculatePriority,
  getDaysDifference,
  formatDate,
};
