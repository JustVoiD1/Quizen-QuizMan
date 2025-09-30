import { AuthService, User } from "@/lib/auth-simple";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useAuth(){
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(()=>{
        const currentUser = AuthService.getCurrentUser();
        setUser(currentUser);
        setLoading(false);

    }, []);

    const signin = async (email : string, password : string) => {
        const result = await AuthService.signin(email, password);
        if(result.success && result.user){
            setUser(result.user);
            if(result.user.role === 'teacher'){
                router.push('/teacher');
            }
            else {
                router.push('/student');
            }
        }
        return result;
    }

    const signout = async () => {
        await AuthService.signout();
        setUser(null);
        router.push('/');
    } 

    return { user, loading, signin, signout};


}