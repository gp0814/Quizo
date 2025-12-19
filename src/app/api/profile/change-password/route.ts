import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

async function getUser(req: Request) {
  const cookieHeader = req.headers.get('cookie');
  const token = cookieHeader
    ?.split(';')
    .find(c => c.trim().startsWith('token='))
    ?.split('=')[1];

  if (!token) return null;

  const decoded: any = verifyToken(token);
  return decoded ? decoded.userId : null;
}

export async function PUT(req: Request) {
  try {
    const userId = await getUser(req);

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await req.json();

    // ✅ Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    await dbConnect();
    const user = await User.findById(userId);

    // ✅ CRITICAL FIX: narrow password type
    if (!user || typeof user.password !== 'string') {
      return NextResponse.json(
        { error: 'User not found or password missing' },
        { status: 404 }
      );
    }

    // ✅ Now TypeScript KNOWS password is string
    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return NextResponse.json(
        { error: 'Incorrect current password' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({
      message: 'Password updated successfully',
    });

  } catch (error) {
    console.error('Change Password Error:', error);
    return NextResponse.json(
      { error: 'Server Error' },
      { status: 500 }
    );
  }
}
