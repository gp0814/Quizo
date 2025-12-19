import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User'; // We need to fix the import alias or move models to src
import bcrypt from 'bcryptjs';

// Since I created models in root/models but my tsconfig has @ -> src
// I should move models to src/models OR adjust import.
// For now, I will use relative import or assume I will move folders.
// Actually, standard Next.js 13+ with src dir usually puts everything in src.
// I will assume I need to move 'models' and 'lib' to 'src/models' and 'src/lib'.
// I will fix the file locations in a moment. For now, writing the content.

// To avoid errors, I will write this assuming src/models exists.
// I will move the files in the next step.

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password, role, department, usn, semester } = body;

        await dbConnect();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        if (role === 'student' && (!usn || !semester)) {
            return NextResponse.json({ error: 'USN and Semester are required for students' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            department,
            usn: role === 'student' ? usn : undefined,
            semester: role === 'student' ? semester : undefined
        });

        return NextResponse.json({ message: 'User registered successfully', userId: newUser._id }, { status: 201 });
    } catch (error: any) {
        console.error('Registration Error:', error);
        if (error.code === 11000) {
            // Check which field was duplicated
            if (error.keyPattern?.usn) {
                return NextResponse.json({ error: 'USN is already used' }, { status: 400 });
            }
            if (error.keyPattern?.email) {
                return NextResponse.json({ error: 'Email is already used' }, { status: 400 });
            }
            return NextResponse.json({ error: 'Duplicate entry detected' }, { status: 400 });
        }
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
