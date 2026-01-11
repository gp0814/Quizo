import React, { forwardRef } from 'react';
import { Award, Calendar, BookOpen } from 'lucide-react';

interface ScoreCardProps {
    result: any;
}

// Explicit HEX colors to avoid html2canvas oklch error
const colors = {
    white: '#ffffff',
    gray50: '#f9fafb',
    gray100: '#f3f4f6',
    gray200: '#e5e7eb',
    gray400: '#9ca3af',
    gray500: '#6b7280',
    gray900: '#111827',
    blue50: '#eff6ff',
    blue100: '#dbeafe',
    blue200: '#bfdbfe',
    blue400: '#60a5fa',
    blue600: '#2563eb',
    blue900: '#1e3a8a',
    green50: '#f0fdf4',
    green100: '#dcfce7',
    green600: '#16a34a',
    green800: '#166534',
    red50: '#fef2f2',
    red100: '#fee2e2',
    red500: '#ef4444',
    red800: '#991b1b',
};

const ScoreCard = forwardRef<HTMLDivElement, ScoreCardProps>(({ result }, ref) => {
    if (!result) return null;

    const { studentName, usn, department, semester, testId, score, totalMarks, submittedAt, answers } = result;
    const percentage = ((score / totalMarks) * 100).toFixed(1);
    const date = new Date(submittedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const isPass = (Number(percentage) >= 40);

    return (
        <div
            ref={ref}
            style={{
                backgroundColor: colors.white,
                color: colors.gray900,
                width: '210mm',
                height: '297mm', // Fixed height for A4
                padding: '0', // Margin handled by inner container
                fontFamily: 'sans-serif',
                boxSizing: 'border-box',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
            }}
            className="mx-auto shadow-none print:shadow-none"
        >
            {/* Main Content Container with Margin */}
            <div style={{
                margin: '15mm', // Standard print margin
                border: `4px double ${colors.gray200}`,
                flex: 1,
                padding: '40px',
                position: 'relative',
                backgroundColor: colors.white,
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column'
            }}>

                {/* Watermark in background */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    top: '10%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.04,
                    pointerEvents: 'none',
                    zIndex: 0
                }}>
                    <Award size={500} color={colors.gray900} />
                </div>

                {/* Header */}
                <div style={{
                    textAlign: 'center',
                    borderBottom: `2px solid ${colors.gray100}`,
                    paddingBottom: '20px',
                    marginBottom: '30px',
                    position: 'relative',
                    zIndex: 10
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '8px' }}>
                        <div style={{ backgroundColor: colors.blue600, color: colors.white, padding: '8px', borderRadius: '8px' }}>
                            <BookOpen size={24} color={colors.white} />
                        </div>
                        <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px', textTransform: 'uppercase', color: colors.blue900, margin: 0 }}>
                            Quizo Verified
                        </h1>
                    </div>
                    <p style={{ color: colors.gray500, textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '12px', fontWeight: 600, margin: 0 }}>
                        Official Score Card
                    </p>
                </div>

                {/* Content */}
                <div style={{ position: 'relative', zIndex: 10, flex: 1 }}>

                    {/* Student Details */}
                    <div style={{
                        backgroundColor: colors.gray50,
                        padding: '24px',
                        borderRadius: '12px',
                        border: `1px solid ${colors.gray200}`,
                        marginBottom: '30px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '20px'
                    }}>
                        <div>
                            <p style={{ fontSize: '10px', color: colors.gray400, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '4px', margin: 0 }}>Student Name</p>
                            <p style={{ fontSize: '18px', fontWeight: 700, color: colors.gray900, textTransform: 'capitalize', margin: 0 }}>{studentName}</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '10px', color: colors.gray400, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '4px', margin: 0 }}>USN / ID</p>
                            <p style={{ fontFamily: 'monospace', fontSize: '16px', fontWeight: 600, color: colors.gray900, margin: 0 }}>{usn}</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '10px', color: colors.gray400, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '4px', margin: 0 }}>Department</p>
                            <p style={{ fontSize: '14px', fontWeight: 500, color: colors.gray900, margin: 0 }}>{department}</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '10px', color: colors.gray400, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '4px', margin: 0 }}>Semester</p>
                            <p style={{ fontSize: '14px', fontWeight: 500, color: colors.gray900, margin: 0 }}>{semester}</p>
                        </div>
                    </div>

                    {/* Test Details */}
                    <div style={{
                        backgroundColor: '#eff6ff',
                        padding: '24px',
                        borderRadius: '12px',
                        border: `1px solid ${colors.blue200}`,
                        marginBottom: '30px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                            <div style={{ maxWidth: '65%' }}>
                                <p style={{ fontSize: '10px', color: colors.blue400, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '4px', margin: 0 }}>Test Title</p>
                                <h2 style={{ fontSize: '24px', fontWeight: 800, color: colors.blue900, lineHeight: 1.2, margin: 0 }}>{testId?.title || 'Unknown Test'}</h2>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '10px', color: colors.blue400, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '4px', margin: 0 }}>Date Completed</p>
                                <p style={{ fontWeight: 600, color: colors.blue900, display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end', margin: 0, fontSize: '14px' }}>
                                    <Calendar size={16} color={colors.blue900} /> {date}
                                </p>
                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'space-between',
                            marginTop: '20px',
                            paddingTop: '20px',
                            borderTop: `1px solid ${colors.blue200}`
                        }}>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '10px', color: colors.blue400, textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px', margin: 0 }}>Score Achieved</p>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                    <p style={{ fontSize: '36px', fontWeight: 900, color: colors.blue600, lineHeight: 1, margin: 0 }}>{score}</p>
                                    <p style={{ fontSize: '18px', color: colors.blue400, fontWeight: 500, margin: 0 }}>/ {totalMarks}</p>
                                </div>
                            </div>
                            <div style={{ flex: 1, textAlign: 'center' }}>
                                <p style={{ fontSize: '10px', color: colors.blue400, textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px', margin: 0 }}>Percentage</p>
                                <p style={{ fontSize: '32px', fontWeight: 900, color: colors.blue600, lineHeight: 1, margin: 0 }}>{percentage}%</p>
                            </div>
                            <div style={{ flex: 1, textAlign: 'right' }}>
                                <p style={{ fontSize: '10px', color: colors.blue400, textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px', margin: 0 }}>Final Result</p>
                                <p style={{
                                    fontSize: '28px',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    color: isPass ? colors.green600 : colors.red500,
                                    lineHeight: 1,
                                    margin: 0
                                }}>
                                    {isPass ? 'Pass' : 'Fail'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div>
                        <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: colors.gray400, marginBottom: '16px', margin: 0 }}>Performance Analysis</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                            <div style={{ backgroundColor: colors.green50, padding: '16px', borderRadius: '12px', border: `1px solid ${colors.green100}`, textAlign: 'center' }}>
                                <p style={{ fontSize: '28px', fontWeight: 800, color: colors.green600, marginBottom: '4px', lineHeight: 1, margin: 0 }}>{answers.filter((a: any) => a.isCorrect).length}</p>
                                <p style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', color: colors.green800, margin: 0 }}>Correct</p>
                            </div>
                            <div style={{ backgroundColor: colors.red50, padding: '16px', borderRadius: '12px', border: `1px solid ${colors.red100}`, textAlign: 'center' }}>
                                <p style={{ fontSize: '28px', fontWeight: 800, color: colors.red500, marginBottom: '4px', lineHeight: 1, margin: 0 }}>{answers.filter((a: any) => !a.isCorrect && a.selectedOption !== 'Not Attempted').length}</p>
                                <p style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', color: colors.red800, margin: 0 }}>Incorrect</p>
                            </div>
                            <div style={{ backgroundColor: colors.gray50, padding: '16px', borderRadius: '12px', border: `1px solid ${colors.gray100}`, textAlign: 'center' }}>
                                <p style={{ fontSize: '28px', fontWeight: 800, color: colors.gray500, marginBottom: '4px', lineHeight: 1, margin: 0 }}>{answers.filter((a: any) => a.selectedOption === 'Not Attempted').length}</p>
                                <p style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', color: colors.gray500, margin: 0 }}>Unanswered</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div style={{
                    textAlign: 'center',
                    borderTop: `1px solid ${colors.gray200}`,
                    paddingTop: '20px',
                    marginTop: 'auto' // Push to bottom if space is available
                }}>
                    <p style={{ fontSize: '10px', color: colors.gray400, fontWeight: 500, margin: 0 }}>
                        This is a computer-generated document verified by Quizo Assessment Platform.
                    </p>
                    <p style={{ fontSize: '9px', color: colors.gray400, marginTop: '6px', fontFamily: 'monospace', margin: 0 }}>
                        ID: {result._id}
                    </p>
                </div>
            </div>
        </div>
    );
});

ScoreCard.displayName = 'ScoreCard';

export default ScoreCard;
