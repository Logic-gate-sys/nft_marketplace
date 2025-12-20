import { Provider, Signer } from 'ethers';
import React, { useContext, createContext, useState, useRef } from 'react';

interface AuthContextType{
    user: any;
    token: string | null;
    wallet: string | null;
    readProvider: any;
    provider: Provider | null;
    signer: Signer | null;
    connectWallet: ( wallet:string,signer:Signer, provider:Provider, user?:any, token?:string ) => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const providerRef = React.useRef<Provider | null>(null);
  const signerRef = React.useRef<Signer | null>(null);
  const readProviderRef = React.useRef<Provider | null>(null);

  const [wallet, setWallet] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  const connectWallet = (
    wallet: string,
    signer: Signer,
    provider: Provider,
    readProvider: Provider,
    user?: any,
    token?: string
  ) => {
    signerRef.current = signer;
    providerRef.current = provider;
    readProviderRef.current = readProvider;

    setWallet(wallet);
    setUser(user ?? null);
    setToken(token ?? null);
  };

  const value = React.useMemo(
    () => ({
      wallet,
      user,
      token,
      signer: signerRef.current,
      provider: providerRef.current,
      readProvider: readProviderRef.current,
      connectWallet
    }),
    [wallet, user, token]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
    return useContext(AuthContext);
}