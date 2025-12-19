import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/db';
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
        const test = await Test.findOne({ _id: id, createdBy: user.userId });
        if (!test) return NextResponse.json({ error: 'Test not found' }, { status: 404 });
        return NextResponse.json({ test });
    } catch (err) {
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getUser(req);
        if (!user || user.role !== 'teacher') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { id } = await params;
        const updates = await req.json();

        const test = await Test.findOneAndUpdate(
            { _id: id, createdBy: user.userId },
            { $set: updates },
            { new: true }
        );

        if (!test) {
            return NextResponse.json({ error: 'Test not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Test updated', test });
    } catch (error) {
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getUser(req);
        if (!user || user.role !== 'teacher') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { id } = await params;

        const test = await Test.findOneAndDelete({ _id: id, createdBy: user.userId });

        if (!test) {
            return NextResponse.json({ error: 'Test not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Test deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
