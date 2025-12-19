import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { headers } from 'next/headers';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET(req: Request) {
    try {
        const headersList = headers();
        // In API routes, we can read cookies easily from request
        const cookieHeader = req.headers.get('cookie');
        // Simple parse or use a library
        const token = cookieHeader?.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];

        if (!token) {
            return NextResponse.json({ user: null });
        }

        const decoded: any = verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ user: null });
        }

        await dbConnect();
        const user = await User.findById(decoded.userId).select('-password');

        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json({ user: null });
    }
}
