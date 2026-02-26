import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface Notification {
    id: string
    title: string
    description: string
    time_label: string
    is_read: boolean
    created_at: string
}

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchNotifications = async () => {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(20)

            if (!error && data) {
                setNotifications(data)
            }
            setLoading(false)
        }

        fetchNotifications()

        // Setup real-time subscription
        const subscription = supabase
            .channel('public:notifications')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'notifications' },
                (payload) => {
                    setNotifications((current) => [payload.new as Notification, ...current])
                }
            )
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'notifications' },
                (payload) => {
                    setNotifications((current) =>
                        current.map((n) => n.id === payload.new.id ? (payload.new as Notification) : n)
                    )
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(subscription)
        }
    }, [])

    const markAsRead = async (id: string) => {
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', id)

        if (!error) {
            setNotifications((current) =>
                current.map((n) => (n.id === id ? { ...n, is_read: true } : n))
            )
        }
    }

    const markAllAsRead = async () => {
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('is_read', false)

        if (!error) {
            setNotifications((current) =>
                current.map((n) => ({ ...n, is_read: true }))
            )
        }
    }

    return {
        notifications,
        loading,
        unreadCount: notifications.filter(n => !n.is_read).length,
        markAsRead,
        markAllAsRead
    }
}
