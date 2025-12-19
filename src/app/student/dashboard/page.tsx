'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import axios from 'axios';
import { Play, CheckCircle, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function StudentDashboard() {
    const router = useRouter();
    const [activeTests, setActiveTests] = useState<any[]>([]);
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [testsRes, resultsRes] = await Promise.all([
                axios.get('/api/tests/student'),
                axios.get('/api/results/student')
            ]);
            setActiveTests(testsRes.data.tests);
            setResults(resultsRes.data.results);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex justify-between items-center bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Student Dashboard</h1>
                        <p className="text-gray-500 mt-1">Good luck with your exams!</p>
                    </div>
                    <Link href="/profile">
                        <Button variant="secondary">My Profile</Button>
                    </Link>
                </div>

                {/* Active Tests Section */}
                <div>
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Clock className="text-blue-600" /> Active Tests
                    </h2>

                    {activeTests.filter(t => !results.some(r => r.testId?._id === t._id)).length === 0 ? (
                        <div className="text-center py-10 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300">
                            <p className="text-gray-500">No active tests available for you right now.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {activeTests
                                .filter(t => !results.some(r => r.testId?._id === t._id)) // Exclude taken tests
                                .map(test => (
                                    <div key={test._id} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl shadow-blue-500/5 border border-blue-100 dark:border-gray-800 hover:scale-[1.02] transition-transform">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold uppercase">
                                                {test.duration} MINS
                                            </span>
                                            {test.settings?.requireCamera && (
                                                <span className="text-xs text-red-500 font-medium">📷 Camera Required</span>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">{test.title}</h3>
                                        <p className="text-sm text-gray-500 mb-6">{test.department} - {test.semester} Sem</p>

                                        <Link href={`/student/test/${test._id}`}>
                                            <Button className="w-full shadow-lg shadow-blue-500/20 group">
                                                Start Test <Play size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>

                {/* Past Results Section */}
                <div>
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <CheckCircle className="text-green-600" /> Past Attempts
                    </h2>

                    {results.length === 0 ? (
                        <p className="text-gray-500">You haven't taken any tests yet.</p>
                    ) : (
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 text-sm">
                                    <tr>
                                        <th className="p-4 font-medium">Test Name</th>
                                        <th className="p-4 font-medium">Date</th>
                                        <th className="p-4 font-medium">Score</th>
                                        <th className="p-4 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {results.map(r => (
                                        <tr key={r._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="p-4 font-medium">{r.testId?.title || 'Unknown Test'}</td>
                                            <td className="p-4 text-sm text-gray-500">{new Date(r.submittedAt).toLocaleDateString()}</td>
                                            <td className="p-4 font-bold text-blue-600">{r.score} / {r.totalMarks}</td>
                                            <td className="p-4">
                                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold uppercase">Completed</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
