import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Result from '@/models/Result';

async function getUser(req: Request) {
    const cookieHeader = req.headers.get('cookie');
    const token = cookieHeader?.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];
    if (!token) return null;
    const decoded: any = verifyToken(token);
    return decoded;
}

export async function GET(req: Request) {
    try {
        const userData = await getUser(req);
        if (!userData || userData.role !== 'student') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        // Populate test title? Result model has testId ref 'Test'.
        const results = await Result.find({ studentId: userData.userId })
            .populate('testId', 'title')
            .sort({ submittedAt: -1 });

        // Filter out results where the test has been deleted (testId becomes null)
        const validResults = results.filter((r: any) => r.testId);

        return NextResponse.json({ results: validResults });
    } catch (error) {
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
