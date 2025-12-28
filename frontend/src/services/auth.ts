import { useAuth } from "../context/AuthContext";

//---------------------- function find user_ by wallet 
const BASE_URL = import.meta.env.VITE_BASE_URL;


export const login = async (wallet: string) => {
    const res = await fetch(
        `${BASE_URL}/users/login`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify({ wallet: wallet })
        });
    if (!res.ok) {
        console.log("Login failed");
        return;
    }
    const data = await res.json();
    if (!data) {
        console.log("No User found");
        return;
    }
    // return user
    return data;
}



//---------------------- create user ---------------------------
// type CreateUserResult = {
//     ok: boolean;
//     status: number | 201;
//     reason: string |'duplicate' |'bad_request' ;
//     user: any;
// }

export const createUser = async (wallet: string, email?: string, username?: string) => {
    try {
        const res = await fetch( `${BASE_URL}/users`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept":"application/json"
            },
                body: JSON.stringify({ wallet:wallet })
        });

        
        // if status is bad
        if (res.status === 409) {
            return { ok: false, status: 409, reason: 'duplicate', user: null };
        }

        // if res status is not okay
        if (!res.ok) {
            console.error("User registeration failed");
            return { ok: false, status: res.status, reason: 'bad_request', user: null };;
        }
    
        const { user } = await res.json();
        return { ok: true, status: 201, reason: 'success', user: user };
    } catch (err: any) {
        console.log(err);
    }
}



//  Refresh token
export const refreshToken = async () => {
    const res = await fetch(`${BASE_URL}/api/users/token/refresh`, {
        method: "POST",
        credentials: "include" // include http-only cookie
    })
    if (!res.ok) {
        return console.error("Failed to refresh acess Token");
    }
    const {acessToken} = await res.json();
    // refreshed token 
    return acessToken ;
}


export async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const { token } = useAuth();
    const headers = new Headers(options.headers);
    if (token) {
        headers.set('Authorization', `Bearer ${token}`)
    }

    // fech the given resource
    const res = await fetch(url, { ...options, headers, credentials: "include" });
    if (res.status === 401) {
        const refreshedToken = await refreshToken();
        if (!refreshedToken) {
             throw new Error("Failed to refresh acess token");
        }
        // fecth resource with the new refreshed token 
        const res = await fetch(url, { ...options, headers, credentials: 'include' });
    }
    if (!res.ok) {
        throw new Error("Failed to fech resource");
    }

    return  res.json()
}