import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Test from '@/models/Test';
import User from '@/models/User';

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
        // Get full user details for dept/sem
        const student = await User.findById(userData.userId);
        if (!student) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const tests = await Test.find({
            department: student.department,
            semester: student.semester,
            isActive: true
        }).select('-questions.correctAnswer');
        // We don't need full Qs here, just titles/meta, but removing answers is good practice anyway

        return NextResponse.json({ tests });
    } catch (error) {
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
