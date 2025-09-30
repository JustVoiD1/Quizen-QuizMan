import axios from "axios";

export interface User {
    _id: string,
    name: string,
    email: string,
    role: 'teacher' | 'student'
}

export interface AuthData {
    user: User,
    token: string
}


export class AuthService {
    // saave auth data in localstorage
    static saveAuth(authData: AuthData): void {
        localStorage.setItem('auth', JSON.stringify(authData));
    }

    // get auth data from local storage
    static getAuth(): AuthData | null {
        try {
            const auth = localStorage.getItem('auth');
            return auth ? JSON.parse(auth) : null;

        } catch {
            return null
        }
    }

    // clear auth data
    static clearAuth(): void {
        localStorage.removeItem('auth');
        
    }

    // check if logged in
    static isLoggedIn(): boolean {
        return !!this.getAuth();
    }

    // get current user
    static getCurrentUser(): User | null {
        const auth = this.getAuth();
        return auth ? auth.user : null
    }

    static async signin(email: string, password: string): Promise<{ success: boolean, user?: User, message?: string }> {

        try {
            const response = await axios.post('/api/auth/signin', { email, password });
            if (response.data.success) {
                this.saveAuth({
                    user: response.data.user,
                    token: response.data.token
                })
                return { success: true, user: response.data.user };
            }

            return { success: false, message: response.data.message };

        } catch (err: any) {
            return {
                success: false,
                message: err.response?.data?.message || 'Signin failed'
            }
        }
    }

    static async signout() : Promise<void> {
        try {
            // For localStorage auth, we just clear the local data
            this.clearAuth();
        } catch (err : any) {
            console.error('Signout error: ', err);
        }
    }

    static async signup(data : {name : string,  email : string, password : string, role : string}) : Promise<{success : boolean, message?: string}>{
        try {
            await axios.post('/api/auth/signup', data);
            return {success : true};
        } catch (err : any) {
            return {
                success : false,
                message : err.response?.data?.message || 'Signup Failed'
            }
        }

    }
}