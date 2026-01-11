'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/Button';
import { Download, ArrowLeft, Loader2 } from 'lucide-react';
import ScoreCard from '@/components/ScoreCard';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function ResultPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const router = useRouter();
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const scorecardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchResult();
    }, []);

    const fetchResult = async () => {
        try {
            const res = await axios.get(`/api/results/${id}`);
            setResult(res.data.result);
        } catch (err) {
            console.error(err);
            alert('Failed to load result');
            router.push('/student/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!scorecardRef.current) return;
        setDownloading(true);

        try {
            const canvas = await html2canvas(scorecardRef.current, {
                scale: 2, // Higher resolution
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`ScoreCard_${result.testId?.title || 'Test'}_${result.usn}.pdf`);

        } catch (err) {
            console.error(err);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
    if (!result) return <div>Result not found</div>;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-6 flex flex-col items-center">

            {/* Toolbar */}
            <div className="w-full max-w-3xl flex justify-between items-center mb-8 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                <Button variant="ghost" onClick={() => router.push('/student/dashboard')} className="gap-2">
                    <ArrowLeft size={16} /> Back to Dashboard
                </Button>
                <Button onClick={handleDownload} disabled={downloading} className="gap-2 shadow-lg shadow-blue-500/20">
                    {downloading ? (
                        <>
                            <Loader2 size={16} className="animate-spin" /> Generating PDF...
                        </>
                    ) : (
                        <>
                            <Download size={16} /> Download Score Card
                        </>
                    )}
                </Button>
            </div>

            {/* Score Card Preview */}
            <div className="overflow-auto max-w-full shadow-2xl">
                <ScoreCard ref={scorecardRef} result={result} />
            </div>

            <p className="mt-8 text-gray-400 text-sm">Preview of your Score Card</p>
        </div>
    );
}
