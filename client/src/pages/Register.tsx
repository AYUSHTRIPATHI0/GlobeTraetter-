import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/auth/register', { name, email, password });
            login(response.data.token, response.data.user);
            navigate('/');
        } catch (err: any) {
            if (Array.isArray(err.response?.data?.error)) {
                setError(err.response.data.error.map((e: any) => e.message).join(', '));
            } else {
                setError(err.response?.data?.error || 'Registration failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-6">
            <div className="w-full max-w-md bg-surface-light dark:bg-surface-dark rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-border-dark">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">Join GlobalTrotters 🌍</h1>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark">Start planning your dream adventures</p>
                </div>

                {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Full Name</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-background-dark border border-transparent focus:border-primary focus:ring-0 text-text-primary-light dark:text-text-primary-dark transition-all"
                                placeholder="John Doe"
                                required
                            />
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Email</label>
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-background-dark border border-transparent focus:border-primary focus:ring-0 text-text-primary-light dark:text-text-primary-dark transition-all"
                                placeholder="name@example.com"
                                required
                            />
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-background-dark border border-transparent focus:border-primary focus:ring-0 text-text-primary-light dark:text-text-primary-dark transition-all"
                                placeholder="Minimum 6 characters"
                                minLength={6}
                                required
                            />
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-70"
                    >
                        {loading ? 'Creating Account...' : 'Get Started'}
                        {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
