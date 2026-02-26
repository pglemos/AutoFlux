import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { AnimatedCharacters } from "@/components/ui/animated-characters";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [mouseX, setMouseX] = useState<number>(0);
    const [mouseY, setMouseY] = useState<number>(0);
    const [isPurpleBlinking, setIsPurpleBlinking] = useState(false);
    const [isBlackBlinking, setIsBlackBlinking] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false);
    const [isPurplePeeking, setIsPurplePeeking] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as any)?.from?.pathname || '/dashboard';

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMouseX(e.clientX);
            setMouseY(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // Blinking effect for characters
    useEffect(() => {
        const getRandomBlinkInterval = () => Math.random() * 4000 + 3000;
        const scheduleBlink = (setter: (v: boolean) => void) => {
            const timeout = setTimeout(() => {
                setter(true);
                setTimeout(() => {
                    setter(false);
                    scheduleBlink(setter);
                }, 150);
            }, getRandomBlinkInterval());
            return timeout;
        };

        const t1 = scheduleBlink(setIsPurpleBlinking);
        const t2 = scheduleBlink(setIsBlackBlinking);
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, []);

    // Looking at each other animation when typing starts
    useEffect(() => {
        if (isTyping) {
            setIsLookingAtEachOther(true);
            const timer = setTimeout(() => {
                setIsLookingAtEachOther(false);
            }, 800);
            return () => clearTimeout(timer);
        } else {
            setIsLookingAtEachOther(false);
        }
    }, [isTyping]);

    // Purple sneaky peeking animation
    useEffect(() => {
        if (password.length > 0 && showPassword) {
            const schedulePeek = () => {
                const peekInterval = setTimeout(() => {
                    setIsPurplePeeking(true);
                    setTimeout(() => {
                        setIsPurplePeeking(false);
                    }, 800);
                }, Math.random() * 3000 + 2000);
                return peekInterval;
            };

            const firstPeek = schedulePeek();
            return () => clearTimeout(firstPeek);
        } else {
            setIsPurplePeeking(false);
        }
    }, [password, showPassword]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            toast.success('Bem-vindo de volta!', {
                description: 'Login realizado com sucesso.',
            });
            navigate(from, { replace: true });
        } catch (error: any) {
            toast.error('Erro ao entrar', {
                description: error.message || 'Verifique suas credenciais.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-background font-['Public_Sans',sans-serif]">
            {/* Left Content Section - Animation */}
            <div className="relative hidden lg:flex flex-col justify-between bg-black p-12 text-white overflow-hidden">
                <div className="relative z-20">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                        <div className="size-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                            <Sparkles className="size-4 text-[#94785C]" />
                        </div>
                        <span className="tracking-tight text-xl font-bold leading-none">AutoPerf</span>
                    </div>
                </div>

                <div className="relative z-20 flex items-end justify-center h-[500px]">
                    <AnimatedCharacters
                        isTyping={isTyping}
                        passwordLength={password.length}
                        showPassword={showPassword}
                        isPurpleBlinking={isPurpleBlinking}
                        isBlackBlinking={isBlackBlinking}
                        isLookingAtEachOther={isLookingAtEachOther}
                        isPurplePeeking={isPurplePeeking}
                        mouseX={mouseX}
                        mouseY={mouseY}
                    />
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                    <div className="flex flex-col items-center gap-6">
                        <div className="flex items-center gap-4 text-white/90">
                            <div className="h-[1px] w-12 bg-white/20"></div>
                            <h1 className="text-5xl font-black tracking-tight leading-none uppercase">AutoPerf</h1>
                            <div className="h-[1px] w-12 bg-white/20"></div>
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.6em] font-black text-[#94785C]">PERFORMANCE INTELLIGENCE</span>
                    </div>
                </div>
                <div className="relative z-20 flex items-center gap-6">
                    <div className="flex gap-4 ml-auto text-[10px] uppercase tracking-widest font-bold">
                        <Link to="/privacy" className="hover:text-[#94785C] transition-colors">Privacidade</Link>
                        <Link to="/terms" className="hover:text-[#94785C] transition-colors">Termos</Link>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
                <div className="absolute top-1/4 right-1/4 size-64 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-1/4 size-96 bg-white/2 rounded-full blur-3xl" />
            </div>

            {/* Right Login Section */}
            <div className="flex items-center justify-center p-8 bg-background relative selection:bg-[#ec5b13]/30">
                <div className="w-full max-w-[420px]">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center gap-2 text-lg font-semibold mb-12">
                        <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Sparkles className="size-4 text-primary" />
                        </div>
                        <span>AutoPerf</span>
                    </div>

                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="text-4xl font-light tracking-tight mb-2 text-slate-900 dark:text-white">Bem-vindo de volta</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Insira suas credenciais para acessar o painel administrativo</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 pl-1">Identificador de E-mail</Label>
                            <div className="relative">
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="usuario@autogestao.com.br"
                                    value={email}
                                    autoComplete="off"
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setIsTyping(true)}
                                    onBlur={() => setIsTyping(false)}
                                    required
                                    className="h-12 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-slate-400 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <Label htmlFor="password" className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">Chave de Segurança</Label>
                                <button type="button" className="text-[10px] uppercase tracking-widest text-slate-500 font-bold hover:opacity-80 transition-opacity">Esqueceu?</button>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="h-12 pr-10 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-slate-400 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="size-5" />
                                    ) : (
                                        <Eye className="size-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="remember" className="border-slate-300 data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900" />
                                <Label
                                    htmlFor="remember"
                                    className="text-slate-400 cursor-pointer select-none text-xs"
                                >
                                    Manter conectado por 30 dias
                                </Label>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-sm font-bold bg-[#0F172A] hover:bg-[#1e293b] text-white transition-all active:scale-[0.98] shadow-xl shadow-black/5"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Autenticando...</span>
                                </div>
                            ) : (
                                <span>Acessar o Sistema</span>
                            )}
                        </Button>
                    </form>

                    {/* Social Login */}
                    <div className="mt-8 space-y-4">
                        <div className="relative flex items-center">
                            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                            <span className="flex-shrink mx-4 text-[10px] uppercase tracking-[0.3em] text-slate-400 font-light">Acesso Externo</span>
                            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant="outline"
                                className="h-12 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                                type="button"
                            >
                                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.02-2.23 1.74-4.07 3.86-4.14.22 2.48-2.3 4.47-3.86 4.14z"></path></svg>
                                <span className="text-xs font-semibold ml-2">Apple</span>
                            </Button>
                            <Button
                                variant="outline"
                                className="h-12 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                                type="button"
                            >
                                <Mail className="size-4" />
                                <span className="text-xs font-semibold ml-2 text-slate-700 dark:text-slate-300">Google</span>
                            </Button>
                        </div>
                    </div>

                    {/* Sign Up Link */}
                    <div className="text-center text-xs text-slate-400 mt-10 flex flex-col items-center gap-4">

                        <span>&copy; {new Date().getFullYear()} Todos os direitos reservados.</span>
                    </div>
                </div>

                {/* Decorative Bottom Gradient */}
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-500/10 to-transparent opacity-30"></div>
            </div >
        </div >
    );
}
