import React from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText, ArrowLeft, Sparkles, Database, Globe, UserCheck, Trash2, ShieldCheck, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Privacy() {
    const navigate = useNavigate();

    const sections = [
        {
            icon: FileText,
            title: "1. Introdução e Base Legal (LGPD)",
            content: "A AutoGestão ('Operadora' ou 'Controladora', dependendo do contexto) está estritamente comprometida com a proteção e a privacidade dos dados de seus usuários e clientes. Esta Política de Privacidade foi elaborada em total conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 - LGPD), o Marco Civil da Internet (Lei nº 12.965/2014) e as normativas de proteção de dados aplicáveis. O objetivo deste documento é detalhar como coletamos, processamos, armazenamos e protegemos seus dados dentro da nossa infraestrutura."
        },
        {
            icon: Database,
            title: "2. Coleta de Dados e Natureza das Informações",
            content: "Coletamos dados estritamente limitados ao escopo do serviço prestado. Isso inclui: (a) Dados Cadastrais: Nome corporativo, CNPJ, responsável legal, endereço comercial; (b) Dados de Credenciais: E-mails corporativos, funções (roles), logs de acesso e IPs (para auditoria); (c) Dados Operacionais: Informações integradas sobre frota, estoque e leads, que o cliente, na figura de Controlador, insere na plataforma. Aplicamos o princípio da minimização de dados (Art. 6º, III, LGPD), processando apenas o que é imprescindível para a finalidade contratada."
        },
        {
            icon: Eye,
            title: "3. Finalidade e Processamento, incluindo Uso de IA",
            content: "Os dados coletados têm a finalidade exclusiva de prestação do serviço de consultoria estratégica, gestão de concessionárias e auditoria de inteligência. Nossos módulos de Inteligência Artificial analisam métricas pseudonimizadas para gerar previsões financeiras e de conversão de leads aplicáveis apenas à agência contratante. Sob nenhuma hipótese os dados privados da sua agência são utilizados para o treinamento de modelos fundacionais públicos ou compartilhados transversalmente com outros locatários da plataforma (Tenant Isolation garantido)."
        },
        {
            icon: Globe,
            title: "4. Compartilhamento e Transferência Internacional",
            content: "A LUZ DIREÇÃO mantém contrato estrito com provedores de nuvem tier-1 (como hospedagem Vercel e AWS/GCP para persistência), que cumprem rígidas normas internacionais (ISO/IEC 27001, SOC 2 Type II e ISO/IEC 27018 - Privacidade na Nuvem). Caso os dados sejam armazenados em servidores físicos fora do território brasileiro, garantimos que tais transferências seguem as diretrizes do Art. 33 da LGPD, adotando cláusulas contratuais padrão, normas corporativas globais e assegurando nível de conformidade equivalente ao exigido pela legislação local."
        },
        {
            icon: UserCheck,
            title: "5. Direitos do Titular de Dados",
            content: "Conforme o Art. 18 da LGPD, garantimos aos titulares os direitos de: confirmação da existência de tratamento; acesso aos dados; correção de dados incompletos ou desatualizados; anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos; portabilidade; eliminação dos dados tratados com consentimento; e revogação do consentimento. Solicitações referentes ao exercício desses direitos devem ser direcionadas ao nosso Encarregado pelo Tratamento de Dados Pessoais (DPO)."
        },
        {
            icon: Trash2,
            title: "6. Retenção e Descarte de Informações",
            content: "Mantemos seus dados pessoais e operacionais apenas pelo período necessário para cumprir as finalidades descritas ou para o cumprimento de obrigações legais, regulatórias, processuais ou contratuais. Após o encerramento do contrato e passado o período legal de retenção de logs de acesso (mínimo 6 meses, art. 15 do Marco Civil da Internet), todos os dados do locatário (Tenant) sofrem deleção criptográfica irreversível dos nossos servidores, com a respectiva emissão opcional de certificado de destruição de dados."
        },
        {
            icon: ShieldCheck,
            title: "7. Segurança da Informação e Padrões",
            content: "Adotamos as melhores práticas globais de segurança da informação (SI). Possuímos arquitetura Multi-Tenant isolada logicamente e validada por políticas de acesso em nível de linha (RLS do PostgreSQL via Supabase). Todos os dados em trânsito são encriptados (TLS 1.2+), e os at-rest utilizam AES-256. Implementamos proteção mitigatória contra ataques arquiteturais web (DDoS/WAF) e as rotinas administrativas de autenticação baseiam-se em exigências modernas de hashing (Bcrypt)."
        },
        {
            icon: Mail,
            title: "8. Contato do DPO e Notificações de Incidente",
            content: "Em conformidade com o Art. 41 da LGPD, a LUZ DIREÇÃO nomeou um Encarregado de Dados (Data Protection Officer - DPO), que atua como canal de comunicação entre a operadora, os titulares e a Autoridade Nacional de Proteção de Dados (ANPD). Para tratar de qualquer incidente de segurança, vazamento (real ou suspeito) ou exercício de direitos, entre em contato exclusivamente pelo canal seguro de governança de dados associado a consultoria. Nossa política estipula notificação de contenção rápida para parceiros sobre qualquer incidente que comprometa a base isolada."
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
                                <div className="size-10 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center shadow-2xl">
                                    <Shield className="size-5 text-white dark:text-slate-900" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Security Standard v3.1</span>
                            </div>
                            <h1 className="text-4xl font-extralight tracking-tighter leading-none mb-4">
                                Política Global de <br />
                                <span className="font-bold italic">Privacidade</span>
                            </h1>
                            <div className="h-1 w-12 bg-[#94785C] rounded-full" />
                        </div>

                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
                            Comprometimento integral com a LGPD e rigor estrutural na gestão da privacidade. Nossa matriz de governança assegura a proteção legal dos seus ativos digitais.
                        </p>

                        <div className="pt-8 border-t border-slate-200 dark:border-white/10 space-y-4">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
                                Compliance LGPD: ATIVO
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <span className="size-1.5 rounded-full bg-slate-300" />
                                Revisão Documental: Outubro 2026
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
                            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400 mb-6 px-4">Conformidade Regulatória</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="p-4 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 flex items-center gap-3">
                                    <div className="size-1.5 rounded-full bg-[#94785C]" />
                                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">LGPD (Lei 13.709)</span>
                                </div>
                                <div className="p-4 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 flex items-center gap-3">
                                    <div className="size-1.5 rounded-full bg-[#94785C]" />
                                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">ISO/IEC 27001</span>
                                </div>
                                <div className="p-4 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 flex items-center gap-3">
                                    <div className="size-1.5 rounded-full bg-[#94785C]" />
                                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">SOC 2 Type II</span>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Footer Inside Content */}
                    <div className="pt-16 border-t border-slate-200 dark:border-white/10 flex items-center justify-between opacity-50">
                        <div className="flex items-center gap-3">
                            <Sparkles className="size-4 text-[#94785C]" />
                            <span className="text-[10px] font-black tracking-[0.5em] uppercase">LUZ DIREÇÃO</span>
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-widest truncate">© 2026 Data & Privacy Operations</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
