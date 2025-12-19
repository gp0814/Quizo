import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Test from '@/models/Test';
import User from '@/models/User';
import Result from '@/models/Result';

async function getUser(req: Request) {
    const cookieHeader = req.headers.get('cookie');
    const token = cookieHeader?.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];
    if (!token) return null;
    const decoded: any = verifyToken(token);
    return decoded;
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const userData = await getUser(req);
        if (!userData || userData.role !== 'student') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { id } = await params;

        const test = await Test.findById(id).select('-questions.correctAnswer');
        if (!test) {
            return NextResponse.json({ error: 'Test not found' }, { status: 404 });
        }

        if (!test.isActive) {
            return NextResponse.json({ error: 'Test is not active' }, { status: 403 });
        }

        // Check Start Time
        if (test.startTime && new Date() < new Date(test.startTime)) {
            return NextResponse.json({
                error: `Test has not started yet. Starts at ${new Date(test.startTime).toLocaleString()}`
            }, { status: 403 });
        }

        // Check if already submitted
        const existingResult = await Result.findOne({ testId: id, studentId: userData.userId });
        if (existingResult) {
            return NextResponse.json({ error: 'You have already submitted this test', submitted: true }, { status: 403 });
        }

        // Shuffle Logic
        if (test.settings.shuffleQuestions) {
            for (let i = test.questions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [test.questions[i], test.questions[j]] = [test.questions[j], test.questions[i]];
            }
        }

        if (test.settings.shuffleOptions) {
            test.questions.forEach((q: any) => {
                // Fisher-Yates for options
                for (let i = q.options.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [q.options[i], q.options[j]] = [q.options[j], q.options[i]];
                }
            });
        }

        return NextResponse.json({ test });
    } catch (error) {
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
