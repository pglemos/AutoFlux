import * as React from 'react'
import { cn } from '@/lib/utils'

// Simplified chart components for recharts integration
// These provide theming context for recharts charts

type ChartConfig = Record<string, { label: string; color: string }>

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    config: ChartConfig
    children: React.ReactNode
}

function ChartContainer({ config, className, children, ...props }: ChartContainerProps) {
    const style = Object.entries(config).reduce(
        (acc, [key, value]) => {
            acc[`--color-${key}`] = value.color
            return acc
        },
        {} as Record<string, string>,
    )

    return (
        <div className={cn('w-full', className)} style={style} {...props}>
            {children}
        </div>
    )
}

function ChartTooltipContent({ active, payload, label }: any) {
    if (!active || !payload?.length) return null

    return (
        <div className="rounded-xl border bg-background p-3 shadow-lg">
            {label && <p className="text-xs font-bold text-muted-foreground mb-2">{label}</p>}
            {payload.map((entry: any, index: number) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
                    <span className="font-semibold text-foreground">{entry.name || entry.dataKey}:</span>
                    <span className="font-bold text-foreground">{entry.value}</span>
                </div>
            ))}
        </div>
    )
}

import { Tooltip as ChartTooltip } from 'recharts'

export { ChartContainer, ChartTooltip, ChartTooltipContent }
export type { ChartConfig }
