import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface AuditLog {
    id: string
    user_id?: string
    profiles?: { name: string }
    action: string
    resource?: string
    details?: any
    created_at: string
}

export function useAuditLogs(limit: number = 20) {
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAuditLogs = async () => {
            const { data, error } = await supabase
                .from('audit_logs')
                .select('*, profiles(name)')
                .order('created_at', { ascending: false })
                .limit(limit)

            if (!error && data) {
                setAuditLogs(data)
            }
            setLoading(false)
        }

        fetchAuditLogs()

        const channel = supabase
            .channel('public:audit_logs')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'audit_logs' }, payload => {
                setAuditLogs(prev => [payload.new as AuditLog, ...prev].slice(0, limit))
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [limit])

    return { auditLogs, loading }
}
