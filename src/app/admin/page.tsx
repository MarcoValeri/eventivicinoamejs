"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

const AdminDashboard = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false); // Only stop loading AFTER the first check is complete
        });
        return () => unsubscribe();
    }, []);

    // This effect handles the redirect AFTER we know the auth status
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [loading, user, router]);

    if (loading) {
        return <p>Loading Admin Dashboard...</p>; // This screen is shown while Firebase initializes
    }

    if (!user) {
        // This will only be shown for a moment before the useEffect above redirects
        return <p>No access. Redirecting...</p>;
    }

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <p>Welcome, {user.email}</p>
        </div>
    );
};

export default AdminDashboard;