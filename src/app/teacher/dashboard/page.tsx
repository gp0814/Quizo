'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import axios from 'axios';
import { Plus, BarChart2, Calendar, Clock, Edit2, Trash2, Power } from 'lucide-react';

export default function TeacherDashboard() {
    const [tests, setTests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        try {
            const res = await axios.get('/api/tests/teacher');
            setTests(res.data.tests);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            await axios.put(`/api/tests/${id}`, { isActive: !currentStatus });
            // Update local state optimistic
            setTests(prev => prev.map(t => t._id === id ? { ...t, isActive: !currentStatus } : t));
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const deleteTest = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            await axios.delete(`/api/tests/${id}`);
            setTests(prev => prev.filter(t => t._id !== id));
        } catch (err) {
            alert('Failed to delete');
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Teacher Dashboard</h1>
                        <p className="text-gray-500 mt-1">Manage your tests and view results</p>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/profile">
                            <Button variant="secondary">My Profile</Button>
                        </Link>
                        <Link href="/teacher/create-test">
                            <Button className="gap-2 shadow-lg shadow-blue-500/20">
                                <Plus size={20} /> Create New Test
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Row (Optional placeholder) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Add stats cards here if needed */}
                </div>

                {/* Tests Grid */}
                <div>
                    <h2 className="text-xl font-bold mb-6">Your Tests</h2>

                    {tests.length === 0 ? (
                        <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-300">
                            <p className="text-gray-500 text-lg">No tests created yet.</p>
                            <Link href="/teacher/create-test" className="text-blue-600 font-semibold mt-2 inline-block">Create one now</Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tests.map(test => (
                                <div key={test._id} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow relative overflow-hidden group">
                                    {/* Status Badge */}
                                    <div className={`absolute top-0 right-0 px-4 py-1 rounded-bl-2xl text-xs font-bold uppercase tracking-wider ${test.isActive ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                        }`}>
                                        {test.isActive ? 'Active' : 'Inactive'}
                                    </div>

                                    <h3 className="text-xl font-bold mb-2 line-clamp-1" title={test.title}>{test.title}</h3>
                                    <div className="space-y-2 text-sm text-gray-500 mb-6">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} /> {test.department} - {test.semester} Sem
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} /> {test.duration} mins
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <BarChart2 size={14} /> 0 Submissions {/* Mock Count */}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 border-t pt-4 dark:border-gray-800">
                                        <button
                                            onClick={() => toggleStatus(test._id, test.isActive)}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${test.isActive ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-green-50 text-green-600 hover:bg-green-100'
                                                }`}
                                        >
                                            <Power size={16} /> {test.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <Link href={`/teacher/test/${test._id}/results`}>
                                            <button
                                                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                                                title="View Results"
                                            >
                                                <BarChart2 size={18} />
                                            </button>
                                        </Link>
                                        <Link href={`/teacher/edit-test/${test._id}`}>
                                            <button
                                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                                                title="Edit Test"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                        </Link>

                                        <button
                                            onClick={() => deleteTest(test._id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
