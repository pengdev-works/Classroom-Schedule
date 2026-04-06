const express = require('express');
const router = express.Router();
const sectionController = require('../controllers/sectionController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.get('/', authenticate, sectionController.getAllSections);
router.post('/', authenticate, authorize(['admin']), sectionController.createSection);
router.put('/:id', authenticate, authorize(['admin']), sectionController.updateSection);
router.delete('/:id', authenticate, authorize(['admin']), sectionController.deleteSection);

module.exports = router;
