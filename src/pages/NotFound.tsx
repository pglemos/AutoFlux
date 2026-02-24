import { Link } from 'react-router-dom'
export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center py-32 text-center">
            <h1 className="text-8xl font-extrabold text-electric-blue mb-4">404</h1>
            <h2 className="text-2xl font-extrabold text-pure-black dark:text-off-white mb-2">Página não encontrada</h2>
            <p className="text-muted-foreground font-bold mb-8">A página que você procura não existe.</p>
            <Link to="/dashboard" className="px-6 py-3 bg-pure-black text-white dark:bg-white dark:text-pure-black font-bold rounded-xl shadow-elevation hover:opacity-90 transition-opacity">Voltar ao Painel</Link>
        </div>
    )
}
