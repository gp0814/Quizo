'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import axios from 'axios';
import { Plus, Trash2, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';

export default function CreateTestPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form State
    const [details, setDetails] = useState({
        title: '',
        department: '',
        semester: '',
        duration: 60,
        startTime: ''
    });

    const [settings, setSettings] = useState({
        shuffleQuestions: false,
        shuffleOptions: false,
        requireCamera: false
    });

    const [questions, setQuestions] = useState<any[]>([
        { questionText: '', options: ['', '', '', ''], correctAnswer: '', marks: 1, isCompulsory: false }
    ]);

    const addQuestion = () => {
        setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: '', marks: 1, isCompulsory: false }]);
    };

    const removeQuestion = (idx: number) => {
        const newQ = [...questions];
        newQ.splice(idx, 1);
        setQuestions(newQ);
    };

    const handleQuestionChange = (idx: number, field: string, value: any) => {
        const newQ = [...questions];
        newQ[idx][field] = value;
        setQuestions(newQ);
    };

    const handleOptionChange = (qIdx: number, oIdx: number, value: string) => {
        const newQ = [...questions];
        const oldValue = newQ[qIdx].options[oIdx];
        newQ[qIdx].options[oIdx] = value;
        // If this option was the correct answer, update the correct answer text too
        if (newQ[qIdx].correctAnswer === oldValue) {
            newQ[qIdx].correctAnswer = value;
        }
        setQuestions(newQ);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await axios.post('/api/tests/create', {
                ...details,
                settings,
                questions
            });
            router.push('/teacher/dashboard');
        } catch (error) {
            alert('Failed to create test');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Stepper */}
                <div className="flex justify-between items-center mb-8 px-12">
                    {[1, 2, 3, 4].map((s) => (
                        <div key={s} className="flex flex-col items-center relative z-10">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-colors ${step >= s ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}>
                                {s}
                            </div>
                            <span className="text-xs mt-2 text-gray-500 font-medium">
                                {s === 1 ? 'Details' : s === 2 ? 'Settings' : s === 3 ? 'Questions' : 'Review'}
                            </span>
                        </div>
                    ))}
                    {/* Progress Bar Background */}
                    <div className="absolute left-0 right-0 top-9 h-1 bg-gray-200 dark:bg-gray-800 -z-0 mx-auto w-[60%]" />
                </div>

                <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 min-h-[500px]">

                    {/* Step 1: Details */}
                    {step === 1 && (
                        <div className="space-y-6 max-w-xl mx-auto">
                            <h2 className="text-2xl font-bold mb-4">Basic Details</h2>
                            <Input
                                label="Test Title"
                                value={details.title}
                                onChange={e => setDetails({ ...details, title: e.target.value })}
                                placeholder="e.g. Internal Assessment 1"
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Department"
                                    value={details.department}
                                    onChange={e => setDetails({ ...details, department: e.target.value })}
                                />
                                <Input
                                    label="Semester"
                                    value={details.semester}
                                    onChange={e => setDetails({ ...details, semester: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Duration (minutes)"
                                    type="number"
                                    value={details.duration}
                                    onChange={e => setDetails({ ...details, duration: Number(e.target.value) })}
                                />
                                <Input
                                    label="Start Time (Optional)"
                                    type="datetime-local"
                                    value={details.startTime}
                                    onChange={e => setDetails({ ...details, startTime: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Settings */}
                    {step === 2 && (
                        <div className="space-y-6 max-w-xl mx-auto">
                            <h2 className="text-2xl font-bold mb-4">Test Settings</h2>
                            <div className="space-y-4">
                                <label className="flex items-center gap-3 p-4 border rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 text-blue-600 rounded"
                                        checked={settings.shuffleQuestions}
                                        onChange={e => setSettings({ ...settings, shuffleQuestions: e.target.checked })}
                                    />
                                    <div>
                                        <div className="font-medium">Shuffle Questions</div>
                                        <div className="text-sm text-gray-500">Randomize question order for each student</div>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 p-4 border rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 text-blue-600 rounded"
                                        checked={settings.shuffleOptions}
                                        onChange={e => setSettings({ ...settings, shuffleOptions: e.target.checked })}
                                    />
                                    <div>
                                        <div className="font-medium">Shuffle Options</div>
                                        <div className="text-sm text-gray-500">Randomize answer choices for each question</div>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 p-4 border rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 text-blue-600 rounded"
                                        checked={settings.requireCamera}
                                        onChange={e => setSettings({ ...settings, requireCamera: e.target.checked })}
                                    />
                                    <div>
                                        <div className="font-medium">Require Camera</div>
                                        <div className="text-sm text-gray-500">Enforce camera monitoring during the test</div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Questions */}
                    {step === 3 && (
                        <div className="space-y-8">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold">Questions ({questions.length})</h2>
                                <Button onClick={addQuestion} variant="secondary" className="gap-2">
                                    <Plus size={18} /> Add Question
                                </Button>
                            </div>

                            <div className="space-y-6">
                                {questions.map((q, qIdx) => (
                                    <div key={qIdx} className="p-6 border rounded-2xl bg-gray-50 dark:bg-gray-800/50 relative group">
                                        <button
                                            onClick={() => removeQuestion(qIdx)}
                                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={20} />
                                        </button>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium mb-2">Question {qIdx + 1}</label>
                                            <textarea
                                                className="w-full p-3 rounded-xl border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                                                rows={2}
                                                placeholder="Enter question text..."
                                                value={q.questionText}
                                                onChange={e => handleQuestionChange(qIdx, 'questionText', e.target.value)}
                                            />
                                        </div>

                                        <div className="flex gap-4 mb-4">
                                            <div className="w-24">
                                                <label className="text-xs text-gray-500 font-medium ml-1">Marks</label>
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    value={q.marks}
                                                    onChange={e => handleQuestionChange(qIdx, 'marks', parseInt(e.target.value) || 1)}
                                                />
                                            </div>
                                            <div className="flex items-center pt-5">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={q.isCompulsory}
                                                        onChange={e => handleQuestionChange(qIdx, 'isCompulsory', e.target.checked)}
                                                        className="w-4 h-4 text-blue-600 rounded"
                                                    />
                                                    <span className="text-sm font-medium">Compulsory</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            {q.options.map((opt: string, oIdx: number) => (
                                                <div key={oIdx} className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-500 font-medium">
                                                        {String.fromCharCode(65 + oIdx)}.
                                                    </span>
                                                    <Input
                                                        placeholder={`Option ${oIdx + 1}`}
                                                        value={opt}
                                                        onChange={e => handleOptionChange(qIdx, oIdx, e.target.value)}
                                                        className="h-10"
                                                    />
                                                    <input
                                                        type="radio"
                                                        name={`correct-${qIdx}`}
                                                        checked={q.correctAnswer === opt && opt !== ''}
                                                        onChange={() => handleQuestionChange(qIdx, 'correctAnswer', opt)}
                                                        className="w-4 h-4 text-green-600"
                                                        title="Mark as correct"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 4: Review */}
                    {step === 4 && (
                        <div className="max-w-2xl mx-auto text-center space-y-6">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle size={40} />
                            </div>
                            <h2 className="text-3xl font-bold">Ready to Save?</h2>
                            <div className="text-gray-500 bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl text-left space-y-2">
                                <p><strong>Title:</strong> {details.title}</p>
                                <p><strong>Department:</strong> {details.department} ({details.semester} Sem)</p>
                                <p><strong>Duration:</strong> {details.duration} mins</p>
                                <p><strong>Questions:</strong> {questions.length}</p>
                                <p><strong>Test Mode:</strong> {JSON.stringify(settings)}</p>
                            </div>
                            <p className="text-sm text-gray-400">The test will be saved as <strong>Inactive</strong>. You can activate it later from the dashboard.</p>
                        </div>
                    )}

                </div>

                {/* Footer Navigation */}
                <div className="flex justify-between pt-4">
                    <Button
                        variant="secondary"
                        onClick={() => setStep(step - 1)}
                        disabled={step === 1}
                        className="w-32"
                    >
                        <ChevronLeft size={18} className="mr-1" /> Previous
                    </Button>

                    {step < 4 ? (
                        <Button
                            onClick={() => setStep(step + 1)}
                            className="w-32"
                        >
                            Next <ChevronRight size={18} className="ml-1" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            isLoading={loading}
                            className="w-40 bg-green-600 hover:bg-green-700"
                        >
                            Save Test
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
