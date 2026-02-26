export interface DiagnosticResult {
    text: string
    actions: string[]
    message: string
}

export const generateAiDiagnostic = async (targetData: any): Promise<DiagnosticResult> => {
    const apiKey = localStorage.getItem('openRouterKey')
    const model = localStorage.getItem('aiModel') || 'google/gemini-2.5-flash-free'

    if (!apiKey) {
        throw new Error('API Key não configurada. Configure a integração de IA nas Configurações.')
    }

    const payload = {
        model,
        messages: [
            {
                role: 'system',
                content: `Você é um Analista de Performance de Vendas (AutoPerf IA) avaliando métricas e funil.
Responda APENAS com um JSON estrito contendo: 
{ 
   "text": "Um diagnóstico analítico de 2 fases", 
   "actions": ["ação 1", "ação 2"], 
   "message": "Uma mensagem empática sugerida para whatsapp do cliente." 
}
Não inclua marcadores markdown como \`\`\`json.`
            },
            {
                role: 'user',
                content: `Gere um diagnóstico de performance fictício (ainda baseado em lógica realista) para o alvo: ${JSON.stringify(targetData)}`
            }
        ],
        response_format: { type: "json_object" }
    }

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'AutoPerf CRM',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })

    if (!res.ok) {
        throw new Error('Erro na requisição da API de IA')
    }

    const data = await res.json()
    try {
        let contentStr = data.choices[0].message.content
        // Clean markdown if the model ignored instructions
        contentStr = contentStr.replace(/```json/g, '').replace(/```/g, '').trim()
        const parsed = JSON.parse(contentStr)
        return parsed as DiagnosticResult
    } catch (e) {
        throw new Error('Falha ao interpretar a resposta da IA')
    }
}
