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
        console.log('fetchUserData: START for', userId)
        try {
            const { data, error } = await supabase
                .from('team')
                .select('role, agency_id')
                .eq('id', userId)
                .single()

            if (error) {
                console.error('fetchUserData: ERROR', error)
            } else if (data) {
                console.log('fetchUserData: SUCCESS', data.role)
                setRole(data.role as Role)
                setAgencyId(data.agency_id)
            } else {
                console.warn('fetchUserData: NO DATA FOUND')
            }
        } catch (err) {
            console.error('fetchUserData: UNEXPECTED EXCEPTION', err)
        } finally {
            console.log('fetchUserData: END')
        }
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
                await fetchUserData(currentUser.id)
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
                await fetchUserData(currentUser.id)
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
