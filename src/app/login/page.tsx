// page.tsx (your login component)

"use client";



import { auth } from "@/lib/firebase";

import { onAuthStateChanged, signInWithEmailAndPassword, User } from "firebase/auth";

import { useRouter } from "next/navigation";

import { FormEvent, useEffect, useState } from "react";



// Helper function to set/clear the cookie

const setAuthTokenCookie = (token: string | null) => {

    if (token) {

        // The cookie will be named 'firebaseIdToken'

        // 'path=/' makes it accessible across your entire site

        // 'max-age' is in seconds (e.g., 5 days). Firebase ID tokens expire in 1 hour,

        // but the client SDK refreshes them. This cookie is mainly a signal for the middleware.

        // 'SameSite=Lax' is a good default for security.

        document.cookie = `firebaseIdToken=${token}; path=/; max-age=${60 * 60 * 24 * 5}; SameSite=Lax`;

    } else {

        // Clear the cookie by setting its max-age to 0

        document.cookie = 'firebaseIdToken=; path=/; max-age=0; SameSite=Lax';

    }

};



const LoginPage = () => {

    const [email, setEmail] = useState<string>('');

    const [password, setPassword] = useState<string>('');

    const [error, setError] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const router = useRouter();



    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {

            if (user) {

                try {

                    const token = await user.getIdToken();

                    setAuthTokenCookie(token);

                    // If user is logged in and on the login page, redirect them to home

                    router.push('/admin');

                } catch (tokenError) {

                    console.error("Error setting auth token cookie on auth change:", tokenError);

                    setAuthTokenCookie(null); // Clear cookie if token retrieval fails

                }

            } else {

                // User is logged out

                setAuthTokenCookie(null);

            }

        });

        return () => unsubscribe();

    }, [router]);



    const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {

        e.preventDefault();

        setError(null);

        setIsLoading(true);



        try {

            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            console.log(`User logged in: ${userCredential.user.email}`); // Good to log email or UID



            // Get ID token and set it in cookie

            const token = await userCredential.user.getIdToken();

            setAuthTokenCookie(token);



            router.push('/admin'); // Redirect to admin page after successful login

        } catch (err: any) {

            console.error('Login Error:', err);

            setAuthTokenCookie(null); // Clear cookie on login failure

            let errorMessage = 'An unknown error occurred.';

            // Your existing error handling logic...

            if (err && typeof err === 'object' && 'code' in err) {

                console.error('Firebase Error Code:', err.code);

                switch (err.code) {

                    case 'auth/user-not-found':

                        errorMessage = 'No user found with this email.';

                        break;

                    case 'auth/wrong-password':

                        errorMessage = 'Incorrect password.';

                        break;

                    case 'auth/invalid-email':

                        errorMessage = 'Invalid email format.';

                        break;

                    case 'auth/invalid-credential':

                        errorMessage = 'Invalid login credentials.';

                        break;

                    default:

                        errorMessage = err.message || 'Login failed.';

                }

            } else if (err instanceof Error) {

                errorMessage = err.message;

            }

            setError(errorMessage);

        } finally {

            setIsLoading(false);

        }

    };



    return (

        <div>

            <h2>Login page</h2>

            <form onSubmit={handleLogin}>

                <div>

                    <label htmlFor="email">Email:</label>

                    <input

                        type="email"

                        id="email"

                        value={email}

                        onChange={(e) => setEmail(e.target.value)}

                        required

                    />

                </div>

                <div>

                    <label htmlFor="password">Password:</label>

                    <input

                        type="password"

                        id="password"

                        value={password}

                        onChange={(e) => setPassword(e.target.value)}

                        required

                    />

                </div>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <button type="submit" disabled={isLoading}>

                    {isLoading ? 'Logging In...' : 'Login'}

                </button>

            </form>

        </div>

    );

};



export default LoginPage;