'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Wallet,
  Settings,
  MessageCircle,
  Bell,
  LogOut,
  Sparkles,
  ShieldCheck,
  Calendar as CalendarIcon,
  ArrowRight,
  Lightbulb,
  PiggyBank,
  BarChart3,
  Target,
  Building2,
} from 'lucide-react';

// ==========================================
// MOCK DE DADOS DINÂMICOS
// ==========================================
const MOCK_CLIENT = {
  name: "Lumina Studio Criativo Ltda.",
  cnpj: "12.345.678/0001-90",
  plano: "Premium Finance Pro",
  statusEscudo: "sucesso",
  marcoConquista: "Crescimento acima de 20% no mês",
  analiseIA: "Este mês foi ótimo! Você ganhou mais do que no mês passado e conseguiu segurar bem os gastos na empresa. Sobrou um bom dinheiro para engordar o seu cofrinho e os impostos já estão todos em dia. Parabéns!"
};

const MOCK_TAREFAS = [
  { dia: "05", titulo: "Pagar pró-labore do sócio" },
  { dia: "10", titulo: "Pagar a contabilidade" },
  { dia: "10", titulo: "Enviar documentos solicitados pela KG" },
  { dia: "20", titulo: "Pagar DAS / INSS / IRPF" }
];

const MOCK_RADAR = {
  receitaMes: 38240,
  receitaAno: 221800,
  cofrinhoAno: 28600,
  bancoMes: 42350,
  impostosMes: 2410,
  impostosAno: 14880,
  despesasAno: 118400,
  nfEmitidasAno: 86,
  contasReceber: 12400,
  contasPagar: 7850,
  proLaboreAno: 6800,
  lucroAno: 16820
};

const MOCK_RANKINGS = {
  mes: {
    clientes: [
      { nome: "Norte Educação", valor: 9200 },
      { nome: "Aura Tech", valor: 7800 },
      { nome: "Studio Lírio", valor: 6400 },
      { nome: "Clínica Serena", valor: 4800 },
      { nome: "Ateliê Uno", valor: 3600 }
    ],
    despesas: [
      { nome: "Equipe e parceiros", valor: 8200 },
      { nome: "Software", valor: 2450 },
      { nome: "Marketing", valor: 1900 },
      { nome: "Infraestrutura", valor: 1320 },
      { nome: "Serviços", valor: 980 }
    ]
  },
  ano: {
    clientes: [
      { nome: "Norte Educação (Anual)", valor: 110400 },
      { nome: "Aura Tech (Anual)", valor: 93600 },
      { nome: "Studio Lírio (Anual)", valor: 76800 },
      { nome: "Clínica Serena (Anual)", valor: 57600 },
      { nome: "Ateliê Uno (Anual)", valor: 43200 }
    ],
    despesas: [
      { nome: "Equipe e parceiros (Anual)", valor: 98400 },
      { nome: "Software (Anual)", valor: 29400 },
      { nome: "Marketing (Anual)", valor: 22800 },
      { nome: "Infraestrutura (Anual)", valor: 158400 },
      { nome: "Serviços (Anual)", valor: 11760 }
    ]
  }
};

// Função auxiliar para pegar as iniciais do nome
const getIniciais = (nome: string) => {
  if (!nome) return '';
  const nomes = nome.trim().split(' ');
  if (nomes.length === 1) return nomes[0].charAt(0).toUpperCase();
  return (nomes[0].charAt(0) + nomes[1].charAt(0)).toUpperCase();
};

export default function PortalKG() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();

  // ==========================================
  // 1) TODOS OS ESTADOS PRIMEIRO (ordem importa!)
  // ==========================================
  const [nomeUsuario, setNomeUsuario] = useState('Marina Silva');

  const [metasMeses, setMetasMeses] = useState({
    janeiro: 0, fevereiro: 0, marco: 0, abril: 0, maio: 0, junho: 0,
    julho: 45000, agosto: 0, setembro: 0, outubro: 0, novembro: 0, dezembro: 0
  });

  const [mesReferencia, setMesReferencia] = useState('Junho 2026');

  const [saldosMeses, setSaldosMeses] = useState({
    janeiro: 0, fevereiro: 0, marco: 0, abril: 0, maio: 0, junho: 0,
    julho: 42350, agosto: 0, setembro: 0, outubro: 0, novembro: 0, dezembro: 0
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPendingTransition, setIsPendingTransition] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  // Estados para controlar o saldo e o histórico de forma dinâmica
  const [saldoCofrinho, setSaldoCofrinho] = useState(28600); // Valor inicial do mock
  const [historicoCofrinho, setHistoricoCofrinho] = useState<Array<{
    id: number;
    tipo: 'entrada' | 'saida';
    valor: number;
    data: string;
    observacao: string;
  }>>([
    { id: 1, tipo: 'entrada', valor: 5000, data: '2026-07-20', observacao: 'Aporte inicial do mês' },
    { id: 2, tipo: 'saida', valor: 1200, data: '2026-07-22', observacao: 'Resgate para capital de giro' },
  ]);

  // Estados para os inputs dos modais
  const [modalValor, setModalValor] = useState('');
  const [modalData, setModalData] = useState(new Date().toISOString().split('T')[0]); // Data de hoje como padrão
  const [modalObs, setModalObs] = useState('');

  const [filtroDetalhamento, setFiltroDetalhamento] = useState<'mes' | 'ano'>('mes');
  const [filtroGrafico, setFiltroGrafico] = useState<'mes' | 'ano'>('ano');

  // ==========================================
  // 2) VALORES DERIVADOS (agora que todos os estados já existem)
  // ==========================================

  // 1. Descobre o mês atual no calendário (ex: 7 para Julho, 8 para Agosto) e o ano
  const dataAtual = new Date();
  const numeroMesAtual = dataAtual.getMonth(); // 0 = Janeiro, 1 = Fevereiro, ..., 6 = Julho

  // Mapeamento dos meses para bater com as chaves do seu useState
  const nomesMesesChaves = [
    'janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];
  const chaveMesAtual = nomesMesesChaves[numeroMesAtual] as keyof typeof metasMeses;

  // String do mês formatada para filtrar o histórico (ex: "-07-" se for julho, "-08-" se for agosto)
  const filtroMesString = `-${String(numeroMesAtual + 1).padStart(2, '0')}-`;

  // 2. Filtra as entradas do cofrinho que aconteceram NO MÊS CORRENTE e soma
  const totalGuardadoMesAtual = historicoCofrinho
    .filter(item => item.tipo === 'entrada' && item.data.includes(filtroMesString))
    .reduce((sum, item) => sum + item.valor, 0);

  // 3. Busca a meta do mês corrente cadastrada nas configurações
  const metaFaturamentoMesAtual = metasMeses[chaveMesAtual] || 0;

  // 4. Calcula a porcentagem da barra de progresso do mês atual
  const porcentagemCofrinho = metaFaturamentoMesAtual > 0
    ? Math.min(Math.round((totalGuardadoMesAtual / metaFaturamentoMesAtual) * 100), 100)
    : 0;

  // 1. Soma dinamicamente TODAS as metas mensais que o usuário preencheu na configuração
  const metaAnoTotal = Object.values(metasMeses).reduce((a, b) => a + b, 0);

  // 2. Soma o ano INTEIRO do cofrinho (repare que aqui NÃO filtramos por mês, pegamos tudo!)
  const totalRealAno = historicoCofrinho
    .filter(item => item.tipo === 'entrada') // Pega janeiro, fevereiro, julho... tudo!
    .reduce((sum, item) => sum + item.valor, 0);

  // 3. Calcula a porcentagem total do ano
  const porcentagemAno = metaAnoTotal > 0
    ? Math.min(Math.round((totalRealAno / metaAnoTotal) * 100), 100)
    : 0;

  const temFinancePro = MOCK_CLIENT.plano === "Premium Finance Pro";
  const dadosRanking = MOCK_RANKINGS[filtroDetalhamento];

  const fMoeda = (v: number) => 'R$ ' + v.toLocaleString('pt-BR', { maximumFractionDigits: 0 });

  const handleTabChange = (tabId: string) => {
    setIsPendingTransition(true);
    setTimeout(() => {
      setActiveTab(tabId);
      setIsPendingTransition(false);
    }, 150);
  };

  const handleConfirmarAdicionar = () => {
    const valorNum = parseFloat(modalValor.toString().replace(',', '.'));
    if (isNaN(valorNum) || valorNum <= 0) return;

    setSaldoCofrinho(prev => prev + valorNum);
    setHistoricoCofrinho(prev => [
      {
        id: Date.now(),
        tipo: 'entrada',
        valor: valorNum,
        data: modalData,
        observacao: modalObs || 'Aporte manual'
      },
      ...prev
    ]);

    // Limpar e fechar
    setModalValor('');
    setModalObs('');
    setShowAddModal(false);
  };

  const handleConfirmarRetirar = () => {
    const valorNum = parseFloat(modalValor.toString().replace(',', '.'));
    if (isNaN(valorNum) || valorNum <= 0) return;

    setSaldoCofrinho(prev => prev - valorNum);
    setHistoricoCofrinho(prev => [
      {
        id: Date.now(),
        tipo: 'saida',
        valor: valorNum,
        data: modalData,
        observacao: modalObs || 'Resgate manual'
      },
      ...prev
    ]);

    // Limpar e fechar
    setModalValor('');
    setModalObs('');
    setShowRemoveModal(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#2C2C2C] font-sans flex antialiased">

      {/* SIDEBAR COMPLETA */}
      <div className={`${isSidebarOpen ? 'w-64 opacity-100 p-6' : 'w-0 opacity-0 pointer-events-none overflow-hidden p-0 border-r-0'} bg-[#FDFBF7] border-r border-[#EBEAE6] min-h-screen flex flex-col justify-between font-sans transition-all duration-300 ease-in-out`}>

        <div className="space-y-8">
          {/* LOGO E TEXTO */}
          <div className="flex items-center gap-3 pl-1 shrink-0">
            <div className={`w-8 h-8 rounded-full bg-[#211424] flex items-center justify-center shadow-sm shrink-0 transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
              <span className="text-white font-serif text-xs font-bold tracking-tighter">KG</span>
            </div>
            <div className={`flex flex-col leading-tight transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
              <span className="font-serif text-[13px] font-bold text-gray-900 tracking-tight">KG Contabilidade</span>
              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Contadora do Futuro</span>
            </div>
          </div>

          {/* ITENS DO MENU */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-[#4C1B53] text-white shadow-sm font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <LayoutDashboard size={16} />
              Visão geral
            </button>

            {/* COFRINHO COM ÍCONE DE PORQUINHO */}
            <button
              onClick={() => setActiveTab('cofrinho')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'cofrinho'
                  ? 'bg-[#4C1B53] text-white shadow-sm font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <PiggyBank size={16} />
              Cofrinho
            </button>

            {/* FINANCE PRO COM ÍCONE DE GRÁFICO GERENCIAL */}
            <button
              onClick={() => setActiveTab('financepro')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'financepro'
                  ? 'bg-[#4C1B53] text-white shadow-sm font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <BarChart3 size={16} />
              Finance Pro
            </button>

            <button
              onClick={() => setActiveTab('configuracoes')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'configuracoes'
                  ? 'bg-[#4C1B53] text-white shadow-sm font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Settings size={16} />
              Configurações
            </button>
          </nav>
        </div>

        {/* BOTÃO SAIR / RODAPÉ DA SIDEBAR */}
        <div className="space-y-4">
          {/* CARD FALE CONOSCO */}
          <div className="bg-[#F4F0F6] border border-[#4C1B53]/5 rounded-2xl p-4 space-y-2">
            <div className="text-[#4C1B53]"><MessageCircle size={16} /></div>
            <p className="text-[10px] font-bold text-gray-900">Precisa da KG?</p>
            <p className="text-[10px] text-gray-500 leading-normal">Fale direto com a nossa equipe.</p>
            <a
              href="https://wa.me/5551996995835"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-bold text-[#4C1B53] hover:underline flex items-center gap-0.5"
            >
              Abrir WhatsApp ›
            </a>
          </div>

          <button
            onClick={() => {
              alert("Sessão encerrada com sucesso!");
              setActiveTab('dashboard');
              router.push('/');
            }}
            className="w-full flex items-center gap-3 px-4 py-2 text-xs font-medium text-gray-400 hover:text-red-600 transition-colors"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>

      </div>

      {/* ==========================================
          CONTEÚDO PRINCIPAL RENDERIZADO POR TAB
      ========================================== */}
      <main className="flex-1 overflow-y-auto px-12 py-8 space-y-10 max-w-[1400px] mx-auto w-full">

        {/* Topbar compartilhada */}
        <header className="flex justify-between items-center border-b border-[#EBEAE6] pb-4">
          <div className="flex items-center gap-4">
            {/* BOTÃO HAMBÚRGUER */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors shadow-sm flex items-center justify-center"
              aria-label="Toggle Sidebar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="text-xs font-medium text-gray-400">{MOCK_CLIENT.name} · {MOCK_CLIENT.cnpj}</span>
          </div>

          <div className="flex items-center gap-4">
            {/* BOTÃO DE NOTIFICAÇÃO */}
            <button className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 relative">
              <Bell size={16} className="text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#4C1B53] rounded-full"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-bold text-gray-900">{nomeUsuario}</p>
                <p className="text-[10px] text-gray-400 font-medium">Cliente KG</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#4C1B53] text-white flex items-center justify-center text-xs font-bold">{getIniciais(nomeUsuario)}</div>
            </div>
          </div>
        </header>

        {/* ==========================================
            ABA 1: DASHBOARD / VISÃO GERAL
        ========================================== */}
        {activeTab === 'dashboard' && (
          <>
            <div className="flex justify-between items-end flex-wrap gap-4">
              <div>
                <p className="text-[10px] font-bold text-[#4C1B53] uppercase tracking-widest mb-1.5">Visão da Empresa</p>
                <h1 className="text-3xl font-serif font-normal text-gray-900 tracking-tight leading-snug">Olá, {nomeUsuario}. Vamos aos números?</h1>
              </div>
              <span className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-full text-xs font-medium shadow-sm">
                Referência · {mesReferencia}
              </span>
            </div>

            <section className="bg-gradient-to-r from-[#4C1B53] to-[#6A2B73] text-white rounded-3xl p-8 shadow-lg flex flex-col lg:flex-row justify-between items-center gap-8 relative overflow-hidden">
              <div className="space-y-2 max-w-xs w-full">
                <p className="text-[10px] font-bold uppercase tracking-wider text-purple-200">Metas · {mesReferencia}</p>
                <h2 className="text-2xl font-serif font-normal tracking-tight">Seu mês em movimento.</h2>
                <p className="text-xs text-purple-100 opacity-80">Acompanhe o progresso e ajuste sua rota.</p>
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="opacity-90">Meta do mês</span>
                    <span className="font-bold">{porcentagemCofrinho}%</span>
                  </div>
                  <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#EAE2D5] h-full rounded-full" style={{ width: `${porcentagemCofrinho}%` }}></div>
                  </div>
                  <p className="text-[11px] text-purple-100/80"><span>{porcentagemCofrinho}% da meta de {fMoeda(metaFaturamentoMesAtual)}</span></p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="opacity-90">Meta do ano</span>
                    <span className="font-bold">{porcentagemAno}%</span>
                  </div>
                  <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#EAE2D5] h-full rounded-full" style={{ width: `${porcentagemAno}%` }}></div>
                  </div>
                  <p className="text-[11px] text-purple-100/80">{fMoeda(totalRealAno)} de {fMoeda(metaAnoTotal)}</p>
                </div>
              </div>
              <button
                onClick={() => handleTabChange('configuracoes')}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-xs px-6 py-3 rounded-full transition-all whitespace-nowrap"
              >
                Configurar metas
              </button>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-white border border-[#EBEAE6] rounded-3xl p-6 shadow-sm lg:col-span-2 grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center gap-2 text-[#4C1B53]">
                    <CalendarIcon size={18} />
                    <h3 className="font-serif text-base font-normal text-gray-900">O que preciso fazer este mês de julho?</h3>
                  </div>
                  <p className="text-xs text-gray-400">Agenda fiscal e financeira</p>
                  <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center text-[10px] font-bold text-gray-400 pt-2">
                    <span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
                    <span className="text-transparent">0</span><span className="text-transparent">0</span><span className="text-transparent">0</span><span>1</span><span>2</span><span>3</span><span>4</span>
                    <span className="bg-[#4C1B53] text-white rounded-full w-5 h-5 flex items-center justify-center mx-auto">5</span><span>6</span><span>7</span><span>8</span><span>9</span><span className="bg-[#4C1B53] text-white rounded-full w-5 h-5 flex items-center justify-center mx-auto">10</span><span>11</span>
                    <span>12</span><span>13</span><span>14</span><span>15</span><span>16</span><span>17</span><span>18</span>
                    <span>19</span><span className="bg-[#4C1B53] text-white rounded-full w-5 h-5 flex items-center justify-center mx-auto">20</span><span>21</span><span>22</span><span>23</span><span>24</span><span>25</span>
                    <span>26</span><span>27</span><span>28</span><span>29</span><span>30</span><span>31</span>
                  </div>
                </div>
                <div className="md:col-span-3 space-y-2.5 flex flex-col justify-center">
                  {MOCK_TAREFAS.map((tarefa, i) => (
                    <div key={i} className="bg-[#FBF9F6] p-3 rounded-xl flex items-center gap-4 border border-[#F4EFEA]">
                      <span className="font-bold text-xs text-[#4C1B53] bg-white border border-gray-100 px-2.5 py-1 rounded-lg shadow-sm">{tarefa.dia}</span>
                      <span className="text-xs font-medium text-gray-700">{tarefa.titulo}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-[#EBEAE6] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                <div className="h-full flex flex-col justify-between">
                  <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center border border-green-100"><ShieldCheck size={20} /></div>
                  <div className="space-y-3 my-4">
                    <h3 className="font-serif text-base font-normal text-gray-900">Sua empresa está protegida.</h3>
                    <div className="text-xs text-gray-500 space-y-1.5">
                      <p>✓ Impostos enviados</p><p>✓ Obrigações entregues</p><p>✓ Guias emitidas</p><p>✓ Arquivos organizados</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400">Pode focar no seu negócio. Nós cuidamos da burocracia.</p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Radar KG</p>
                  <h3 className="text-xl font-serif text-gray-900">Os números que merecem sua atenção.</h3>
                </div>
                <span className="text-xs text-gray-400 font-medium">Referência · {mesReferencia}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* LINHA 1 */}
                <div className="bg-white border border-[#EBEAE6] rounded-2xl p-5 shadow-sm relative"><span className="absolute top-4 right-4 text-[9px] font-bold text-gray-300 tracking-wider uppercase">Destaque</span><p className="text-[11px] text-gray-400 font-medium">Receita do mês</p><h4 className="text-xl font-bold font-sans tracking-wide text-gray-900 mt-2">{fMoeda(MOCK_RADAR.receitaMes)}</h4></div>
                <div className="bg-white border border-[#EBEAE6] rounded-2xl p-5 shadow-sm relative"><span className="absolute top-4 right-4 text-[9px] font-bold text-gray-300 tracking-wider uppercase">Destaque</span><p className="text-[11px] text-gray-400 font-medium">Receita no ano</p><h4 className="text-xl font-bold font-sans tracking-wide text-gray-900 mt-2">{fMoeda(MOCK_RADAR.receitaAno)}</h4></div>
                <div className="bg-white border border-[#EBEAE6] rounded-2xl p-5 shadow-sm relative"><span className="absolute top-4 right-4 text-[9px] font-bold text-gray-300 tracking-wider uppercase">Destaque</span><p className="text-[11px] text-gray-400 font-medium">Total cofrinho ano</p><h4 className="text-xl font-bold font-sans tracking-wide text-gray-900 mt-2">{fMoeda(MOCK_RADAR.cofrinhoAno)}</h4></div>
                <div className="bg-white border border-[#EBEAE6] rounded-2xl p-5 shadow-sm relative"><span className="absolute top-4 right-4 text-[9px] font-bold text-gray-300 tracking-wider uppercase">Radar</span><p className="text-[11px] text-gray-400 font-medium">Total banco mês</p><h4 className="text-xl font-bold font-sans tracking-wide text-gray-900 mt-2">{fMoeda(MOCK_RADAR.bancoMes)}</h4></div>

                {/* LINHA 2 */}
                <div className="bg-white border border-[#EBEAE6] rounded-2xl p-5 shadow-sm relative"><span className="absolute top-4 right-4 text-[9px] font-bold text-gray-300 tracking-wider uppercase">Radar</span><p className="text-[11px] text-gray-400 font-medium">Impostos no mês</p><h4 className="text-xl font-bold font-sans tracking-wide text-gray-900 mt-2">{fMoeda(MOCK_RADAR.impostosMes)}</h4></div>
                <div className="bg-white border border-[#EBEAE6] rounded-2xl p-5 shadow-sm relative"><span className="absolute top-4 right-4 text-[9px] font-bold text-gray-300 tracking-wider uppercase">Radar</span><p className="text-[11px] text-gray-400 font-medium">Impostos no ano</p><h4 className="text-xl font-bold font-sans tracking-wide text-gray-900 mt-2">{fMoeda(MOCK_RADAR.impostosAno)}</h4></div>
                <div className="bg-white border border-[#EBEAE6] rounded-2xl p-5 shadow-sm relative"><span className="absolute top-4 right-4 text-[9px] font-bold text-gray-300 tracking-wider uppercase">Radar</span><p className="text-[11px] text-gray-400 font-medium">Despesas no ano</p><h4 className="text-xl font-bold font-sans tracking-wide text-gray-900 mt-2">{fMoeda(MOCK_RADAR.despesasAno)}</h4></div>
                <div className="bg-white border border-[#EBEAE6] rounded-2xl p-5 shadow-sm relative"><span className="absolute top-4 right-4 text-[9px] font-bold text-gray-300 tracking-wider uppercase">Radar</span><p className="text-[11px] text-gray-400 font-medium">NF emitidas ano</p><h4 className="text-xl font-bold font-sans tracking-wide text-gray-900 mt-2">{MOCK_RADAR.nfEmitidasAno}</h4></div>

                {/* LINHA 3 */}
                <div className="bg-white border border-[#EBEAE6] rounded-2xl p-5 shadow-sm relative">
                  <span className="absolute top-4 right-4 text-[9px] font-bold text-gray-300 tracking-wider uppercase">Radar</span>
                  <p className="text-[11px] text-gray-400 font-medium">Clientes a receber</p>
                  <h4 className="text-xl font-bold font-sans tracking-wide text-gray-900 mt-2">{fMoeda(MOCK_RADAR.contasReceber)}</h4>
                </div>
                <div className="bg-white border border-[#EBEAE6] rounded-2xl p-5 shadow-sm relative">
                  <span className="absolute top-4 right-4 text-[9px] font-bold text-gray-300 tracking-wider uppercase">Radar</span>
                  <p className="text-[11px] text-gray-400 font-medium">Contas a pagar</p>
                  <h4 className="text-xl font-bold font-sans tracking-wide text-gray-900 mt-2">{fMoeda(MOCK_RADAR.contasPagar)}</h4>
                </div>
                <div className="bg-white border border-[#EBEAE6] rounded-2xl p-5 shadow-sm relative">
                  <span className="absolute top-4 right-4 text-[9px] font-bold text-gray-300 tracking-wider uppercase">Radar</span>
                  <p className="text-[11px] text-gray-400 font-medium">Total pró-labore ano</p>
                  <h4 className="text-xl font-bold font-sans tracking-wide text-gray-900 mt-2">{fMoeda(MOCK_RADAR.proLaboreAno)}</h4>
                </div>
                <div className="bg-white border border-[#EBEAE6] rounded-2xl p-5 shadow-sm relative">
                  <span className="absolute top-4 right-4 text-[9px] font-bold text-gray-300 tracking-wider uppercase">Radar</span>
                  <p className="text-[11px] text-gray-400 font-medium">Lucro Ano</p>
                  <h4 className="text-xl font-bold font-sans tracking-wide text-gray-900 mt-2">{fMoeda(MOCK_RADAR.lucroAno)}</h4>
                </div>
              </div>

              <div className="bg-[#F4F0F6] border border-[#4C1B53]/5 rounded-2xl p-5 flex items-start gap-4">
                <div className="p-2 bg-[#4C1B53] text-white rounded-xl shadow-sm"><Sparkles size={16} /></div>
                <div>
                  <h5 className="text-xs font-bold text-gray-900 mb-1">Análise inteligente KG</h5>
                  <p className="text-xs text-gray-600 leading-relaxed">{MOCK_CLIENT.analiseIA}</p>
                </div>
              </div>
            </section>

            {/* MAIORES CLIENTES E DESPESAS */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-serif font-normal text-gray-900">Detalhamento Financeiro</h3>
                <div className="bg-[#EBEAE5] p-1 rounded-xl flex gap-1 shadow-inner border border-gray-300/40">
                  <button onClick={() => setFiltroDetalhamento('mes')} className={`text-xs px-4 py-1.5 rounded-lg font-medium transition-all ${filtroDetalhamento === 'mes' ? 'bg-white text-[#4C1B53] shadow-sm' : 'text-gray-500'}`}>Mês Atual</button>
                  <button onClick={() => setFiltroDetalhamento('ano')} className={`text-xs px-4 py-1.5 rounded-lg font-medium transition-all ${filtroDetalhamento === 'ano' ? 'bg-white text-[#4C1B53] shadow-sm' : 'text-gray-500'}`}>Acumulado do Ano</button>
                </div>
              </div>

              {(() => {
                const clientesOrdenados = [...dadosRanking.clientes].sort((a, b) => b.valor - a.valor);
                const despesasOrdenadas = [...dadosRanking.despesas].sort((a, b) => b.valor - a.valor);
                const maxClientesItem = clientesOrdenados[0]?.valor || 1;
                const maxDespesasItem = despesasOrdenadas[0]?.valor || 1;

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white border border-[#EBEAE6] rounded-3xl p-6 shadow-sm space-y-4 max-w-full overflow-hidden">
                      <h4 className="font-serif text-sm font-normal text-gray-800">5 maiores clientes</h4>
                      <div className="space-y-3.5">
                        {clientesOrdenados.map((item, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-xs font-medium">
                              <span className="text-gray-400 mr-2">0{idx + 1} <span className="text-gray-700 font-normal">{item.nome}</span></span>
                              <span className="font-bold font-sans text-gray-900">{fMoeda(item.valor)}</span>
                            </div>
                            <div className="w-full bg-gray-50 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-[#4C1B53] h-full rounded-full" style={{ width: `${(item.valor / maxClientesItem) * 100}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white border border-[#EBEAE6] rounded-3xl p-6 shadow-sm space-y-4 max-w-full overflow-hidden">
                      <h4 className="font-serif text-sm font-normal text-gray-800">5 maiores despesas</h4>
                      <div className="space-y-3.5">
                        {despesasOrdenadas.map((item, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-xs font-medium">
                              <span className="text-gray-400 mr-2">0{idx + 1} <span className="text-gray-700 font-normal">{item.nome}</span></span>
                              <span className="font-bold font-sans text-gray-900">{fMoeda(item.valor)}</span>
                            </div>
                            <div className="w-full bg-gray-50 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-[#C19A5B] h-full rounded-full" style={{ width: `${(item.valor / maxDespesasItem) * 100}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </section>

            <section className="bg-white border border-[#EBEAE6] rounded-3xl p-6 shadow-sm space-y-6 max-w-full overflow-hidden">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <p className="text-[10px] font-bold text-[#4C1B53] uppercase tracking-wider">Evolução da empresa</p>
                  <h4 className="text-base font-serif font-normal text-gray-900 mt-1">Receita x despesas em 2026</h4>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                    <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#4C1B53]"></span> Receita</div>
                    <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#C19A5B]"></span> Despesas</div>
                  </div>
                  <div className="bg-[#EBEAE5] p-1 rounded-xl flex gap-1 shadow-inner border border-gray-300/40">
                    <button onClick={() => setFiltroGrafico('mes')} className={`text-xs px-3 py-1 rounded-lg font-medium transition-all ${filtroGrafico === 'mes' ? 'bg-white text-[#4C1B53] shadow-sm' : 'text-gray-500'}`}>Mês</button>
                    <button onClick={() => setFiltroGrafico('ano')} className={`text-xs px-3 py-1 rounded-lg font-medium transition-all ${filtroGrafico === 'ano' ? 'bg-white text-[#4C1B53] shadow-sm' : 'text-gray-500'}`}>Ano</button>
                  </div>
                </div>
              </div>

              <div className="relative w-full pt-4 min-h-[160px] flex flex-col justify-between">
                {filtroGrafico === 'ano' ? (
                  <>
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 py-2">
                      <div className="border-b border-gray-300 w-full"></div>
                      <div className="border-b border-gray-300 w-full"></div>
                      <div className="border-b border-gray-300 w-full"></div>
                    </div>
                    <svg className="w-full h-28 overflow-visible" viewBox="0 0 600 100" preserveAspectRatio="none">
                      <path d="M 0 60 Q 150 45 300 55 T 600 25" fill="none" stroke="#4C1B53" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M 0 80 Q 150 75 300 70 T 600 55" fill="none" stroke="#C19A5B" strokeWidth="1.5" strokeDasharray="4,4" strokeLinecap="round" />
                    </svg>
                    <div className="flex justify-between text-xs font-medium text-gray-400 pt-3 border-t border-gray-100/60">
                      <span>Jan</span><span>Fev</span><span>Mar</span><span>Abr</span><span>Mai</span><span>Jun</span>
                    </div>
                  </>
                ) : (
                  <div className="h-32 flex items-end justify-center gap-12 pb-2">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 bg-[#4C1B53] rounded-t-xl transition-all shadow-md" style={{ height: '95px' }}></div>
                      <span className="text-xs font-bold text-gray-700">Receita ({fMoeda(MOCK_RADAR.receitaMes)})</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 bg-[#C19A5B] rounded-t-xl transition-all shadow-md" style={{ height: '55px' }}></div>
                      <span className="text-xs font-bold text-gray-700">Despesas ({fMoeda(MOCK_RADAR.impostosMes + 7850)})</span>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {/* ==========================================
            ABA 2: COFRINHO INTELIGENTE
        ========================================== */}
        {activeTab === 'cofrinho' && (
          <div className="space-y-6">
            {/* TÍTULO E SUBTÍTULO */}
            <div>
              <p className="text-[9px] font-bold text-[#4C1B53] uppercase tracking-widest">Cofrinho</p>
              <h3 className="text-xl font-serif text-gray-900 mt-1">Transforme intenção em reserva.</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-2xl leading-relaxed">
                Defina uma meta, registre entradas e retiradas e acompanhe o valor separado para o futuro da empresa.
              </p>
            </div>

            {/* SEÇÃO PRINCIPAL: CARDS LADO A LADO */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

              {/* CARD ESQUERDO: TOTAL GUARDADO X META */}
              <div className="lg:col-span-7 bg-gradient-to-r from-[#4C1B53] to-[#311136] rounded-3xl p-8 text-white flex flex-col justify-between shadow-sm relative min-h-[220px]">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mb-6">
                    <Wallet size={18} className="text-white" />
                  </div>
                  <p className="text-[11px] text-white/70 font-medium">Total guardado</p>
                  <h4 className="text-3xl font-bold font-sans tracking-wide mt-2">
                    {fMoeda(totalGuardadoMesAtual)}
                  </h4>
                </div>

                <div className="mt-6 space-y-2">
                  {/* BARRA DE PROGRESSO */}
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#EBEAE6] h-full rounded-full transition-all duration-500"
                      style={{ width: `${porcentagemCofrinho}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-white/70">
                    <span>{porcentagemCofrinho}% da meta de {fMoeda(metaFaturamentoMesAtual)}</span>
                    <button
                      onClick={() => handleTabChange('configuracoes')}
                      className="hover:underline font-bold flex items-center gap-1 text-white"
                    >
                      Configurar metas <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>

              {/* CARD DIREITO: MOVIMENTAR COFRINHO */}
              <div className="lg:col-span-5 bg-white border border-[#EBEAE6] rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[220px]">
                <div>
                  <h4 className="text-base font-serif text-gray-900 mb-4">Movimentar cofrinho</h4>

                  <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                    Movimente o saldo do seu cofrinho de forma simples e rápida.
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="w-full bg-[#4C1B53] text-white text-xs font-bold py-3 rounded-xl hover:bg-[#3d1543] transition-colors shadow-sm"
                    >
                      Adicionar
                    </button>
                    <button
                      onClick={() => setShowRemoveModal(true)}
                      className="w-full bg-white border border-gray-200 text-gray-700 text-xs font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Retirar
                    </button>
                  </div>
                </div>

                <p className="text-[9px] text-gray-400 leading-normal mt-4">
                  O cofrinho é um controle informativo. Não representa rendimento ou saldo bancário em tempo real. Para manter o valor fiel ao banco, favor manter atualizado.
                </p>
              </div>
            </div>

            {/* HISTÓRICO DA MOVIMENTAÇÃO */}
            <div className="bg-white border border-[#EBEAE6] rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h4 className="text-base font-serif text-gray-900">Histórico da movimentação</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      <th className="py-3 px-4">Data</th>
                      <th className="py-3 px-4">Movimento</th>
                      <th className="py-3 px-4">Valor</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Observação</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs text-gray-600 divide-y divide-gray-50 font-sans">
                    {historicoCofrinho.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/50">
                        {/* DATA */}
                        <td className="py-3 px-4">
                          {new Date(item.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                        </td>

                        {/* MOVIMENTO */}
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-md font-medium text-[11px] ${
                            item.tipo === 'entrada'
                              ? 'text-green-600 bg-green-50'
                              : 'text-red-600 bg-red-50'
                          }`}>
                            {item.tipo === 'entrada' ? 'Adicionado' : 'Retirado'}
                          </span>
                        </td>

                        {/* VALOR */}
                        <td className={`py-3 px-4 font-semibold ${item.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                          {item.tipo === 'entrada' ? '+' : '-'} {fMoeda(item.valor)}
                        </td>

                        {/* TOTAL */}
                        <td className="py-3 px-4 font-medium text-gray-900">
                          {fMoeda(saldoCofrinho)}
                        </td>

                        {/* OBSERVAÇÃO */}
                        <td className="py-3 px-4 text-gray-400 italic max-w-[200px] truncate" title={item.observacao}>
                          {item.observacao}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CARD DE IDEIAS DA IA */}
            <div className="bg-[#F4F0F6] border border-[#4C1B53]/5 rounded-2xl p-5 flex items-start gap-4">
              <div className="p-2 bg-[#4C1B53] text-white rounded-xl shadow-sm"><Lightbulb size={16} /></div>
              <div>
                <h5 className="text-xs font-bold text-gray-900 mb-1">💡 Ideias para o seu Cofrinho</h5>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Olhando o lucro acumulado da sua empresa este ano, você tem uma boa folga financeira. Aproveitar este momento para guardar um pouco mais de dinheiro não vai fazer falta no pagamento das suas contas do dia a dia e ainda vai te deixar 3 meses mais perto de alcançar a sua meta final.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            ABA 3: CONFIGURAÇÕES DA EMPRESA
        ========================================== */}
        {activeTab === 'configuracoes' && (
          <div className="space-y-8">
            <div>
              <p className="text-[9px] font-bold text-[#4C1B53] uppercase tracking-widest">Gerenciamento</p>
              <h3 className="text-xl font-serif text-gray-900 mt-1">Configurações do Portal</h3>
            </div>

            {/* BLOCO 1: DADOS GERENCIAIS E PREFERÊNCIAS DE EXIBIÇÃO */}
            <div className="bg-white border border-[#EBEAE6] rounded-3xl p-6 shadow-sm space-y-6">
              <div>
                <h4 className="text-xs font-bold text-gray-900">Dados da Empresa</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">Informações regulatórias registradas na KG.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50/60 p-3.5 rounded-xl border border-gray-100">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Razão Social</label>
                  <span className="text-xs font-medium text-gray-800 block truncate">{MOCK_CLIENT.name}</span>
                </div>

                <div className="bg-gray-50/60 p-3.5 rounded-xl border border-gray-100">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">CNPJ</label>
                  <span className="text-xs font-medium text-gray-800 block">{MOCK_CLIENT.cnpj}</span>
                </div>

                <div className="bg-gray-50/50 p-3.5 rounded-xl border border-gray-100 shadow-sm">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Mês de Referência do Dashboard</label>
                  <p className="text-xs font-medium text-gray-800 py-0.5">
                    {mesReferencia}
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-[#4C1B53]/20 shadow-sm ring-1 ring-[#4C1B53]/5">
                  <label className="text-[9px] font-bold text-[#4C1B53] uppercase tracking-wider block mb-1">Como quer ser chamado(a)?</label>
                  <input
                    type="text"
                    value={nomeUsuario}
                    onChange={(e) => setNomeUsuario(e.target.value)}
                    className="w-full text-xs font-medium text-gray-800 focus:outline-none bg-transparent"
                    placeholder="Nome de exibição no topo"
                  />
                </div>
              </div>

              <div className="pt-2">
                <h4 className="text-xs font-bold text-gray-900">Assinatura e Plano</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">Controle de acesso aos módulos avançados.</p>

                <div className="mt-3 bg-gray-50/60 p-4 rounded-xl border border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">{MOCK_CLIENT.plano}</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">Renovação mensal automática via assessoria KG.</span>
                  </div>
                  <span className="bg-green-50 text-green-700 border border-green-200 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Plano Ativo
                  </span>
                </div>
              </div>
            </div>

            {/* BLOCO 2: CONFIGURAÇÕES FINANCEIRAS */}
            <div className="space-y-4">
              <div>
                <p className="text-[9px] font-bold text-[#4C1B53] uppercase tracking-widest">Configurações Financeiras</p>
                <h3 className="text-xl font-serif text-gray-900 mt-1">Metas alinhadas com a sua realidade.</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-2xl leading-relaxed">
                  Informe suas referências mensais. A KG usa esses dados como apoio para conferir e planejar o dashboard do mês seguinte.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

                {/* CARD ESQUERDO: META DE FATURAMENTO */}
                <div className="bg-white border border-[#EBEAE6] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-7 h-7 rounded-lg bg-[#F4F0F6] text-[#4C1B53] flex items-center justify-center">
                        <Target size={14} />
                      </div>
                      <h4 className="text-base font-serif text-gray-900">Meta de faturamento</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 font-sans">
                      {[
                        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
                      ].map((mes) => (
                        <div key={mes} className="space-y-1">
                          <label className="text-[8px] font-bold text-gray-400 uppercase tracking-wider block">{mes}</label>
                          <input
                            type="number"
                            value={
                              metasMeses[
                                mes.toLowerCase()
                                  .normalize("NFD")
                                  .replace(/[\u0300-\u036f]/g, "") as keyof typeof metasMeses
                              ] || ''
                            }
                            onChange={(e) => {
                              const mesFormatado = mes.toLowerCase()
                                .normalize("NFD")
                                .replace(/[\u0300-\u036f]/g, "") as keyof typeof metasMeses;
                              setMetasMeses({
                                ...metasMeses,
                                [mesFormatado]: Number(e.target.value)
                              });
                            }}
                            placeholder="R$ 0,00"
                            className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#4C1B53]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-[9px] text-gray-400 leading-normal mt-5 pt-3 border-t border-gray-50">
                    Você pode ajustar a meta de cada mês conforme o planejamento da empresa.
                  </p>
                </div>

                {/* CARD DIREITO: SALDO BANCÁRIO INFORMADO */}
                <div className="bg-white border border-[#EBEAE6] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-7 h-7 rounded-lg bg-[#F4F0F6] text-[#4C1B53] flex items-center justify-center">
                        <Building2 size={14} />
                      </div>
                      <h4 className="text-base font-serif text-gray-900">Saldo bancário informado</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 font-sans">
                      {[
                        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
                      ].map((mes) => (
                        <div key={mes} className="space-y-1">
                          <label className="text-[8px] font-bold text-gray-400 uppercase tracking-wider block">{mes}</label>
                          <input
                            type="number"
                            value={
                              saldosMeses[
                                mes.toLowerCase()
                                  .normalize("NFD")
                                  .replace(/[\u0300-\u036f]/g, "") as keyof typeof saldosMeses
                              ] || ''
                            }
                            onChange={(e) => {
                              const mesFormatado = mes.toLowerCase()
                                .normalize("NFD")
                                .replace(/[\u0300-\u036f]/g, "") as keyof typeof saldosMeses;
                              setSaldosMeses({
                                ...saldosMeses,
                                [mesFormatado]: Number(e.target.value)
                              });
                            }}
                            placeholder="R$ 0,00"
                            className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#4C1B53]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[8px] font-bold text-[#4C1B53] uppercase tracking-wider block mb-1 mt-5">Saldo no último dia de cada mês</label>
                    <p className="text-[9px] text-gray-400 leading-normal pt-2 border-t border-gray-50">
                      Este valor serve como referência para a conferência da KG. O Radar mostra dados consolidados de acordo com o extrato bancário da referência.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* BOTÃO DE SALVAR ALTERAÇÕES */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  alert("Alterações salvas com sucesso!");
                }}
                className="px-4 py-2 bg-[#4C1B53] text-white text-xs font-bold rounded-xl hover:bg-[#3d1543] transition-colors shadow-sm"
              >
                Salvar alterações
              </button>
            </div>
          </div>
        )}

        {/* Footer unificado - Apenas no Dashboard */}
        {activeTab === 'dashboard' && (
          <footer className="bg-[#211424] text-white rounded-3xl p-8 text-center space-y-4 shadow-lg">
            <p className="italic font-serif text-base text-purple-200 opacity-90">Obrigado por confiar na KG.</p>
            <h3 className="text-lg font-serif font-normal tracking-tight">Estamos construindo essa empresa junto com você.</h3>
            <p className="text-xs text-purple-300/70 font-semibold tracking-wider uppercase">Equipe KG 💜</p>
            <div className="pt-2 flex justify-center items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
              <span className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center font-black">KG</span>
              <span>KG Contabilidade · Contadora do Futuro</span>
            </div>
          </footer>
        )}

        {/* MODAL ADICIONAR DINHEIRO */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl mx-4">
              <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">Adicionar ao Cofrinho</h3>
              <p className="text-xs text-gray-500 mb-4">Insira o valor que deseja depositar na sua reserva.</p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Valor do Depósito</label>
                  <input
                    type="text"
                    placeholder="R$ 0,00"
                    value={modalValor}
                    onChange={(e) => setModalValor(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#4C1B53]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Data da Movimentação</label>
                  <input
                    type="date"
                    value={modalData}
                    onChange={(e) => setModalData(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#4C1B53]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Observação</label>
                  <input
                    type="text"
                    placeholder="Ex: Reserva de emergência"
                    value={modalObs}
                    onChange={(e) => setModalObs(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#4C1B53]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => { setModalValor(''); setModalObs(''); setShowAddModal(false); }}
                  className="w-full bg-gray-100 text-gray-700 text-xs font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmarAdicionar}
                  className="w-full bg-[#4C1B53] text-white text-xs font-bold py-3 rounded-xl hover:bg-[#3d1543] transition-colors shadow-sm"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL RETIRAR DINHEIRO */}
        {showRemoveModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl mx-4">
              <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">Retirar do Cofrinho</h3>
              <p className="text-xs text-gray-500 mb-4">Insira o valor que deseja resgatar da sua reserva.</p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Valor da Retirada</label>
                  <input
                    type="text"
                    placeholder="R$ 0,00"
                    value={modalValor}
                    onChange={(e) => setModalValor(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#4C1B53]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Data da Movimentação</label>
                  <input
                    type="date"
                    value={modalData}
                    onChange={(e) => setModalData(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#4C1B53]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Observação</label>
                  <input
                    type="text"
                    placeholder="Ex: Resgate para capital de giro"
                    value={modalObs}
                    onChange={(e) => setModalObs(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#4C1B53]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => { setModalValor(''); setModalObs(''); setShowRemoveModal(false); }}
                  className="w-full bg-gray-100 text-gray-700 text-xs font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmarRetirar}
                  className="w-full bg-[#4C1B53] text-white text-xs font-bold py-3 rounded-xl hover:bg-[#3d1543] transition-colors shadow-sm"
                >
                  Confirmar Retirada
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
