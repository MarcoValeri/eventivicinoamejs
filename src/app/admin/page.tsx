"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

const clearAuthTokenCookie = () => {
    document.cookie = 'firebaseIdToken=; path=/; max-age=0; SameSite=Lax';
};

const AdminDashboard = () => {

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                // If the user signs out while on the page, redirect them
                router.push('/login');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            clearAuthTokenCookie();
            // The onAuthStateChanged listener above will handle the redirect
            console.log("User logged out successfully");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    if (loading) {
        return (
            <p>Loading....</p>
        )
    }

    if (!user) {
        // This state is now less likely to be seen by the user due to middleware,
        // but it's good to keep as a fallback.
        return <p>Redirecting to login...</p>;
    }

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <p>Welcome, {user.email}</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
};

export default AdminDashboard;