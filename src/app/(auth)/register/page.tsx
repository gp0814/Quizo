'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import axios from 'axios';
import { ChevronDown } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [role, setRole] = useState<'student' | 'teacher'>('student');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        department: '',
        usn: '',
        semester: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = { ...formData, role };
            await axios.post('/api/auth/register', payload);
            router.push('/login');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="mb-6 text-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Create Account
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Join Quizo today
                </p>
            </div>

            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-6">
                <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${role === 'student'
                        ? 'bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}
                >
                    Student
                </button>
                <button
                    type="button"
                    onClick={() => setRole('teacher')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${role === 'teacher'
                        ? 'bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}
                >
                    Teacher
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 bg-red-50 text-red-500 text-sm rounded-lg border border-red-100">
                        {error}
                    </div>
                )}

                <Input
                    label="Full Name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />

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

                <div className="grid grid-cols-2 gap-4">
                    <div className="w-full space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                            Department
                        </label>
                        <div className="relative">
                            <select
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                required
                                className="flex w-full rounded-xl border-2 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 px-4 py-3 text-sm ring-offset-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 appearance-none"
                            >
                                <option value="" disabled>Select Department</option>
                                <option value="AIML">AIML</option>
                                <option value="CSE">CSE</option>
                                <option value="ISE">ISE</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                <ChevronDown size={16} />
                            </div>
                        </div>
                    </div>
                    {role === 'student' && (
                        <Input
                            label="Semester"
                            placeholder="6"
                            value={formData.semester}
                            onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                            required
                        />
                    )}
                </div>

                {role === 'student' && (
                    <Input
                        label="USN"
                        placeholder="1AB20CS001"
                        value={formData.usn}
                        onChange={(e) => setFormData({ ...formData, usn: e.target.value })}
                        required
                    />
                )}

                <Button type="submit" className="w-full mt-2" isLoading={loading}>
                    Register as {role === 'student' ? 'Student' : 'Teacher'}
                </Button>

                <div className="text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500">
                        Sign in
                    </Link>
                </div>
            </form>
        </div>
    );
}
