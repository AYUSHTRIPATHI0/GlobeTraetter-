import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Calendar, Type } from 'lucide-react';

const NewTrip = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [visibility, setVisibility] = useState('private');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/trips', {
                title,
                description,
                start_date: startDate,
                end_date: endDate,
                visibility,
            });
            navigate(`/trips/${response.data.id}`);
        } catch (err: any) {
            if (Array.isArray(err.response?.data?.error)) {
                setError(err.response.data.error.map((e: any) => e.message).join(', '));
            } else {
                setError(err.response?.data?.error || 'Failed to create trip');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-6 py-10 max-w-2xl">
            <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">Plan a New Adventure ✈️</h1>

            <div className="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-lg p-8 border border-gray-100 dark:border-border-dark">
                {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Trip Title</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-background-dark border border-transparent focus:border-primary focus:ring-0 text-text-primary-light dark:text-text-primary-dark transition-all"
                                placeholder="e.g., Summer in Italy"
                                required
                            />
                            <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Start Date</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-background-dark border border-transparent focus:border-primary focus:ring-0 text-text-primary-light dark:text-text-primary-dark transition-all"
                                    required
                                />
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">End Date</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-background-dark border border-transparent focus:border-primary focus:ring-0 text-text-primary-light dark:text-text-primary-dark transition-all"
                                    required
                                />
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Visibility</label>
                        <select
                            value={visibility}
                            onChange={(e) => setVisibility(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-background-dark border border-transparent focus:border-primary focus:ring-0 text-text-primary-light dark:text-text-primary-dark transition-all"
                        >
                            <option value="private">Private (Only you)</option>
                            <option value="public">Public (Shareable link)</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Description (Optional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-background-dark border border-transparent focus:border-primary focus:ring-0 text-text-primary-light dark:text-text-primary-dark transition-all min-h-[100px]"
                            placeholder="What's the plan?"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-[0.98] disabled:opacity-70"
                    >
                        {loading ? 'Creating...' : 'Create Trip'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewTrip;
