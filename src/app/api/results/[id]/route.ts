import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Result from '@/models/Result';
import Test from '@/models/Test';

async function getUser(req: Request) {
    const cookieHeader = req.headers.get('cookie');
    const token = cookieHeader?.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];
    if (!token) return null;
    try {
        const decoded: any = verifyToken(token);
        return decoded;
    } catch (e) {
        return null;
    }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const userData = await getUser(req);
        if (!userData) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;
        await dbConnect();

        const result = await Result.findById(id).populate('testId');

        if (!result) {
            return NextResponse.json({ error: 'Result not found' }, { status: 404 });
        }

        // Access Control: Only the student who owns the result or a teacher can view it
        if (userData.role === 'student' && result.studentId.toString() !== userData.userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Return result
        return NextResponse.json({ result });

    } catch (error) {
        console.error('Fetch Result Error:', error);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
