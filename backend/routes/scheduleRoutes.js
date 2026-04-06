const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.get('/', authenticate, scheduleController.getAllSchedules);
router.post('/', authenticate, authorize(['admin']), scheduleController.createSchedule);
router.delete('/:id', authenticate, authorize(['admin']), scheduleController.deleteSchedule);

module.exports = router;
