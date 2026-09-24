const Topic = require('../models/Topic');
const Subject = require('../models/Subject');
const StudyPlan = require('../models/StudyPlan');

// @desc    Get topics for a subject
// @route   GET /api/subjects/:subjectId/topics
// @access  Private
exports.getTopicsBySubject = async (req, res) => {
  try {
    const subject = await Subject.findOne({ _id: req.params.subjectId, userId: req.user._id });
    if (!subject) {
      return res.status(404).json({ success: false, error: 'Subject not found' });
    }

    const topics = await Topic.find({ subjectId: req.params.subjectId, userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: topics.length, data: topics });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Add topic under a subject
// @route   POST /api/subjects/:subjectId/topics
// @access  Private
exports.createTopic = async (req, res) => {
  try {
    const { name, difficulty, estimatedMinutes } = req.body;
    const subjectId = req.params.subjectId;

    const subject = await Subject.findOne({ _id: subjectId, userId: req.user._id });
    if (!subject) {
      return res.status(404).json({ success: false, error: 'Subject not found' });
    }

    if (!name || !estimatedMinutes) {
      return res.status(400).json({ success: false, error: 'Topic name and estimated time are required' });
    }

    const topic = await Topic.create({
      userId: req.user._id,
      subjectId,
      name: name.trim(),
      difficulty: difficulty || 'Medium',
      estimatedMinutes: Number(estimatedMinutes),
    });

    res.status(201).json({ success: true, data: topic });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update topic
// @route   PUT /api/topics/:id
// @access  Private
exports.updateTopic = async (req, res) => {
  try {
    const { name, difficulty, estimatedMinutes, completionStatus } = req.body;
    let topic = await Topic.findOne({ _id: req.params.id, userId: req.user._id });
    if (!topic) {
      return res.status(404).json({ success: false, error: 'Topic not found' });
    }

    topic = await Topic.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { name, difficulty, estimatedMinutes, completionStatus },
      { new: true, runValidators: true }
    );

    // If marked as COMPLETED, also update related study tasks for this user
    if (completionStatus === 'COMPLETED') {
      await StudyPlan.updateMany(
        { topicId: req.params.id, userId: req.user._id, status: 'PENDING' },
        { status: 'COMPLETED' }
      );
    }

    res.status(200).json({ success: true, data: topic });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Delete topic
// @route   DELETE /api/topics/:id
// @access  Private
exports.deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findOne({ _id: req.params.id, userId: req.user._id });
    if (!topic) {
      return res.status(404).json({ success: false, error: 'Topic not found' });
    }

    await StudyPlan.deleteMany({ topicId: req.params.id, userId: req.user._id });
    await Topic.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
