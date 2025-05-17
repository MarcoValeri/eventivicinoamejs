// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// You'll need to set up Firebase Admin SDK for token verification
// import { adminAuth } from './lib/firebase-admin'; // Your Firebase Admin setup

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const idToken = request.cookies.get('firebaseIdToken')?.value;

    if (pathname.startsWith('/admin')) {
        if (!idToken) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirectedFrom', pathname); // Optional: tell login where to redirect back
            return NextResponse.redirect(loginUrl);
        }

        try {
            // TODO: Verify the idToken using Firebase Admin SDK
            // await adminAuth.verifyIdToken(idToken);
            // If verification is successful, let the request proceed
            return NextResponse.next();
        } catch (error) {
            console.error('Token verification failed:', error);
            // If token is invalid, clear it and redirect to login
            const loginUrl = new URL('/login', request.url);
            const response = NextResponse.redirect(loginUrl);
            response.cookies.set('firebaseIdToken', '', { maxAge: -1, path: '/' }); // Clear invalid cookie
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - login (so it doesn't protect the login page itself from unauthenticated users)
         */
        // '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
        // Or more specifically for admin:
        '/admin/:path*',
    ],
};
