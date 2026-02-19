// AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface AuthTokens {
    access: string;
    refresh: string;
}

interface User {
    user_id: number;
    username: string;
    exp: number;
    iat: number;
}

interface AuthContextType {
    user: User | null;
    authTokens: AuthTokens | null;
    loginUser: (username: string, password: string) => Promise<void>;
    logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [authTokens, setAuthTokens] = useState<AuthTokens | null>(() => localStorage.getItem('tokens') ? JSON.parse(localStorage.getItem('tokens')!) : null);
    const [user, setUser] = useState<User | null>(() => localStorage.getItem('tokens') ? jwtDecode<User>(localStorage.getItem('tokens')!) : null);

    const loginUser = async (username: string, password: string) => {
        const response = await axios.post('/api/login/', { username, password });
        if (response.status === 200) {
            setAuthTokens(response.data);
            setUser(jwtDecode<User>(response.data.access));
            localStorage.setItem('tokens', JSON.stringify(response.data));
        }
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('tokens');
    };

    return (
        <AuthContext.Provider value={{ user, authTokens, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
