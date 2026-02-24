import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

export function Toaster() {
    const { toasts, dismiss } = useToast()

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={cn(
                        'group pointer-events-auto relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-xl border p-4 shadow-lg transition-all animate-in slide-in-from-bottom-5',
                        toast.variant === 'destructive'
                            ? 'border-red-500/30 bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-100'
                            : 'border-border bg-background text-foreground',
                    )}
                >
                    <div className="flex flex-col gap-1">
                        {toast.title && <div className="text-sm font-bold">{toast.title}</div>}
                        {toast.description && <div className="text-xs opacity-80">{toast.description}</div>}
                    </div>
                    <button onClick={() => dismiss(toast.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ))}
        </div>
    )
}
