'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Bell,
  Plus,
  LayoutDashboard,
  Settings,
  History,
  LogOut,
} from 'lucide-react';

// ==========================================
// MOCK DE CLIENTES — trocar por consulta ao Supabase (tabela `clientes`) depois
// ==========================================
const MOCK_CLIENTES = [
  { id: '1', nome: 'Lumina Studio Criativo Ltda.', cnpj: '12.345.678/0001-90', plano: 'Premium Finance Pro', status: 'Ativo' },
  { id: '2', nome: 'Norte Educação', cnpj: '98.765.432/0001-10', plano: 'Essencial', status: 'Ativo' },
  { id: '3', nome: 'Aura Tech', cnpj: '11.222.333/0001-44', plano: 'Essencial', status: 'Suspenso' },
];

export default function AdminPage() {
  const [busca, setBusca] = useState('');
  const [activeTab, setActiveTab] = useState<'clientes' | 'notificacoes' | 'historico'>('clientes');

  const clientesFiltrados = MOCK_CLIENTES.filter((c) =>
    c.nome.toLowerCase().includes(busca.toLowerCase()) || c.cnpj.includes(busca)
  );

  return (
    <div className="min-h-screen bg-[#F8F6F2] flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0D0D0D] text-white min-h-screen flex flex-col justify-between p-6">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#4C1B53] flex items-center justify-center">
              <span className="font-serif text-xs font-bold">KG</span>
            </div>
            <span className="font-serif text-sm font-bold">Painel Admin</span>
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('clientes')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'clientes' ? 'bg-[#4C1B53]' : 'text-white/60 hover:bg-white/5'
              }`}
            >
              <Users size={16} /> Clientes
            </button>
            <button
              onClick={() => setActiveTab('notificacoes')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'notificacoes' ? 'bg-[#4C1B53]' : 'text-white/60 hover:bg-white/5'
              }`}
            >
              <Bell size={16} /> Notificações
            </button>
            <button
              onClick={() => setActiveTab('historico')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'historico' ? 'bg-[#4C1B53]' : 'text-white/60 hover:bg-white/5'
              }`}
            >
              <History size={16} /> Histórico
            </button>
          </nav>
        </div>
        <Link href="/" className="flex items-center gap-3 px-4 py-2 text-xs text-white/50 hover:text-white transition-colors">
          <LogOut size={16} /> Sair
        </Link>
      </aside>

      {/* CONTEÚDO */}
      <main className="flex-1 p-10 space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold text-[#4C1B53] uppercase tracking-widest">Administração</p>
            <h1 className="text-2xl font-serif text-[#0D0D0D] mt-1">Painel Administrativo KG</h1>
          </div>
        </header>

        {activeTab === 'clientes' && (
          <section className="space-y-4">
            <div className="flex justify-between items-center gap-4 flex-wrap">
              <div className="relative flex-1 max-w-sm">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar por nome, CNPJ, email..."
                  className="w-full pl-10 pr-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#4C1B53] bg-white"
                />
              </div>
              <button className="flex items-center gap-2 bg-[#4C1B53] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#301E37] transition-colors">
                <Plus size={14} /> Cadastrar cliente
              </button>
            </div>

            <div className="bg-white border border-[#EBEAE6] rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-400 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 font-bold">Empresa</th>
                    <th className="py-3 px-4 font-bold">CNPJ</th>
                    <th className="py-3 px-4 font-bold">Plano</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 font-bold">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {clientesFiltrados.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50/50">
                      <td className="py-3 px-4 font-medium text-gray-800">{c.nome}</td>
                      <td className="py-3 px-4 text-gray-500">{c.cnpj}</td>
                      <td className="py-3 px-4 text-gray-500">{c.plano}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-md font-medium text-[11px] ${
                          c.status === 'Ativo' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-[#4C1B53] font-bold hover:underline">Editar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'notificacoes' && (
          <section className="bg-white border border-[#EBEAE6] rounded-2xl p-8 text-center text-sm text-gray-400">
            Painel de notificações — conecte o Supabase Realtime (tabela <code>notificacoes</code>) para ativar criação, edição e envio em tempo real.
          </section>
        )}

        {activeTab === 'historico' && (
          <section className="bg-white border border-[#EBEAE6] rounded-2xl p-8 text-center text-sm text-gray-400">
            Histórico de alterações — conecte a tabela <code>historico_alteracoes</code> do Supabase para exibir os registros reais.
          </section>
        )}
      </main>
    </div>
  );
}
