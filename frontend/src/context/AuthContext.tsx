import { Provider, Signer } from 'ethers';
import React, { useContext, createContext, useState } from 'react';

interface AuthContextType{
    user: any;
    token: string | null;
    wallet: string | null;
    provider: Provider | null;
    signer: Signer | null;
    connectWallet: ( wallet:string,signer:Signer, provider:Provider, user?:any, token?:string ) => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }){
    const [signer, setSigner] = useState<Signer | null>(null);
    const [user, setUser] = useState<any>();
    const [wallet, setWallet] = useState<string |null >(null);
    const [provider, setProvider] = useState<Provider | null>(null);
    const [token, setToken] = useState<string|null>(null);

    // connecting wallat sets the contex 
    const connectWallet = (wallet: string, signer: Signer, provider: Provider, user?: any, oken?: string, ) => {
        // set states on wallet connect 
        setSigner(signer);
        setUser(user ? user : {});
        setWallet(wallet);
        setProvider(provider);
        setToken(token? token : null);
    }

    return (
        <AuthContext.Provider value={{ user, token, wallet, provider, signer, connectWallet }} >
          { children }
        </AuthContext.Provider>
    );
    
}

export const useAuth = () => {
    return useContext(AuthContext);
}