'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import axios from 'axios';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await axios.post('/api/auth/login', formData);
            const { role } = res.data.user;

            // Redirect based on role
            if (role === 'student') {
                router.push('/student/dashboard');
            } else {
                router.push('/teacher/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Welcome Back
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Sign in to access your dashboard
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="p-3 bg-red-50 text-red-500 text-sm rounded-lg border border-red-100 dark:bg-red-900/20 dark:border-red-900/50">
                        {error}
                    </div>
                )}

                <Input
                    label="Email Address"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                />

                <Button type="submit" className="w-full" isLoading={loading}>
                    Sign In
                </Button>

                <div className="text-center text-sm text-gray-500">
                    Don't have an account?{' '}
                    <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-500">
                        Register here
                    </Link>
                </div>
            </form>
        </div>
    );
}
