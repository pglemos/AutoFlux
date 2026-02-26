import React from "react";
import { motion } from "framer-motion";
import { FileText, Gavel, Scale, ArrowLeft, Sparkles, ShieldAlert, Copyright, Briefcase, Timer, Server, AlertTriangle, Ban } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Terms() {
    const navigate = useNavigate();

    const sections = [
        {
            icon: Gavel,
            title: "1. Aceite e Objeto Contratual",
            content: "O presente documento constitui um acordo legalmente vinculativo entre a AutoPerf e a Pessoa Jurídica cadastrada ('Contratante'). O acesso, navegação ou utilização de qualquer módulo do ecossistema de software implica na anuência explícita, irrevogável e irrestrita com os Termos de Serviço (TOS) aqui definidos, bem como nossa Política de Privacidade associada. Em caso de não consonância com as presentes condições, o uso do sistema deve ser instantaneamente cessado."
        },
        {
            icon: Copyright,
            title: "2. Licenciamento e Propriedade Intelectual",
            content: "Concedemos ao Contratante uma licença revogável, não-exclusiva, intransferível e limitada ao uso do software-as-a-service (SaaS) restrito às suas operações internas. Todos os direitos de propriedade intelectual aplicáveis (códigos-fonte em React/Node, algoritmos e weights de inteligência artificial, design do front-end, estrutura de relatórios de BI, e a marca AutoPerf) são e permanecerão sendo de titularidade irrenunciável e exclusiva da operadora."
        },
        {
            icon: Briefcase,
            title: "3. Obrigações e Responsabilidades Primárias do Autuante",
            content: "O Contratante é o único e integral responsável civil e criminalmente pelas atividades de seus usuários ativos administrados localmente. É flagrantemente vedada aos usuários corporativos a prática de engenharia reversa do código, sublicenciamento não autorizado, extração massiva de dados por raspagem automatizada, e injeção de dados falsos ou maliciosos. A credencial de acesso é inviolável, sendo do administrador da agência toda a responsabilidade de auditar acessos suspeitos."
        },
        {
            icon: Timer,
            title: "4. Nível de Serviço (SLA) de Plataforma e Contratempos",
            content: "A AutoPerf planeja um cálculo e meta de disponibilidade real da plataforma de 99.9% contínuos e calculados mensalmente. Computa-se como 'fora do uptime' qualquer ocasião que impossibilite inteiramente chamadas vitais ao backend da plataforma. Paradas sistêmicas visando manutenção e que foram comunicadas ao menos 48h retroativamente, assim como ocorrências globais de força-maior estrutural (falhas massivas em serviços de infraestrutura DNS e Nuvem) ficam isentos de penalizações contratuais associadas do SLA legal."
        },
        {
            icon: Server,
            title: "5. Integridade Institucional do Banco de Dados",
            content: "As operações estruturadoras de backup são procedidas de maneira espelhada em banco de dados isolado com rotinas diárias e rigorosas. Todavia, a plataforma AutoPerf não representa nem preenche as lacunas de um serviço independente de guarda prolongada arquivística do cliente, e em sendo a operadora isenta de multas punitivas oriundas de catástrofes de dados que não advindam de imperícia direta da gestão de engenharia da AutoPerf."
        },
        {
            icon: AlertTriangle,
            title: "6. Limitação de Responsabilidade Financeira Consolidada",
            content: "O sistema disponibiliza soluções e cálculos preditivos automatizados com base informada pelo volume. Sob absolutamente nenhuma conjectura jurídica a AutoPerf ou seu quadro societário se perfazerão responsáveis passivos por prejuízos empresariais indiretos, perda mercantil, danos imprevistos, ou lucros que deixaram de se materializar provenientes de ações de negócio assumidas com amparo nas métricas vistas na tela. O montante agregador reparatório da provedora delimitará-se à totalização contratual paga pelo cliente aos seis (6) meses precedendo à contestação documentada."
        },
        {
            icon: Ban,
            title: "7. Exclusão, Supressão e Descontinuidade",
            content: "A operadora do serviço de TI garante para si o pleno e exato direito autônomo de suprimir ou desligar sumariamente o tenant ou quaisquer usuários se auditada de perigo, inadimplemento reiterativo de faturação, anomalias sistêmicas iniciadas dos computadores da Contratante, suspeita razoável de lavagem de recursos de dados, ou transgressão incisiva destes ditames formais estabelecidos."
        },
        {
            icon: Scale,
            title: "8. Foro Eletivo e Composição de Conflitos",
            content: "Ficam regidas as avenças do presente Contrato Eletrônico sob a tutela irrestrita das legislações vigentes formalmente elaboradas e estabelecidas no Brasil (Leis Federais vinculantes ao setor virtual). Acorda-se de mútuo agrado a exclusividade soberana do Foro da Comarca da Capital do Estado de São Paulo — por mais fortuito e distinto local de onde se origina o uso do software — na arbitração ou julgamento de pendências de direito que escaparem às mediações diplomáticas primárias extra-judiciais entre a Autuante e a AutoPerf."
        }
    ];

    return (
        <div className="min-h-screen bg-[#FDFDFD] dark:bg-black font-['Inter',sans-serif] selection:bg-[#94785C]/30 text-slate-900 dark:text-slate-100">
            {/* Structural Background */}
            <div className="fixed inset-0 bg-grid-slate-900/[0.02] dark:bg-grid-white/[0.02] bg-[size:40px_40px] pointer-events-none" />
            <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#94785C]/50 to-transparent opacity-50" />

            <div className="relative z-10 max-w-5xl mx-auto px-8 py-16 lg:py-24 flex flex-col lg:flex-row gap-20">
                {/* Sidebar - Context & Navigation */}
                <div className="lg:w-1/3 lg:sticky lg:top-24 h-fit">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="group mb-12 hover:bg-slate-100 dark:hover:bg-white/5 px-4 -ml-4 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all flex items-center"
                    >
                        <ArrowLeft className="size-4 mr-2 transition-transform group-hover:-translate-x-1" />
                        <span className="text-sm font-bold uppercase tracking-widest">Voltar ao Acesso</span>
                    </Button>

                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="size-10 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center shadow-2xl text-white dark:text-slate-900">
                                    <FileText className="size-5" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Master Service Covenant</span>
                            </div>
                            <h1 className="text-4xl font-extralight tracking-tighter leading-none mb-4">
                                Termos Corporativos de <br />
                                <span className="font-bold italic text-[#94785C]">Serviços Tecnológicos</span>
                            </h1>
                            <div className="h-1 w-12 bg-[#94785C] rounded-full" />
                        </div>

                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
                            Instrumento público de regulação e delineamento de responsabilidades sobre o acesso, restrições e garantias de disponibilidade da aplicação e SLA técnico.
                        </p>

                        <div className="pt-8 border-t border-slate-200 dark:border-white/10 space-y-4">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <span className="size-1.5 rounded-full bg-slate-900 dark:bg-white" />
                                Validação Jurídica: ATIVA
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <span className="size-1.5 rounded-full bg-slate-300" />
                                Revisão Aplicável: Outubro 2026
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:w-2/3 space-y-10">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        <section className="space-y-6">
                            {sections.map((section, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="p-8 rounded-3xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 shadow-xl shadow-slate-200/20 dark:shadow-none hover:border-[#94785C]/30 transition-all group"
                                >
                                    <div className="flex items-start gap-5">
                                        <div className="size-10 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-[#94785C]/10 transition-colors">
                                            <section.icon className="size-5 text-slate-900 dark:text-white group-hover:text-[#94785C] transition-colors" />
                                        </div>
                                        <div className="space-y-3">
                                            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-none">{section.title}</h2>
                                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm text-justify">
                                                {section.content}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </section>

                        <section className="pt-8 mt-8 border-t border-slate-200 dark:border-white/10">
                            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400 mb-6 px-4">Anexos e Documentações Jurídicas</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="p-4 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 flex items-center gap-3">
                                    <div className="size-1.5 rounded-full bg-[#94785C]" />
                                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">SLA de Alta Performance (Anexo 1)</span>
                                </div>
                                <div className="p-4 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 flex items-center gap-3">
                                    <div className="size-1.5 rounded-full bg-[#94785C]" />
                                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Declaração Multi-Tenant e Isenções</span>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Footer Inside Content */}
                    <div className="pt-16 border-t border-slate-200 dark:border-white/10 flex items-center justify-between opacity-50">
                        <div className="flex items-center gap-3">
                            <Sparkles className="size-4 text-[#94785C]" />
                            <span className="text-[10px] font-black tracking-[0.5em] uppercase">AUTOPERF</span>
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-widest truncate">© 2026 Contractual Agreement Ref: 0X-AP</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
