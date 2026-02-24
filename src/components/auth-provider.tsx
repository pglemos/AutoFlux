import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { User, Session } from '@supabase/supabase-js'

export type Role = 'Owner' | 'Manager' | 'Seller' | 'RH' | 'Admin'

type AuthContextType = {
    user: User | null
    session: Session | null
    role: Role
    agencyId: string | null
    loading: boolean
    setRole: (role: Role) => void
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [role, setRole] = useState<Role>('Manager')
    const [agencyId, setAgencyId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchUserData = async (userId: string) => {
        console.log('fetchUserData: SKIPPED (Diagnostic)', userId)
        setRole('Manager')
    }

    useEffect(() => {
        let isSubscribed = true
        console.log('AuthProvider: useEffect INIT')

        // Get initial session
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (!isSubscribed) return
            console.log('AuthProvider: getSession result', { hasSession: !!session })

            setSession(session)
            const currentUser = session?.user ?? null
            setUser(currentUser)

            if (currentUser) {
                // fetchUserData(currentUser.id) // Skip for now
                setRole('Manager') // Default role
            }

            if (isSubscribed) {
                setLoading(false)
                console.log('AuthProvider: loading set to FALSE (getSession)')
            }
        })

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!isSubscribed) return
            console.log('AuthProvider: onAuthStateChange', event, { hasSession: !!session })

            setSession(session)
            const currentUser = session?.user ?? null
            setUser(currentUser)

            if (currentUser) {
                // await fetchUserData(currentUser.id) // Skip for now
                setRole('Manager') // Default role
            } else {
                setAgencyId(null)
            }

            if (isSubscribed) {
                setLoading(false)
                console.log('AuthProvider: loading set to FALSE (onAuthStateChange)')
            }
        })

        return () => {
            isSubscribed = false
            subscription.unsubscribe()
        }
    }, [])

    const signOut = async () => {
        await supabase.auth.signOut()
    }

    return (
        <AuthContext.Provider value={{ user, session, role, agencyId, loading, setRole, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}
