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
            setLoading(false);
            if (!currentUser) {
                router.push('/login');
            }
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) {
        return (
            <p>Loading....</p>
        )
    }

    if (!user) {
        return (
            <p>Your are not logged in</p>
        )
    }

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <p>Welcome, {user.email}</p>
        </div>
    )
};

export default AdminDashboard;