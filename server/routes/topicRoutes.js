const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getTopicsBySubject,
  createTopic,
  updateTopic,
  deleteTopic,
} = require('../controllers/topicController');
const { protect } = require('../middleware/authMiddleware');

// All topic routes are protected
router.use(protect);

// Nested routes: /api/subjects/:subjectId/topics
router.route('/').get(getTopicsBySubject).post(createTopic);

// Direct topic routes: /api/topics/:id
router.route('/:id').put(updateTopic).delete(deleteTopic);

module.exports = router;
