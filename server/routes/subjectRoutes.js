const express = require('express');
const router = express.Router();
const {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
} = require('../controllers/subjectController');
const topicRouter = require('./topicRoutes');
const { protect } = require('../middleware/authMiddleware');

// All subject routes are protected
router.use(protect);

// Re-route into other resource routers
router.use('/:subjectId/topics', topicRouter);

router.route('/').get(getSubjects).post(createSubject);
router.route('/:id').get(getSubjectById).put(updateSubject).delete(deleteSubject);

module.exports = router;
