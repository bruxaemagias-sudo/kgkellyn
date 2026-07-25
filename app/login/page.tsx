'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    // ==========================================
    // MOCK DE AUTENTICAÇÃO — trocar pelo Supabase quando estiver configurado
    // ==========================================
    // Quando o Supabase estiver conectado (ver lib/supabaseClient.ts), troque
    // este bloco por:
    //
    // const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
    // if (error || !data.user) {
    //   setErro('Você ainda não possui acesso ao Portal KG. Entre em contato com nossa equipe.');
    //   setTimeout(() => window.open('https://wa.me/5551996995835', '_blank'), 1500);
    //   return;
    // }
    // router.push('/portal');

    setTimeout(() => {
      setCarregando(false);
      if (email && senha) {
        router.push('/portal');
      } else {
        setErro('Preencha email e senha.');
      }
    }, 600);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F8F6F2] px-6">
      <div className="w-full max-w-md bg-white border border-[#EBEAE6] rounded-3xl p-8 shadow-sm">
        <Link href="/" className="text-[10px] font-bold text-gray-400 hover:text-[#4C1B53] transition-colors">
          ← Voltar ao site
        </Link>
        <div className="mt-6 mb-8 text-center">
          <div className="w-10 h-10 rounded-full bg-[#4C1B53] flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-serif text-xs font-bold">KG</span>
          </div>
          <h1 className="font-serif text-2xl text-[#0D0D0D]">Portal KG</h1>
          <p className="text-xs text-gray-400 mt-1">Entre com seus dados de acesso.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Email</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@empresa.com.br"
                className="w-full pl-10 pr-3.5 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#4C1B53]"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Senha</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#4C1B53]"
                required
              />
            </div>
          </div>

          {erro && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5">{erro}</p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-[#4C1B53] text-white text-sm font-bold py-3.5 rounded-xl hover:bg-[#301E37] transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {carregando ? 'Entrando...' : 'Entrar'} <ArrowRight size={14} />
          </button>
        </form>

        <p className="text-[10px] text-gray-400 text-center mt-6 leading-relaxed">
          O cadastro não é público. Se você ainda não tem acesso, fale com a equipe KG.
        </p>
      </div>
    </main>
  );
}
