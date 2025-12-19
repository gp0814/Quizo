import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Result from '@/models/Result';
import Test from '@/models/Test';

async function getUser(req: Request) {
    const cookieHeader = req.headers.get('cookie');
    const token = cookieHeader?.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];
    if (!token) return null;
    const decoded: any = verifyToken(token);
    return decoded;
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getUser(req);
        if (!user || user.role !== 'teacher') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { id } = await params;

        // Verify ownership
        const test = await Test.findOne({ _id: id, createdBy: user.userId });
        if (!test) {
            return NextResponse.json({ error: 'Test not found or unauthorized' }, { status: 404 });
        }

        const results = await Result.find({ testId: id }).sort({ score: -1 });

        return NextResponse.json({ test, results });
    } catch (error) {
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
