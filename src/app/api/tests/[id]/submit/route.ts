import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Test from '@/models/Test';
import Result from '@/models/Result';
import User from '@/models/User';

async function getUser(req: Request) {
    const cookieHeader = req.headers.get('cookie');
    const token = cookieHeader?.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];
    if (!token) return null;
    const decoded: any = verifyToken(token);
    return decoded;
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const userData = await getUser(req);
        if (!userData || userData.role !== 'student') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { answers } = body; // Array of { questionId/Index, selectedOption }

        await dbConnect();
        const { id: testId } = await params;

        // Fetch test with correct answers
        const test = await Test.findById(testId);
        if (!test) {
            return NextResponse.json({ error: 'Test not found' }, { status: 404 });
        }

        // Fetch student details
        const student = await User.findById(userData.userId);

        let score = 0;
        const totalMarks = test.questions.reduce((sum: number, q: any) => sum + (q.marks || 1), 0);

        // Evaluate answers
        // Evaluate answers
        const processedAnswers = test.questions.map((q: any) => {
            // Find student's answer for this question by ID
            const studentAnsObj = answers.find((a: any) => a.questionId === q._id.toString());
            const selectedOption = studentAnsObj ? studentAnsObj.value : null;

            const isCorrect = selectedOption === q.correctAnswer;
            if (isCorrect) score += (q.marks || 1);

            return {
                questionId: q._id,
                questionText: q.questionText,
                selectedOption: selectedOption || 'Not Attempted',
                isCorrect
            };
        });

        const result = await Result.create({
            testId,
            studentId: userData.userId,
            studentName: student?.name,
            usn: student?.usn,
            department: student?.department,
            semester: student?.semester,
            score,
            totalMarks,
            answers: processedAnswers
        });

        return NextResponse.json({ message: 'Submitted', resultId: result._id, score, totalMarks });
    } catch (error) {
        console.error('Submit Error:', error);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
