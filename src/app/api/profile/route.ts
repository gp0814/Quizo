import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { headers } from 'next/headers';

// Helper to get user from token
async function getUser(req: Request) {
    const cookieHeader = req.headers.get('cookie');
    const token = cookieHeader?.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];
    if (!token) return null;
    const decoded: any = verifyToken(token);
    return decoded ? decoded.userId : null;
}

export async function GET(req: Request) {
    try {
        const userId = await getUser(req);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const userId = await getUser(req);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name, semester, profilePicture, department } = body;

        await dbConnect();
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Role-based validation
        if (user.role === 'student') {
            // Students can edit Name, Semester, Department
            if (name) user.name = name;
            if (semester) user.semester = semester;
            if (department) user.department = department;
        } else {
            // Teachers can edit Name, Department
            if (name) user.name = name;
            if (department) user.department = department;
        }

        if (profilePicture !== undefined) {
            user.profilePicture = profilePicture;
        }

        await user.save();
        return NextResponse.json({ message: 'Profile updated successfully', user });

    } catch (error) {
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
