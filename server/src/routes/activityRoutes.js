const express = require('express');
const router = express.Router({ mergeParams: true });
const activityController = require('../controllers/activityController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, activityController.addActivity);
router.delete('/:id', authMiddleware, activityController.deleteActivity);

module.exports = router;
