import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create token
    const token = signToken({ userId: user._id, role: user.role });

    // Create response
    const response = NextResponse.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        profilePicture: user.profilePicture,
        ...(user.role === 'student' && {
          usn: user.usn,
          semester: user.semester
        })
      },
      message: 'Login successful'
    });

    // Set Cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: false, // Allow client JS to read if needed, though secure is better
      path: '/',
      maxAge: 60 * 60 * 24 // 1 day
    });

    return response;

  } catch (error: any) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { error: 'Server error during login' },
      { status: 500 }
    );
  }
}
