import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Task, TaskStatus, TaskPriority } from '@/types'

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
            const { data, error } = await supabase.from('tasks').select('*')
            if (!error && data) setTasks(data)
        }
        fetchTasks()
    }, [])

    const addTask = useCallback(async (task: Omit<Task, 'id' | 'status'>) => {
        const { data, error } = await supabase.from('tasks').insert([{ ...task, status: 'Pendente' }]).select()
        if (!error && data) setTasks(prev => [...prev, data[0]])
    }, [])

    const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
        const { error } = await supabase.from('tasks').update(updates).eq('id', id)
        if (!error) setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
    }, [])

    const deleteTask = useCallback(async (id: string) => {
        const { error } = await supabase.from('tasks').delete().eq('id', id)
        if (!error) setTasks(prev => prev.filter(t => t.id !== id))
    }, [])

    return (
        <TasksContext.Provider value={{ tasks, addTask, updateTask, deleteTask }}>
            {children}
        </TasksContext.Provider>
    )
}

export function useTasks() {
    const context = useContext(TasksContext)
    if (!context) throw new Error('useTasks must be used within TasksProvider')
    return context
}
