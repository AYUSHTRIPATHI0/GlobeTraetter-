import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { Calendar, MapPin, Plus, Trash2 } from 'lucide-react';

const TripDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [trip, setTrip] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // City Form State
    const [showCityForm, setShowCityForm] = useState(false);
    const [cityName, setCityName] = useState('');
    const [country, setCountry] = useState('');
    const [arrivalDate, setArrivalDate] = useState('');
    const [departureDate, setDepartureDate] = useState('');

    useEffect(() => {
        fetchTrip();
    }, [id]);

    const fetchTrip = async () => {
        try {
            const response = await api.get(`/trips/${id}`);
            setTrip(response.data);
        } catch (err: any) {
            setError('Failed to load trip details');
        } finally {
            setLoading(false);
        }
    };

    const handleAddCity = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post(`/trips/${id}/cities`, {
                city_name: cityName,
                country,
                arrival_date: arrivalDate,
                departure_date: departureDate,
            });
            setShowCityForm(false);
            fetchTrip(); // Refresh
            // Reset form
            setCityName(''); setCountry(''); setArrivalDate(''); setDepartureDate('');
        } catch (err: any) {
            alert(err.response?.data?.error || "Failed to add city");
        }
    };

    const handleDeleteCity = async (cityId: string) => {
        if (!confirm("Delete this city?")) return;
        try {
            await api.delete(`/trips/${id}/cities/${cityId}`);
            fetchTrip();
        } catch (e) { alert("Failed to delete"); }
    }

    if (loading) return <div className="p-10 text-center">Loading trip...</div>;
    if (error || !trip) return <div className="p-10 text-center text-red-500">{error || 'Trip not found'}</div>;

    return (
        <div className="container mx-auto px-6 py-10">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">{trip.title}</h1>
                <div className="flex items-center gap-4 text-text-secondary-light dark:text-text-secondary-dark">
                    <span className="flex items-center gap-1"><Calendar size={18} /> {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-sm">{trip.visibility}</span>
                </div>
                <p className="mt-4 text-text-primary-light dark:text-text-primary-dark">{trip.description}</p>
                <div className="mt-4 text-sm text-text-secondary-light">
                    Total Estimated Cost: ${trip.expenses?.reduce((acc: number, curr: any) => acc + curr.amount, 0) || 0}
                </div>
            </div>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">Itinerary</h2>
                <button
                    onClick={() => setShowCityForm(!showCityForm)}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl transition-all"
                >
                    <Plus size={18} /> Add City
                </button>
            </div>

            {showCityForm && (
                <div className="mb-8 bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-border-dark animate-fade-in">
                    <h3 className="text-lg font-semibold mb-4 text-text-primary-light dark:text-text-primary-dark">Add a Stop</h3>
                    <form onSubmit={handleAddCity} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input placeholder="City Name" value={cityName} onChange={e => setCityName(e.target.value)} className="p-3 rounded-lg bg-gray-50 dark:bg-background-dark border-none" required />
                        <input placeholder="Country" value={country} onChange={e => setCountry(e.target.value)} className="p-3 rounded-lg bg-gray-50 dark:bg-background-dark border-none" required />
                        <input type="date" value={arrivalDate} onChange={e => setArrivalDate(e.target.value)} className="p-3 rounded-lg bg-gray-50 dark:bg-background-dark border-none" required />
                        <input type="date" value={departureDate} onChange={e => setDepartureDate(e.target.value)} className="p-3 rounded-lg bg-gray-50 dark:bg-background-dark border-none" required />
                        <div className="md:col-span-2">
                            <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-medium">Save City</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="space-y-6">
                {trip.cities?.length === 0 && <div className="text-center py-10 text-gray-400">No cities added yet. Start by adding a destination!</div>}
                {trip.cities?.map((city: any) => (
                    <div key={city.id} className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-border-dark">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark flex items-center gap-2">
                                    <MapPin size={20} className="text-primary" /> {city.city_name}, {city.country}
                                </h3>
                                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
                                    {new Date(city.arrival_date).toLocaleDateString()} - {new Date(city.departure_date).toLocaleDateString()}
                                </p>
                            </div>
                            <button onClick={() => handleDeleteCity(city.id)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={18} /></button>
                        </div>

                        {/* Activities Section - Simplified for now */}
                        <div className="mt-6 pl-4 border-l-2 border-gray-200 dark:border-border-dark">
                            <h4 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 text-sm uppercase tracking-wider">Activities</h4>
                            {city.activities?.length === 0 && <div className="text-sm text-gray-400 italic">No activities planned.</div>}
                            {city.activities?.map((act: any) => (
                                <div key={act.id} className="flex justify-between text-sm py-1">
                                    <span>{act.title}</span>
                                    <span className="text-text-secondary-light">${act.estimated_cost}</span>
                                </div>
                            ))}
                            {/* Placeholder for adding activity */}
                            <div className="mt-2 text-xs text-primary cursor-pointer hover:underline">+ Add Activity (Coming Soon)</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TripDetails;
