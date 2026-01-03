import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import TripCard from '../components/TripCard';
import { Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const [trips, setTrips] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchTrips();
    }, []);

    const fetchTrips = async () => {
        try {
            const response = await api.get('/trips');
            setTrips(response.data);
        } catch (error) {
            console.error('Failed to fetch trips', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-6 py-10">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-1">
                        Hello, {user?.name?.split(' ')[0] || 'Traveler'} 👋
                    </h1>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark">Here are your upcoming adventures.</p>
                </div>
                <Link
                    to="/trips/new"
                    className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center gap-2 active:scale-95"
                >
                    <Plus size={20} />
                    Create Trip
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div></div>
            ) : trips.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trips.map((trip) => (
                        <TripCard key={trip.id} trip={trip} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-surface-light dark:bg-surface-dark rounded-3xl border border-dashed border-gray-300 dark:border-border-dark">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <Plus size={32} />
                    </div>
                    <h3 className="text-xl font-medium text-text-primary-light dark:text-text-primary-dark mb-2">No trips planned yet</h3>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">Start planning your next great escape today.</p>
                    <Link to="/trips/new" className="text-primary font-semibold hover:underline">Start a new trip</Link>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
