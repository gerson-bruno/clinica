import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface UserProfile {
    id: string;
    nome: string;
    email: string;
    senha?: string;
    crefito: string;
    fotoBase64?: string;
}

interface AuthContextType {
    user: UserProfile | null;
    isAuthenticated: boolean;
    login: (email: string, senha?: string) => boolean;
    logout: () => void;
    updateProfile: (data: Partial<UserProfile>) => void;
    register: (data: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(() => {
        const storedUser = localStorage.getItem('clinica_currentUser');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [users, setUsers] = useState<UserProfile[]>(() => {
        const stored = localStorage.getItem('clinica_users');
        if (stored) return JSON.parse(stored);

        // Default admin user
        const defaultUser: UserProfile = {
            id: '1',
            nome: 'Gerson Bruno',
            email: 'admin',
            senha: '123',
            crefito: '12345-F'
        };
        return [defaultUser];
    });

    useEffect(() => {
        localStorage.setItem('clinica_users', JSON.stringify(users));
        if (user) {
            localStorage.setItem('clinica_currentUser', JSON.stringify(user));
        } else {
            localStorage.removeItem('clinica_currentUser');
        }
    }, [user, users]);

    const login = (email: string, senha?: string) => {
        const found = users.find(u => u.email === email && u.senha === senha);
        if (found) {
            setUser(found);
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
    };

    const updateProfile = (data: Partial<UserProfile>) => {
        if (!user) return;

        const updatedUser = { ...user, ...data };
        setUser(updatedUser);

        setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    };

    const register = (data: UserProfile) => {
        setUsers(prev => [...prev, data]);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateProfile, register }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
