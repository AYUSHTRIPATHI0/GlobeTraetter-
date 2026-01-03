const prisma = require('../utils/prisma');
const { z } = require('zod');

const citySchema = z.object({
    city_name: z.string().min(1),
    country: z.string().min(1),
    arrival_date: z.string().transform((str) => new Date(str)),
    departure_date: z.string().transform((str) => new Date(str)),
});

exports.addCity = async (req, res) => {
    try {
        const tripId = req.params.tripId;
        const data = citySchema.parse(req.body);

        const trip = await prisma.trip.findUnique({ where: { id: tripId } });
        if (!trip) return res.status(404).json({ error: 'Trip not found' });
        if (trip.user_id !== req.user.userId) return res.status(403).json({ error: 'Access denied' });

        if (data.departure_date < data.arrival_date) {
            return res.status(400).json({ error: "Departure cannot be before arrival" });
        }

        const city = await prisma.city.create({
            data: {
                ...data,
                trip_id: tripId,
            },
        });

        res.status(201).json(city);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        res.status(500).json({ error: 'Failed to add city', details: error.message });
    }
};

exports.getCities = async (req, res) => {
    try {
        const tripId = req.params.tripId;
        // Check trip access (public or owner)
        const trip = await prisma.trip.findUnique({ where: { id: tripId } });
        if (!trip) return res.status(404).json({ error: 'Trip not found' });

        if (trip.visibility === 'private' && trip.user_id !== req.user.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const cities = await prisma.city.findMany({
            where: { trip_id: tripId },
            include: { activities: true },
            orderBy: { arrival_date: 'asc' },
        });
        res.json(cities);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch cities' });
    }
};

exports.deleteCity = async (req, res) => {
    try {
        const { id, tripId } = req.params;
        // Verify ownership via Trip
        const city = await prisma.city.findUnique({ where: { id }, include: { trip: true } });
        if (!city) return res.status(404).json({ error: "City not found" });
        if (city.trip.user_id !== req.user.userId) return res.status(403).json({ error: "Access denied" });

        await prisma.city.delete({ where: { id } });
        res.json({ message: "City deleted" });
    } catch (e) {
        res.status(500).json({ error: "Failed to delete city" });
    }
}
