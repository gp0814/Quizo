import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        await dbConnect();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Create JWT
        const token = signToken({ userId: user._id, role: user.role, name: user.name });

        const response = NextResponse.json({
            message: 'Login successful',
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department
            }
        });

        // Set HTTP-only cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        return response;
    } catch (error: any) {
        console.error('Login Error:', error);
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}
