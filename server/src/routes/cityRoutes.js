const express = require('express');
const router = express.Router({ mergeParams: true }); // Important for accessing :tripId from parent router if nested
const cityController = require('../controllers/cityController');
const authMiddleware = require('../middleware/authMiddleware');

// Using mergeParams, we can mount this on /api/trips/:tripId/cities
// OR we can make it standalone and pass IDs in body/params.
// Prompt says: POST /trips/:id/cities
// So in `tripRoutes.js`, we can mount this. OR in `app.js` mount `api/trips/:tripId/cities` to this router.
// Easier: Mount `api/trips` and add `/cities` there?
// Let's define routes here as:
// POST / (meaning /api/trips/:tripId/cities/)
// GET / 

router.post('/', authMiddleware, cityController.addCity);
router.get('/', authMiddleware, cityController.getCities);
router.delete('/:id', authMiddleware, cityController.deleteCity);

module.exports = router;
