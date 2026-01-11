'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import axios from 'axios';
import { AlertTriangle, Expand, Camera, Clock } from 'lucide-react';

export default function TestPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [test, setTest] = useState<any>(null);
    const [started, setStarted] = useState(false);

    const [startError, setStartError] = useState<string | null>(null);

    // Proctoring State
    const [warnings, setWarnings] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [violation, setViolation] = useState<string | null>(null);

    // Exam State
    const [timeLeft, setTimeLeft] = useState(0); // seconds
    const [answers, setAnswers] = useState<{ [key: string]: string }>({}); // questionId -> option
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const isSubmitting = useRef(false);

    useEffect(() => {
        fetchTestDetails();
    }, []);

    // Effect to attach video stream when test starts and video element is mounted
    useEffect(() => {
        if (started && streamRef.current && videoRef.current) {
            videoRef.current.srcObject = streamRef.current;
            videoRef.current.play().catch(e => console.error("Video play failed:", e));
        }
    }, [started]);

    useEffect(() => {
        if (!started) return;

        // Timer
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    submitTest();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Tab Switch Detection
        const handleVisibilityChange = () => {
            if (document.hidden) {
                handleViolation("Tab switching detected!");
            }
        };

        // Fullscreen Check
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement && !loading && started) {
                // only warn if test is active and not submitted
                setIsFullscreen(false);
                handleViolation("Exited fullscreen mode!");
            } else {
                setIsFullscreen(true);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        document.addEventListener("fullscreenchange", handleFullscreenChange);

        return () => {
            clearInterval(timer);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, [started]);

    const fetchTestDetails = async () => {
        try {
            const res = await axios.get(`/api/tests/${id}/start`);
            setTest(res.data.test);
            setTimeLeft(res.data.test.duration * 60);
        } catch (err: any) {
            if (err.response?.status === 403) {
                // Show professional error message instead of alert
                setStartError(err.response.data.error || 'Access Denied');
            } else {
                console.error(err);
                alert('Failed to load test');
            }
        } finally {
            setLoading(false);
        }
    };

    const startTest = async () => {
        try {
            if (test.settings.requireCamera) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    streamRef.current = stream; // Store stream for later use
                } catch (e) {
                    alert('Camera permission is required to start this test.');
                    return;
                }
            }

            try {
                await document.documentElement.requestFullscreen();
            } catch (err) {
                console.log("Fullscreen request failed", err);
            }

            setStarted(true);
        } catch (e) {
            alert('Failed to start test.');
        }
    };

    const submitTest = async () => {
        if (isSubmitting.current) return;
        isSubmitting.current = true;

        // Stop streams
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
        }
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
            tracks.forEach(t => t.stop());
        }

        try {
            // Format answers
            const answersArray = Object.entries(answers).map(([key, value]) => ({
                questionId: key,
                value
            }));

            setStarted(false); // Stop monitoring immediately 

            const res = await axios.post(`/api/tests/${id}/submit`, { answers: answersArray });

            // Explicitly exit fullscreen
            if (document.fullscreenElement) {
                await document.exitFullscreen().catch(err => console.log("Exit fullscreen failed", err));
            }

            router.push(`/student/results/${res.data.resultId}`);
            // alert('Test Submitted Successfully!');
        } catch (err) {
            isSubmitting.current = false;
            alert('Failed to submit, trying again...');
        }
    };

    const handleViolation = (reason: string) => {
        setWarnings(prev => {
            const newCount = prev + 1;
            if (newCount >= 3) {
                alert(`Test Auto-Submitted due to multiple violations: ${reason}`);
                submitTest();
            } else {
                // Show modal which requires user click to dismiss
                setViolation(reason);
            }
            return newCount;
        });
    };

    const handleManualSubmit = () => {
        const missing = test.questions.reduce((acc: number[], q: any, idx: number) => {
            if (q.isCompulsory && !answers[q._id]) {
                acc.push(idx + 1);
            }
            return acc;
        }, []);

        if (missing.length > 0) {
            alert(`You must answer the following compulsory questions before submitting: ${missing.join(', ')}`);
            return;
        }

        if (confirm('Are you sure you want to finish the test?')) {
            submitTest();
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    if (startError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-6">
                <div className="bg-white dark:bg-gray-900 max-w-md w-full p-8 rounded-3xl shadow-xl text-center space-y-6 border border-red-100 dark:border-red-900/30">
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center mx-auto">
                        <Clock size={40} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">
                            {startError}
                        </p>
                    </div>
                    <Button onClick={() => router.push('/student/dashboard')} className="w-full">
                        Return to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    if (!test) return <div>Test not found</div>;

    // View 1: Instructions
    if (!started) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
                <div className="bg-white dark:bg-gray-900 max-w-2xl w-full rounded-3xl p-8 shadow-2xl space-y-8 text-center border overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500" />

                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold">{test.title}</h1>
                        <p className="text-gray-500">{test.department} | {test.semester} Sem</p>
                        <div className="inline-flex gap-4 bg-gray-100 dark:bg-gray-800 p-3 rounded-xl text-sm font-medium">
                            <span className="flex items-center gap-2"><Clock size={16} /> {test.duration} mins</span>
                            <span className="flex items-center gap-2"><Camera size={16} /> {test.settings.requireCamera ? 'Camera On' : 'No Camera'}</span>
                        </div>
                    </div>

                    <div className="text-left bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800">
                        <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                            <AlertTriangle size={18} /> Important Rules
                        </h3>
                        <ul className="list-disc list-inside space-y-2 text-sm text-blue-900 dark:text-blue-200">
                            <li>The test will be in <strong>Fullscreen Mode</strong>. Exiting it will trigger a warning.</li>
                            <li><strong>Tab Switching</strong> is monitored. 3 warnings triggers Auto Submit.</li>
                            {test.settings.requireCamera && <li><strong>Camera</strong> must be active throughout the session.</li>}
                            <li>Do not reload the page.</li>
                        </ul>
                    </div>

                    <Button onClick={startTest} className="w-full h-14 text-lg shadow-xl shadow-blue-500/30">
                        I Agree & Start Test
                    </Button>
                </div>
            </div>
        );
    }

    // View 2: Active Test
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
            {/* Top Bar */}
            <div className="h-16 border-b flex items-center justify-between px-6 bg-gray-900 text-white sticky top-0 z-50">
                <div className="font-bold text-lg">{test.title}</div>
                <div className={`p-2 rounded-lg font-mono text-xl font-bold tracking-widest ${timeLeft < 60 ? 'bg-red-600 animate-pulse' : 'bg-gray-800'}`}>
                    {formatTime(timeLeft)}
                </div>
                <Button variant="danger" className="text-sm py-2 px-3" onClick={handleManualSubmit}>
                    Finish Test
                </Button>
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-8 pb-32">
                    <div className="max-w-4xl mx-auto space-y-12">
                        {test.questions.map((q: any, idx: number) => (
                            <div key={q._id} className="space-y-4">
                                <h3 className="text-xl font-medium flex gap-3">
                                    <span className="text-gray-400 font-bold">{idx + 1}.</span>
                                    {q.questionText}
                                </h3>
                                <div className="space-y-3 pl-8">
                                    {q.options.map((opt: string, oIdx: number) => (
                                        <label key={oIdx} className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${answers[q._id] === opt
                                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                                            : 'border-gray-100 hover:border-gray-200 dark:border-gray-800'
                                            }`}>
                                            <input
                                                type="radio"
                                                name={`q-${idx}`}
                                                className="hidden"
                                                checked={answers[q._id] === opt}
                                                onChange={() => setAnswers({ ...answers, [q._id]: opt })}
                                            />
                                            <span className="font-medium">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                                {answers[q._id] && (
                                    <div className="pl-8 pt-1">
                                        <button
                                            onClick={() => {
                                                const newAns = { ...answers };
                                                delete newAns[q._id];
                                                setAnswers(newAns);
                                            }}
                                            className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-current" /> Clear Selection
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar / Proctor Overlay */}
                <div className="w-64 bg-gray-100 dark:bg-gray-900 border-l p-4 flex flex-col gap-4">
                    {test.settings.requireCamera && (
                        <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg border-2 border-red-500 relative">
                            <video
                                ref={videoRef}
                                autoPlay
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                                onLoadedMetadata={() => videoRef.current?.play()}
                            />
                            <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">
                                <div className="w-2 h-2 rounded-full bg-white" /> LIVE
                            </div>
                        </div>
                    )}

                    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                        <div className="text-xs text-gray-500 uppercase font-bold mb-2">Proctor Status</div>
                        <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Monitoring Active
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <div className="text-xs text-gray-500 mb-1">Warnings</div>
                            <div className="flex gap-1">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className={`h-2 flex-1 rounded-full ${i <= warnings ? 'bg-red-500' : 'bg-gray-200'}`} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Violation Modal */}
                {violation && (
                    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
                        <div className="bg-white dark:bg-gray-900 max-w-md w-full p-8 rounded-3xl shadow-2xl text-center space-y-6 animate-shake">
                            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center mx-auto">
                                <AlertTriangle size={40} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Test Warning</h2>
                                <p className="text-gray-500 dark:text-gray-400 font-medium">
                                    Violation Detected: <span className="text-red-600 font-bold">{violation}</span>
                                </p>
                                <p className="text-sm text-gray-400 mt-2">
                                    Warning {warnings}/3. Return to fullscreen immediately to continue.
                                </p>
                            </div>
                            <Button
                                onClick={() => {
                                    document.documentElement.requestFullscreen().catch(e => console.error(e));
                                    setViolation(null);
                                }}
                                className="w-full h-12 text-lg"
                            >
                                Return to Test
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
