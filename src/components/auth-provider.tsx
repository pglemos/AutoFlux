import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { User, Session } from '@supabase/supabase-js'
import { getUserData } from '@/lib/auth-service'

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

    const fetchUserData = async (userId: string, isInitialFetch = false) => {
        // Optimistic load to speed up render time immediately
        const cachedRole = localStorage.getItem(`role_${userId}`)
        const cachedAgencyId = localStorage.getItem(`agency_${userId}`)

        if (isInitialFetch && cachedRole) {
            setRole(cachedRole as Role)
            if (cachedAgencyId) setAgencyId(cachedAgencyId)
            setLoading(false) // Render immediately while background fetching happens
        }

        try {
            const { data, error } = await getUserData(userId, supabase)

            if (!error && data) {
                setRole(data.role as Role)
                setAgencyId(data.agency_id)
                localStorage.setItem(`role_${userId}`, data.role)
                if (data.agency_id) {
                    localStorage.setItem(`agency_${userId}`, data.agency_id)
                } else {
                    localStorage.removeItem(`agency_${userId}`)
                }
            } else {
                if (!cachedRole) setRole(null) // Only clear if we didn't use cache
                if (!cachedAgencyId) setAgencyId(null)
            }
        } catch (err) {
            console.error('fetchUserData error:', err)
            if (!cachedRole) setRole(null)
            if (!cachedAgencyId) setAgencyId(null)
        }
    }

    useEffect(() => {
        let isSubscribed = true
        let initialSessionLoaded = false

        // Get initial session
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (!isSubscribed) return

            setSession(session)
            const currentUser = session?.user ?? null
            setUser(currentUser)

            if (currentUser) {
                await fetchUserData(currentUser.id, true)
            } else {
                setRole(null)
                setAgencyId(null)
            }

            initialSessionLoaded = true
            if (isSubscribed) {
                setLoading(false)
            }
        })

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!isSubscribed) return

            // Avoid double fetch on startup
            if (event === 'INITIAL_SESSION' || (event === 'SIGNED_IN' && !initialSessionLoaded)) return

            setSession(session)
            const currentUser = session?.user ?? null
            setUser(currentUser)

            if (currentUser) {
                await fetchUserData(currentUser.id, false)
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
        if (user?.id) {
            localStorage.removeItem(`role_${user.id}`)
            localStorage.removeItem(`agency_${user.id}`)
        }
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
