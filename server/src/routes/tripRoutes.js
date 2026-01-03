const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, tripController.createTrip);
router.get('/', authMiddleware, tripController.getTrips);
router.get('/:id', authMiddleware, tripController.getTrip); // Note: Middleware needed for checking ownership if private, but we handle it in controller. However, we need identity.
// If accessing public trip without login, authMiddleware might block it. 
// We should make auth optional for public viewing or have separate public endpoint. 
// Prompt says: GET /public/trips/:id. So this endpoint can be strictly for authenticated user or protected.
// For now, let's keep it simple: required auth for /trips/:id.

module.exports = router;
