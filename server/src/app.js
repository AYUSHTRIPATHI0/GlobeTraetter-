const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient(); // We'll move this to utils/prisma.js later if needed, or keep here for simplicity in fast start. Best practice: utils.

// Middleware
app.use(cors());
app.use(express.json());

// Routes Placeholder
app.get('/', (req, res) => {
    res.send('GlobalTrotters API is running');
});

// We will mount routes here
const authRoutes = require('./routes/authRoutes');

app.use('/api/auth', authRoutes);
const tripRoutes = require('./routes/tripRoutes');

app.use('/api/trips', tripRoutes);
const cityRoutes = require('./routes/cityRoutes');
app.use('/api/trips/:tripId/cities', cityRoutes);
const activityRoutes = require('./routes/activityRoutes');
app.use('/api/cities/:cityId/activities', activityRoutes);


// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

module.exports = app;
