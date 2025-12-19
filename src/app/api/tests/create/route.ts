import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Test from '@/models/Test';

// Helper to get user
async function getUser(req: Request) {
    const cookieHeader = req.headers.get('cookie');
    const token = cookieHeader?.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];
    if (!token) return null;
    const decoded: any = verifyToken(token);
    return decoded;
}

export async function POST(req: Request) {
    try {
        const user = await getUser(req);
        if (!user || user.role !== 'teacher') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { title, department, semester, duration, startTime, questions, settings } = body;

        await dbConnect();

        const newTest = await Test.create({
            title,
            department,
            semester,
            duration,
            startTime,
            questions,
            settings,
            createdBy: user.userId,
            isActive: false // Default inactive
        });

        return NextResponse.json({ message: 'Test created successfully', testId: newTest._id }, { status: 201 });
    } catch (error: any) {
        console.error('Create Test Error:', error);
        return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
    }
}
