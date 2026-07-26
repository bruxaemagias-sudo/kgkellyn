'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  Instagram,
  Phone,
  Mail,
  ChevronRight,
  Star,
} from 'lucide-react';
import { DIFERENCIAIS, SERVICOS, TIMELINE, ICON_SPARKLES } from '@/lib/data';

export default function Home() {
  const [servicoAtivo, setServicoAtivo] = useState<string | null>(null);
  const SparklesIcon = ICON_SPARKLES;

  interface DepoimentoPublico {
    id: string;
    nome_cliente: string;
    empresa: string | null;
    avaliacao: number;
    texto: string;
  }

  const [depoimentos, setDepoimentos] = useState<DepoimentoPublico[]>([]);

  useEffect(() => {
    supabase
      .from('depoimentos')
      .select('id, nome_cliente, empresa, avaliacao, texto')
      .eq('publicado', true)
      .order('criado_em', { ascending: false })
      .then(({ data }) => {
        if (data) setDepoimentos(data as DepoimentoPublico[]);
      });
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* BOTÃO LOGIN FIXO */}
      <Link
        href="/login"
        className="fixed top-6 right-6 z-50 bg-white/90 backdrop-blur border border-[#4C1B53]/20 text-[#4C1B53] text-xs font-bold px-5 py-2.5 rounded-full shadow-sm hover:bg-[#4C1B53] hover:text-white transition-colors"
      >
        Login
      </Link>

      {/* ========================================== */}
      {/* HERO */}
      {/* ========================================== */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-white to-[#D9D3C7]/20 relative overflow-hidden">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#4C1B53] mb-6">
          Contadora do Futuro
        </p>
        <h1 className="font-serif text-4xl md:text-6xl font-normal text-[#0D0D0D] max-w-3xl leading-tight">
          Contabilidade que entende o seu negócio.
        </h1>
        <p className="mt-6 text-base md:text-lg text-gray-500 max-w-xl">
          Tecnologia, simplicidade e um time de verdade cuidando da burocracia,
          pra você focar em crescer.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <a
            href="https://wa.me/5551996995835"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#4C1B53] text-white text-sm font-bold px-8 py-4 rounded-full hover:bg-[#301E37] transition-colors shadow-lg"
          >
            Quero falar com a contadora
          </a>
          <a
            href="#servicos"
            className="border border-[#0D0D0D]/15 text-[#0D0D0D] text-sm font-bold px-8 py-4 rounded-full hover:bg-[#0D0D0D]/5 transition-colors"
          >
            Conheça nossos serviços
          </a>
          <Link
            href="/login"
            className="text-[#4C1B53] text-sm font-bold px-8 py-4 rounded-full hover:bg-[#4C1B53]/5 transition-colors"
          >
            Já sou cliente
          </Link>
        </div>
      </section>

      {/* ========================================== */}
      {/* QUEM SOMOS */}
      {/* ========================================== */}
      <section className="py-28 px-6 max-w-5xl mx-auto text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#4C1B53] mb-4">
          Quem Somos
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-[#0D0D0D] mb-6">
          Contabilidade de gente, pra gente.
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Acreditamos que cuidar do financeiro de uma empresa não precisa ser
          complicado. Trocamos o "contabilês" por conversas de verdade, e a
          papelada por tecnologia — sempre com alguém disponível do outro lado
          da tela quando você precisar.
        </p>
      </section>

      {/* ========================================== */}
      {/* SERVIÇOS */}
      {/* ========================================== */}
      <section id="servicos" className="py-28 px-6 bg-[#FBF9F6]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#4C1B53] mb-4">
              Serviços
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-[#0D0D0D]">
              Tudo o que sua empresa precisa.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICOS.map((servico) => (
              <div
                key={servico.id}
                onMouseEnter={() => setServicoAtivo(servico.id)}
                onMouseLeave={() => setServicoAtivo(null)}
                className={`bg-white border border-[#EBEAE6] rounded-3xl p-6 shadow-sm transition-all duration-300 cursor-default ${
                  servicoAtivo === servico.id ? 'shadow-lg -translate-y-1 border-[#4C1B53]/30' : ''
                }`}
              >
                <h3 className="font-serif text-lg text-[#0D0D0D] mb-2">{servico.titulo}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{servico.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* COMO FUNCIONA */}
      {/* ========================================== */}
      <section className="py-28 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#4C1B53] mb-4">
            Como Funciona
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-[#0D0D0D]">
            Do diagnóstico ao seu objetivo.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-6 left-[12.5%] right-[12.5%] h-px bg-[#4C1B53]/20" />
          {TIMELINE.map((etapa, idx) => (
            <div key={etapa.id} className="relative text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#4C1B53] text-white flex items-center justify-center font-bold text-sm mb-4 relative z-10">
                {idx + 1}
              </div>
              <h3 className="font-serif text-base text-[#0D0D0D] mb-2">{etapa.titulo}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{etapa.descricao}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================== */}
      {/* DIFERENCIAIS */}
      {/* ========================================== */}
      <section className="py-28 px-6 bg-[#301E37] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D9D3C7] mb-4">
              Diferenciais
            </p>
            <h2 className="font-serif text-3xl md:text-4xl">
              Por que empresas confiam na KG.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DIFERENCIAIS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                    <Icon size={18} />
                  </div>
                  <h3 className="font-serif text-base mb-2">{item.titulo}</h3>
                  <p className="text-xs text-white/60 leading-relaxed">{item.descricao}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* FINANCE PRO */}
      {/* ========================================== */}
      <section className="py-28 px-6 max-w-6xl mx-auto text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#4C1B53] mb-4">
          Software Exclusivo
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-[#0D0D0D] mb-6">
          Conheça o Finance Pro.
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto mb-12 leading-relaxed">
          Dashboards, indicadores e uma visão completa da saúde financeira da
          sua empresa — direto no Portal do Cliente.
        </p>
        <div className="bg-gradient-to-r from-[#4C1B53] to-[#301E37] rounded-3xl p-10 text-white max-w-3xl mx-auto shadow-xl">
          <div className="grid grid-cols-2 gap-6 text-left">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-[10px] text-white/60">Receita do mês</p>
              <p className="text-xl font-bold mt-1">R$ 38.240</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-[10px] text-white/60">Despesas do mês</p>
              <p className="text-xl font-bold mt-1">R$ 10.260</p>
            </div>
          </div>
        </div>
        <a
          href="https://wa.me/5551996995835"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-10 bg-[#4C1B53] text-white text-sm font-bold px-8 py-4 rounded-full hover:bg-[#301E37] transition-colors"
        >
          Conheça o Finance Pro
        </a>
      </section>

      {/* ========================================== */}
      {/* DEPOIMENTOS — sem conteúdo fictício, dados reais do Supabase */}
      {/* ========================================== */}
      <section className="py-28 px-6 max-w-5xl mx-auto text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#4C1B53] mb-4">
          Depoimentos
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-[#0D0D0D] mb-10">
          O que dizem nossos clientes.
        </h2>

        {depoimentos.length === 0 ? (
          <>
            <div className="flex justify-center gap-1 mb-6 text-[#4C1B53]/30">
              <Star size={18} /><Star size={18} /><Star size={18} /><Star size={18} /><Star size={18} />
            </div>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              Em breve você encontrará aqui a opinião de clientes que confiam na KG Contabilidade.
            </p>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {depoimentos.map((d) => (
              <div key={d.id} className="bg-[#FBF9F6] border border-[#EBEAE6] rounded-3xl p-6">
                <div className="flex gap-0.5 mb-3 text-[#4C1B53]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill={i < d.avaliacao ? '#4C1B53' : 'none'} />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">&ldquo;{d.texto}&rdquo;</p>
                <p className="text-xs font-bold text-[#0D0D0D]">{d.nome_cliente}</p>
                {d.empresa && <p className="text-[11px] text-gray-400">{d.empresa}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================== */}
      {/* CTA FINAL */}
      {/* ========================================== */}
      <section className="py-24 px-6 bg-[#4C1B53] text-white text-center">
        <SparklesIcon className="mx-auto mb-6" size={28} />
        <h2 className="font-serif text-3xl md:text-4xl mb-8 max-w-xl mx-auto">
          Vamos organizar o financeiro da sua empresa?
        </h2>
        <a
          href="https://wa.me/5551996995835"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white text-[#4C1B53] text-sm font-bold px-8 py-4 rounded-full hover:bg-[#D9D3C7] transition-colors"
        >
          Agendar reunião <ChevronRight size={16} />
        </a>
      </section>

      {/* ========================================== */}
      {/* RODAPÉ */}
      {/* ========================================== */}
      <footer className="bg-[#0D0D0D] text-white py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
          <div>
            <p className="font-serif text-lg mb-3">KG Contabilidade</p>
            <p className="text-white/50 text-xs leading-relaxed">Contadora do Futuro.</p>
          </div>
          <div className="space-y-2 text-white/70">
            <p className="text-white font-bold text-xs uppercase tracking-wider mb-2">Mapa do site</p>
            <a href="#servicos" className="block hover:text-white">Serviços</a>
            <Link href="/login" className="block hover:text-white">Login</Link>
          </div>
          <div className="space-y-2 text-white/70">
            <p className="text-white font-bold text-xs uppercase tracking-wider mb-2">Contato</p>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white"><Instagram size={14}/> Instagram</a>
            <a href="https://wa.me/5551996995835" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white"><Phone size={14}/> WhatsApp</a>
            <a href="mailto:contato@kgcontabilidade.com.br" className="flex items-center gap-2 hover:text-white"><Mail size={14}/> Email</a>
          </div>
          <div className="space-y-2 text-white/70">
            <p className="text-white font-bold text-xs uppercase tracking-wider mb-2">Legal</p>
            <a href="#" className="block hover:text-white">LGPD</a>
            <a href="#" className="block hover:text-white">Política de Privacidade</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
