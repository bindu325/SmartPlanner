const express = require('express');
const router = express.Router();
const {
  generatePlan,
  getPlans,
  getPlanByDate,
  updateTaskStatus,
  rescheduleTask,
  getProgress,
} = require('../controllers/plannerController');
const { protect } = require('../middleware/authMiddleware');

// All planner routes are protected
router.use(protect);

router.post('/generate', generatePlan);
router.get('/', getPlans);
router.get('/date/:date', getPlanByDate);
router.put('/:id/status', updateTaskStatus);
router.post('/reschedule', rescheduleTask);
router.get('/progress', getProgress);

module.exports = router;
