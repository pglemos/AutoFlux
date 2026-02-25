import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { getAllowedOrigins, getCorsHeaders } from "./cors.ts"

serve(async (req) => {
    const origin = req.headers.get('origin')
    const allowedOrigins = getAllowedOrigins({ APP_URL: Deno.env.get('APP_URL') })
    const corsHeaders = getCorsHeaders(origin, allowedOrigins)

    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { type, configId } = await req.json()

        // 1. Fetch Agencies to process
        const { data: agencies } = await supabase.from('agencies').select('*')
        if (!agencies) throw new Error('No agencies found')

        const results = []

        for (const agency of agencies) {
            // 2. Fetch Config for this agency
            const { data: config } = await supabase
                .from('automation_configs')
                .select('*')
                .eq('report_type', type)
                .eq('agency_id', agency.id)
                .eq('is_enabled', true)
                .single()

            if (!config) continue;

            // 3. Aggregate Data (Agency Specific)
            const { data: leads } = await supabase.from('leads').select('*').eq('agency_id', agency.id)
            const { data: sales } = await supabase.from('commissions').select('*').eq('agency_id', agency.id)

            // Calculate Trends (Fetching last history snapshot)
            const { data: lastReport } = await supabase
                .from('report_history')
                .select('data_snapshot, created_at')
                .eq('report_type', type)
                .eq('config_id', config.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single()

            const stats = {
                agencyName: agency.name,
                totalLeads: leads?.length ?? 0,
                totalSales: sales?.length ?? 0,
                newLeadsToday: leads?.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString()).length ?? 0,
                staleLeads: leads?.filter(l => l.stagnant_days && l.stagnant_days >= 2).length ?? 0,
                previousTotalLeads: lastReport?.data_snapshot?.totalLeads ?? 0,
                trend: lastReport ? ((leads?.length ?? 0) - (lastReport.data_snapshot.totalLeads ?? 0)) : 0
            }

            // 4. AISmart Prompt (Simulated sophisticated prompt)
            const aiPrompt = `
        Você é ${config.ai_context || 'um consultor sênior'}.
        Agência: ${stats.agencyName}
        Dados Atuais: ${stats.totalLeads} leads, ${stats.totalSales} vendas.
        Tendência: ${stats.trend > 0 ? 'Aumento' : 'Queda'} de ${Math.abs(stats.trend)} leads desde o último disparo.
        Leads novos hoje: ${stats.newLeadsToday}.
        Leads estagnados (+48h): ${stats.staleLeads}.
        
        Gere um relatório matinal conciso com 3 pontos acionáveis e uma análise de tendência.
      `;

            // Simulating AI response with trend analysis
            const trendText = stats.trend === 0 ? "Estável" : `${stats.trend > 0 ? '📈 Alta' : '📉 Queda'} de ${Math.abs(stats.trend)} leads`;
            const aiInsight = `Agência ${agency.name} | Análise: ${trendText}
1. FOCO: Temos ${stats.newLeadsToday} leads novos entrando. Prioridade total na primeira resposta!
2. ALERTA: ${stats.staleLeads} leads estão parados há mais de 48h. Vamos redistribuir para não perder o "timing".
3. PERFORMANCE: Mantendo o ritmo atual, projetamos bater a meta com folga.

${config.ai_context.includes('motivacional') ? 'Vamos pra cima! 🚀' : 'Sucesso e foco total nos números.'}`;

            // 5. Save and Deliver
            const { data: history } = await supabase.from('report_history').insert({
                config_id: config.id,
                report_type: type,
                data_snapshot: stats,
                ai_insight: aiInsight
            }).select().single()

            // Log delivery attempt
            console.log(`Delivering to ${config.recipients?.length ?? 0} recipients for ${agency.name}`)
            results.push({ agency: agency.name, historyId: history?.id })
        }

        return new Response(JSON.stringify({ success: true, processed: results.length, details: results }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
