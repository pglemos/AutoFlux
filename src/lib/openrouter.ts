/**
 * OpenRouter AI Service
 * Uses the free z-ai/glm-4.5-air model via REST API (browser-compatible).
 */

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const DEFAULT_MODEL = 'z-ai/glm-4.5-air:free'

/** Free models available on OpenRouter */
export const FREE_AI_MODELS = [
    { id: 'z-ai/glm-4.5-air:free', name: 'GLM-4.5 Air', provider: 'Zhipu AI', context: '128K', desc: 'Modelo chinês rápido e eficiente para tarefas gerais.' },
    { id: 'google/gemma-3-1b-it:free', name: 'Gemma 3 1B', provider: 'Google', context: '32K', desc: 'Modelo compacto do Google, ótimo para respostas rápidas.' },
    { id: 'google/gemma-3-4b-it:free', name: 'Gemma 3 4B', provider: 'Google', context: '32K', desc: 'Modelo médio do Google com boa qualidade de raciocínio.' },
    { id: 'meta-llama/llama-4-scout:free', name: 'Llama 4 Scout', provider: 'Meta', context: '512K', desc: 'Novo modelo da Meta otimizado para análise e busca.' },
    { id: 'meta-llama/llama-4-maverick:free', name: 'Llama 4 Maverick', provider: 'Meta', context: '256K', desc: 'Modelo avançado da Meta para raciocínio complexo.' },
    { id: 'deepseek/deepseek-r1:free', name: 'DeepSeek R1', provider: 'DeepSeek', context: '64K', desc: 'Modelo de raciocínio profundo, ideal para análises detalhadas.' },
    { id: 'qwen/qwen3-235b-a22b:free', name: 'Qwen 3 235B', provider: 'Alibaba', context: '40K', desc: 'Modelo massivo com excelente capacidade analítica.' },
    { id: 'mistralai/devstral-small:free', name: 'Devstral Small', provider: 'Mistral', context: '128K', desc: 'Modelo europeu focado em código e análise técnica.' },
    { id: 'microsoft/phi-4-reasoning:free', name: 'Phi 4 Reasoning', provider: 'Microsoft', context: '32K', desc: 'Modelo compacto da Microsoft otimizado para raciocínio lógico.' },
] as const

function getApiKey(): string {
    return import.meta.env.VITE_OPENROUTER_API_KEY || ''
}

interface AIResponse {
    text: string
    actions: string[]
    message: string
}

/**
 * Generates a sales diagnostic using real AI.
 */
export async function generateAIDiagnostic(context: {
    dormantLeads: number
    criticalInventory: number
    totalLeads: number
    totalSales: number
    teamSize: number
    targetName: string
    avgAging: number
}, model?: string): Promise<AIResponse> {
    const systemPrompt = `Você é o AutoGestão AI, um analista de performance de vendas automotivas de alta performance.
Seu papel é analisar dados reais de uma concessionária e gerar diagnósticos acionáveis.
SEMPRE responda em português brasileiro. Seja direto, estratégico e orientado a resultados.
Formato OBRIGATÓRIO da resposta (JSON válido, sem markdown):
{
  "text": "Diagnóstico principal em 2-3 frases curtas e impactantes",
  "actions": ["Ação 1 específica e mensurável", "Ação 2", "Ação 3"],
  "message": "Mensagem curta e motivacional para enviar à equipe via WhatsApp (máx 2 frases)"
}`

    const userPrompt = `Analise a performance da equipe "${context.targetName}":
- ${context.dormantLeads} leads estagnados (sem contato há mais de 2 dias) de um total de ${context.totalLeads}
- ${context.criticalInventory} veículos em estoque crítico (aging > 45 dias)
- Aging médio do estoque: ${context.avgAging} dias
- ${context.totalSales} vendas realizadas no mês com ${context.teamSize} vendedores ativos
Gere um diagnóstico estratégico com ações prioritárias e uma mensagem motivacional para a equipe.`

    const apiKey = getApiKey()
    if (!apiKey) {
        throw new Error('API key não configurada')
    }

    const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'AutoGestão OS'
        },
        body: JSON.stringify({
            model: model || DEFAULT_MODEL,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            temperature: 0.3,
            max_tokens: 600,
        })
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`OpenRouter API error: ${response.status} - ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    const rawContent = data.choices?.[0]?.message?.content || ''

    try {
        // Try to parse the JSON response
        const cleaned = rawContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        const parsed = JSON.parse(cleaned)
        return {
            text: parsed.text || 'Diagnóstico gerado com sucesso.',
            actions: Array.isArray(parsed.actions) ? parsed.actions : [],
            message: parsed.message || ''
        }
    } catch {
        // If JSON parsing fails, return the raw text
        return {
            text: rawContent.slice(0, 300),
            actions: ['Revisar leads estagnados', 'Focar em estoque de aging alto', 'Alinhar metas com equipe'],
            message: 'Equipe, vamos revisar nossos leads pendentes e focar no fechamento!'
        }
    }
}

/**
 * Generates an AI-crafted message for reports/WhatsApp.
 */
export async function generateAIMessage(context: {
    type: 'morning' | 'weekly' | 'monthly'
    salesCount: number
    leadsCount: number
    conversionRate: number
    topSeller: string
    stockValue: number
}, model?: string): Promise<string> {
    const apiKey = getApiKey()
    if (!apiKey) throw new Error('API key não configurada')

    const typeNames = { morning: 'Matinal', weekly: 'Semanal', monthly: 'Mensal' }

    const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'AutoGestão OS'
        },
        body: JSON.stringify({
            model: model || DEFAULT_MODEL,
            messages: [
                {
                    role: 'system',
                    content: `Você é o AutoGestão AI. Gere um relatório ${typeNames[context.type]} curto e profissional para envio via WhatsApp.
Use emojis estrategicamente. Máximo 5 linhas. Português brasileiro. Inclua os números fornecidos.`
                },
                {
                    role: 'user',
                    content: `Dados do período:
- Vendas: ${context.salesCount}
- Leads ativos: ${context.leadsCount}
- Taxa de conversão: ${context.conversionRate.toFixed(1)}%
- Destaque: ${context.topSeller}
- Valor em estoque: R$ ${(context.stockValue / 1000).toFixed(0)}k
Gere o relatório ${typeNames[context.type]}.`
                }
            ],
            temperature: 0.5,
            max_tokens: 300,
        })
    })

    if (!response.ok) throw new Error('OpenRouter API error')

    const data = await response.json()
    return data.choices?.[0]?.message?.content || 'Relatório não disponível.'
}
