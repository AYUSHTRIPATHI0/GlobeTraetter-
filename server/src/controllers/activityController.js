const prisma = require('../utils/prisma');
const { z } = require('zod');

const activitySchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    activity_date: z.string().transform((str) => new Date(str)),
    estimated_cost: z.number().min(0),
    category: z.string(),
});

exports.addActivity = async (req, res) => {
    try {
        const cityId = req.params.cityId;
        const data = activitySchema.parse(req.body);

        const city = await prisma.city.findUnique({ where: { id: cityId }, include: { trip: true } });
        if (!city) return res.status(404).json({ error: 'City not found' });
        if (city.trip.user_id !== req.user.userId) return res.status(403).json({ error: 'Access denied' });

        // Validate Activity Date within City dates? Optional but good.
        // data.activity_date should be between city.arrival_date and departure_date

        // Add activity
        const activity = await prisma.activity.create({
            data: {
                ...data,
                city_id: cityId,
            },
        });

        // Also add to expenses automatically? Prompt says: Expenses: trip_id, activity_id (nullable).
        // "Results usable for itinerary insertion"
        // "Cost Breakdown: Per-city cost, limit to trip_id"
        // Let's create an expense entry automatically for the activity cost.
        await prisma.expense.create({
            data: {
                trip_id: city.trip_id,
                activity_id: activity.id,
                amount: data.estimated_cost,
                expense_type: data.category, // or 'activity'
                currency: 'USD'
            }
        });

        res.status(201).json(activity);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        res.status(500).json({ error: 'Failed to add activity', details: error.message });
    }
};

exports.deleteActivity = async (req, res) => {
    // Implement delete logic here
    try {
        const { id } = req.params;
        const activity = await prisma.activity.findUnique({ where: { id }, include: { city: { include: { trip: true } } } });
        if (!activity) return res.status(404).json({ error: "Activity not found" });
        if (activity.city.trip.user_id !== req.user.userId) return res.status(403).json({ error: "Access denied" });

        await prisma.activity.delete({ where: { id } });
        res.json({ message: "Activity deleted" });
    } catch (e) {
        res.status(500).json({ error: "Failed to delete activity" });
    }
}
