import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { User, Session } from '@supabase/supabase-js'

export type Role = 'Owner' | 'Manager' | 'Seller' | 'RH' | 'Admin'

type AuthContextType = {
    user: User | null
    session: Session | null
    role: Role | null
    agencyId: string | null
    loading: boolean
    setRole: (role: Role) => void
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [role, setRole] = useState<Role | null>(null) // Updated to allow null
    const [agencyId, setAgencyId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchUserData = async (userId: string) => {
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('TIMEOUT_LIMIT')), 4000)
        );

        try {
            const { data, error } = await Promise.race([
                supabase
                    .from('team')
                    .select('role, agency_id')
                    .eq('id', userId)
                    .single(),
                timeoutPromise
            ]) as any

            if (!error && data) {
                setRole(data.role as Role)
                setAgencyId(data.agency_id)
            } else {
                // If no data or error, set role and agencyId to null
                setRole(null)
                setAgencyId(null)
            }
        } catch (err) {
            console.error('fetchUserData error:', err)
            // On error, also set role and agencyId to null
            setRole(null)
            setAgencyId(null)
        }
    }

    useEffect(() => {
        let isSubscribed = true

        // Get initial session
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (!isSubscribed) return

            setSession(session)
            const currentUser = session?.user ?? null
            setUser(currentUser)

            if (currentUser) {
                await fetchUserData(currentUser.id)
            } else {
                setRole(null)
                setAgencyId(null)
            }

            if (isSubscribed) {
                setLoading(false)
            }
        })

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!isSubscribed) return

            setSession(session)
            const currentUser = session?.user ?? null
            setUser(currentUser)

            if (currentUser) {
                await fetchUserData(currentUser.id)
            } else {
                setRole(null)
                setAgencyId(null)
            }

            if (isSubscribed) {
                setLoading(false)
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
