'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import axios from 'axios';
import { ArrowLeft, Download, Search } from 'lucide-react';
import Link from 'next/link';

export default function ResultsPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const [data, setData] = useState<{ test: any, results: any[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const res = await axios.get(`/api/tests/${id}/results`);
            setData(res.data);
        } catch (err) {
            alert('Failed to load results');
        } finally {
            setLoading(false);
        }
    };

    const handleExportCSV = () => {
        if (!data) return;
        const headers = ['Name,USN,Department,Semester,Score,Total Marks,Submitted At'];
        const rows = data.results.map(r =>
            `"${r.studentName}","${r.usn}","${r.department}","${r.semester}","${r.score}","${r.totalMarks}","${new Date(r.submittedAt).toLocaleString()}"`
        );

        const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${data.test.title}_results.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (!data) return <div className="p-8">Test info not found</div>;

    const filteredResults = data.results.filter(r =>
        r.studentName.toLowerCase().includes(filter.toLowerCase()) ||
        r.usn.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <Link href="/teacher/dashboard">
                        <Button variant="secondary" className="gap-2">
                            <ArrowLeft size={16} /> Back
                        </Button>
                    </Link>
                    <Button className="gap-2" onClick={handleExportCSV}>
                        <Download size={16} /> Export CSV
                    </Button>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold mb-2">{data.test.title} - Results</h1>
                        <p className="text-gray-500">Total Submissions: {data.results.length}</p>
                    </div>

                    <div className="mb-6 relative">
                        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by Name or USN..."
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filter}
                            onChange={e => setFilter(e.target.value)}
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 text-sm">
                                <tr>
                                    <th className="p-4 rounded-l-xl">Student Name</th>
                                    <th className="p-4">USN</th>
                                    <th className="p-4">Department</th>
                                    <th className="p-4">Score</th>
                                    <th className="p-4 rounded-r-xl">Submitted At</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {filteredResults.map(r => (
                                    <tr key={r._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="p-4 font-medium">{r.studentName}</td>
                                        <td className="p-4 text-sm font-mono text-gray-500">{r.usn}</td>
                                        <td className="p-4 text-sm text-gray-500">{r.department} (Sem {r.semester})</td>
                                        <td className="p-4 font-bold text-blue-600">{r.score} / {r.totalMarks}</td>
                                        <td className="p-4 text-sm text-gray-400">{new Date(r.submittedAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                                {filteredResults.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-400">No results found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
