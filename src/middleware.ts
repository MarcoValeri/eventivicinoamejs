import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function will be called for every request that matches its filter
export function middleware(request: NextRequest) {
    // 1. Get the token from the user's cookies
    const token = request.cookies.get('firebaseIdToken')?.value;

    // 2. If no token exists and they are trying to access the admin page, redirect to login
    if (!token) {
        // Note: You can't use `router.push` here, you must return a NextResponse
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 3. If a token exists, allow them to proceed to the admin page
    return NextResponse.next();
}

// 4. The 'matcher' configures which routes this middleware will run on.
export const config = {
    matcher: '/admin/:path*', // Protects all routes under /admin
};