import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import type { Task, TaskStatus, TaskPriority } from '@/types'
import { toCamelCase, toSnakeCase } from '@/lib/utils'

export interface TasksState {
    tasks: Task[]
    addTask: (task: Omit<Task, 'id' | 'status'>) => void
    updateTask: (id: string, updates: Partial<Task>) => void
    deleteTask: (id: string) => void
}

const TasksContext = createContext<TasksState | undefined>(undefined)

export function TasksProvider({ children }: { children: ReactNode }) {
    const [tasks, setTasks] = useState<Task[]>([])

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const { data, error } = await supabase.from('tasks').select('*')
                if (!error && data) setTasks(toCamelCase(data))
            } catch {
                // Table may not exist yet
            }
        }
        fetchTasks()

        const subscription = supabase
            .channel('public:tasks')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tasks' }, (payload) => {
                setTasks(prev => [...prev, toCamelCase(payload.new) as Task])
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tasks' }, (payload) => {
                const updated = toCamelCase(payload.new) as Task
                setTasks(prev => prev.map(t => t.id === updated.id ? updated : t))
            })
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'tasks' }, (payload) => {
                setTasks(prev => prev.filter(t => t.id !== payload.old.id))
            })
            .subscribe()

        return () => {
            supabase.removeChannel(subscription)
        }
    }, [])

    const addTask = useCallback(async (task: Omit<Task, 'id' | 'status'>) => {
        try {
            const { data, error } = await supabase.from('tasks').insert([toSnakeCase({ ...task, status: 'Pendente' })]).select()
            if (!error && data) {
                setTasks(prev => [...prev, toCamelCase(data[0])])
            } else {
                const localTask: Task = { ...task, id: crypto.randomUUID(), status: 'Pendente' } as Task
                setTasks(prev => [...prev, localTask])
            }
        } catch {
            const localTask: Task = { ...task, id: crypto.randomUUID(), status: 'Pendente' } as Task
            setTasks(prev => [...prev, localTask])
        }
    }, [])

    const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
        try {
            await supabase.from('tasks').update(toSnakeCase(updates)).eq('id', id)
        } catch {
            // Local state already updated
        }
    }, [])

    const deleteTask = useCallback(async (id: string) => {
        setTasks(prev => prev.filter(t => t.id !== id))
        try {
            await supabase.from('tasks').delete().eq('id', id)
        } catch {
            // Local state already updated
        }
    }, [])

    const value = useMemo<TasksState>(() => ({
        tasks, addTask, updateTask, deleteTask,
    }), [tasks, addTask, updateTask, deleteTask])

    return (
        <TasksContext.Provider value={value}>
            {children}
        </TasksContext.Provider>
    )
}

export function useTasks() {
    const context = useContext(TasksContext)
    if (!context) throw new Error('useTasks must be used within TasksProvider')
    return context
}
