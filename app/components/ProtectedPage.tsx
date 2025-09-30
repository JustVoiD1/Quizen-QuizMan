'use client'

import { Skeleton } from "@/components/ui/skeleton";
import { AuthService, User } from "@/lib/auth-simple";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react"

interface ProtectedPageProps {
    children : ReactNode,
    allowedRole : 'teacher' | 'student'
}

export default function ProtectedPage ({children, allowedRole} : ProtectedPageProps) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(()=>{
        const currentUser = AuthService.getCurrentUser();
        if(!currentUser){
            router.push('/auth/signin');
            return;
        }

        if(currentUser.role !== allowedRole) {
            if(currentUser.role === 'teacher'){
                router.push('/teacher');
            }
            else {
                router.push('/student')
            }
            return;
        }

        setUser(currentUser);
        setLoading(false);


    }, [allowedRole, router])

    if(loading){
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Skeleton className="h-8 w-64"/>
            </div>
        );
    }
    if(!user) {
        return null;
    }
    return <>{children}</>
}