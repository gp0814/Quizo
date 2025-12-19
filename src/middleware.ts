import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    const isStudentPath = pathname.startsWith('/student');
    const isTeacherPath = pathname.startsWith('/teacher');

    if (isStudentPath || isTeacherPath) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            // Simple Decode for Role Check (In Edge)
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const payload = JSON.parse(jsonPayload);
            const role = payload.role;

            // Prevent role mismatch
            if (isStudentPath && role !== 'student') {
                return NextResponse.redirect(new URL('/teacher/dashboard', request.url));
            }
            if (isTeacherPath && role !== 'teacher') {
                return NextResponse.redirect(new URL('/student/dashboard', request.url));
            }

        } catch (e) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/student/:path*', '/teacher/:path*'],
};
