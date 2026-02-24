import { createContext, useContext, useState, ReactNode } from 'react'

export type Role = 'Owner' | 'Manager' | 'Seller' | 'RH' | 'Consultoria'

type AuthContextType = {
    role: Role
    setRole: (role: Role) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [role, setRole] = useState<Role>('Manager')

    return (
        <AuthContext.Provider value={{ role, setRole }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}
