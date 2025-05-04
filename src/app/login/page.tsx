"use client";

import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

const LoginPage = () => {

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
            if (user) {
                // If user is logged in, redirect them to home
                router.push('/');
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

            console.log(`User logged in: ${userCredential.user}`);

            router.push('/admin');
        } catch (err: any) {
            console.error('Login Error:', err);
            let errorMessage = 'An unknown error occurred.';

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
                    case 'auth/invalid-credential': // newer Firebase versions
                        errorMessage = 'Invalid login credentials.';
                        break;
                    default:
                        errorMessage = err.message;
                }
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }

            setError(errorMessage);

        } finally {
            setIsLoading(false);
        }
    }
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
                    {error && <p>{error}</p>}
                    <button type="submit" disabled={isLoading}>{isLoading ? 'Logging In...' : 'Login'}</button>
                </form>
            </div>
        )
    };

    export default LoginPage;