import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Loader2, ArrowRight, Eye, EyeOff, ShieldCheck, Lock, Globe } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    const from = (location.state as any)?.from?.pathname || '/dashboard'

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error

            toast.success('Bem-vindo de volta!', {
                description: 'Login realizado com sucesso.',
            })
            navigate(from, { replace: true })
        } catch (error: any) {
            toast.error('Erro ao entrar', {
                description: error.message || 'Verifique suas credenciais.',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full bg-[#F5F5F7] dark:bg-[#1A1A1A] font-['Public_Sans',sans-serif] text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center overflow-hidden relative">

            {/* Background Elements */}
            <div
                className="absolute inset-0 opacity-60 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, #e5e5e7 1px, transparent 1px)',
                    backgroundSize: '32px 32px'
                }}
            />
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at 70% 20%, rgba(236, 91, 19, 0.08) 0%, transparent 50%)'
                }}
            />

            <div className="relative z-10 w-full max-w-[1200px] px-6 py-12 flex flex-col items-center">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full max-w-[480px]"
                >
                    {/* Glass Card */}
                    <div className="bg-white/60 dark:bg-white/[0.03] backdrop-blur-[24px] border border-white/40 dark:border-white/10 rounded-[1.25rem] p-10 shadow-2xl shadow-black/5 relative overflow-hidden group">

                        {/* Branding & Header */}
                        <div className="flex flex-col items-center gap-6 text-center mb-8">
                            <div className="size-12 bg-[#1A1A1A] dark:bg-[#ec5b13] rounded-xl flex items-center justify-center text-white shadow-xl transform transition-transform group-hover:scale-110 duration-500">
                                <Globe className="w-7 h-7" />
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-3xl font-light tracking-wide text-[#1A1A1A] dark:text-slate-100">AutoGestão</h1>
                                <p className="text-slate-500 dark:text-slate-400 text-[10px] font-medium tracking-[0.2em] uppercase">Enterprise Fleet Management</p>
                            </div>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleLogin} className="flex flex-col gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-slate-400 pl-1">Identificador de E-mail</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="nome@autogestao.com.br"
                                        required
                                        className="w-full bg-white/40 dark:bg-slate-800/20 border border-white/50 dark:border-slate-700/50 rounded-lg h-12 px-4 text-sm focus:ring-1 focus:ring-[#ec5b13]/40 focus:border-[#ec5b13]/40 transition-all outline-none placeholder:text-slate-400 shadow-inner dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-slate-400">Chave de Segurança</label>
                                    <button type="button" className="text-[10px] uppercase tracking-widest text-[#ec5b13] font-semibold hover:opacity-80 transition-opacity">Esqueceu?</button>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        required
                                        className="w-full bg-white/40 dark:bg-slate-800/20 border border-white/50 dark:border-slate-700/50 rounded-lg h-12 px-4 text-sm focus:ring-1 focus:ring-[#ec5b13]/40 focus:border-[#ec5b13]/40 transition-all outline-none placeholder:text-slate-400 shadow-inner dark:text-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#ec5b13] transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#1A1A1A] dark:bg-[#ec5b13] text-white h-12 rounded-lg font-medium tracking-wide shadow-2xl hover:bg-slate-800 dark:hover:bg-[#ec5b13]/90 transition-all flex items-center justify-center gap-2 mt-2 active:scale-[0.98] disabled:opacity-70"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <span>Entrar no Sistema</span>
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative flex items-center py-6">
                            <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                            <span className="flex-shrink mx-4 text-[10px] uppercase tracking-[0.3em] text-slate-400 font-light">Acesso Direto</span>
                            <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                        </div>

                        {/* Social Logins */}
                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-2 h-12 rounded-lg border border-white/60 dark:border-slate-700/60 bg-white/30 dark:bg-white/[0.02] hover:bg-white/50 transition-colors">
                                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.02-2.23 1.74-4.07 3.86-4.14.22 2.48-2.3 4.47-3.86 4.14z"></path></svg>
                                <span className="text-xs font-medium tracking-wide text-slate-700 dark:text-slate-300">Apple</span>
                            </button>
                            <button className="flex items-center justify-center gap-2 h-12 rounded-lg border border-white/60 dark:border-slate-700/60 bg-white/30 dark:bg-white/[0.02] hover:bg-white/50 transition-colors">
                                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"></path></svg>
                                <span className="text-xs font-medium tracking-wide text-slate-700 dark:text-slate-300">Google</span>
                            </button>
                        </div>

                        {/* Footer */}
                        <div className="text-center mt-8">
                            <p className="text-xs text-slate-400 font-light">
                                Novo na plataforma? <button type="button" className="text-[#1A1A1A] dark:text-slate-100 font-medium hover:underline">Solicitar Acesso</button>
                            </p>
                        </div>
                    </div>

                    {/* Security Badge */}
                    <div className="mt-12 flex items-center justify-center gap-6 text-slate-400">
                        <div className="flex items-center gap-1.5 opacity-50">
                            <Lock size={12} className="text-slate-500" />
                            <span className="text-[10px] uppercase tracking-widest font-medium">Criptografia Ponta-a-Ponta</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                        <div className="flex items-center gap-1.5 opacity-50">
                            <ShieldCheck size={12} className="text-slate-500" />
                            <span className="text-[10px] uppercase tracking-widest font-medium">Certificação ISO 27001</span>
                        </div>
                    </div>
                </motion.div>

                <p className="text-center mt-12 text-[10px] tracking-[0.2em] uppercase text-slate-400 dark:text-slate-600">
                    &copy; {new Date().getFullYear()} AutoGestão System. All Rights Reserved.
                </p>
            </div>

            {/* Decorative Bottom Gradient */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#ec5b13]/20 to-transparent"></div>
        </div>
    )
}
