import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';

interface TripProps {
    id: string;
    title: string;
    description?: string;
    start_date: string;
    end_date: string;
    visibility: string;
}

const TripCard: React.FC<{ trip: TripProps }> = ({ trip }) => {
    return (
        <Link to={`/trips/${trip.id}`} className="block group">
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100 dark:border-border-dark group-hover:border-primary/50">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark group-hover:text-primary transition-colors">
                        {trip.title}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${trip.visibility === 'public' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
                        {trip.visibility}
                    </span>
                </div>
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm mb-4 line-clamp-2">
                    {trip.description || "No description provided."}
                </p>
                <div className="flex items-center gap-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>{new Date(trip.start_date).toLocaleDateString()}</span>
                    </div>
                    {/* Placeholder for city count if available */}
                    <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        <span>View Itinerary</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default TripCard;
