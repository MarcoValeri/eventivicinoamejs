"use client";

import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

// You can move this helper to a shared file, e.g., src/util/cookies.ts
const setAuthTokenCookie = (token: string | null) => {
    if (token) {
        document.cookie = `firebaseIdToken=${token}; path=/; max-age=${60 * 60 * 24 * 5}; SameSite=Lax; Secure`;
    } else {
        document.cookie = 'firebaseIdToken=; path=/; max-age=0; SameSite=Lax; Secure';
    }
};

const LoginPage = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    // The problematic useEffect has been REMOVED.

    // const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     setError(null);
    //     setIsLoading(true);

    //     try {
    //         const userCredential = await signInWithEmailAndPassword(auth, email, password);
    //         console.log(`User logged in: ${userCredential.user.email}`);

    //         const token = await userCredential.user.getIdToken();
    //         setAuthTokenCookie(token);

    //         // The only redirect happens here, after a successful login.
    //         router.push('/admin');
    //     } catch (err: any) {
    //         console.error('Login Error:', err);
    //         setAuthTokenCookie(null); // Clear cookie on failure
    //         // Your detailed error handling logic is good...
    //         if (err.code === 'auth/invalid-credential') {
    //             setError('Invalid email or password.');
    //         } else {
    //             setError('An unexpected error occurred.');
    //         }
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    // ... inside your LoginPage component

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        console.log("Checkpoint 1: Login process initiated.");

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log(`Checkpoint 2: Sign-in successful for ${userCredential.user.email}`);

            const token = await userCredential.user.getIdToken();
            console.log("Checkpoint 3: ID token retrieved successfully.");

            setAuthTokenCookie(token);
            console.log("Checkpoint 4: Auth cookie has been set.");

            // --- THE CRITICAL FIX IS HERE ---
            // Add a tiny delay to ensure the browser processes the cookie
            // before the navigation request is sent to the server.
            await new Promise(resolve => setTimeout(resolve, 1000)); // 100ms pause

            router.push('/admin');
            console.log("Checkpoint 5: router.push('/admin') has been called.");

        } catch (err: any) {
            console.error("CRITICAL: The process failed and jumped to the catch block.", err);
            if (err.code === 'auth/invalid-credential') {
                setError('Invalid email or password.');
            } else {
                setError('An unexpected error occurred during login.');
            }
        } finally {
            setIsLoading(false);
            console.log("Checkpoint 6: 'finally' block has been executed.");
        }
    };


    return (
        <div>
            <h2>Login page</h2>
            <form onSubmit={handleLogin}>
                {/* Your form JSX remains the same... */}
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
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