const prisma = require('../utils/prisma');
const { z } = require('zod');

const tripSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    start_date: z.string().transform((str) => new Date(str)),
    end_date: z.string().transform((str) => new Date(str)),
    visibility: z.enum(['public', 'private']).default('private'),
});

exports.createTrip = async (req, res) => {
    try {
        const data = tripSchema.parse(req.body);

        // Validate dates
        if (data.end_date < data.start_date) {
            return res.status(400).json({ error: "End date cannot be before start date" });
        }

        const trip = await prisma.trip.create({
            data: {
                ...data,
                user_id: req.user.userId,
            },
        });

        res.status(201).json(trip);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error(error);
        res.status(500).json({ error: 'Failed to create trip' });
    }
};

exports.getTrips = async (req, res) => {
    try {
        const trips = await prisma.trip.findMany({
            where: { user_id: req.user.userId },
            orderBy: { start_date: 'asc' },
        });
        res.json(trips);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch trips' });
    }
};

exports.getTrip = async (req, res) => {
    try {
        const trip = await prisma.trip.findUnique({
            where: { id: req.params.id },
            include: { cities: { include: { activities: true } }, expenses: true },
        });

        if (!trip) return res.status(404).json({ error: 'Trip not found' });

        // Access control: Owner or Public
        if (trip.visibility === 'private' && trip.user_id !== req.user.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json(trip);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch trip' });
    }
};
