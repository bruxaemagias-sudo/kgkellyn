'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import {
  Users,
  Search,
  Bell,
  Plus,
  History,
  LogOut,
  Send,
  X,
  Star,
  Trash2,
  Quote,
} from 'lucide-react';

interface Cliente {
  id: string;
  user_id: string | null;
  nome: string;
  cnpj: string | null;
  email: string | null;
  plano: string;
  status: string;
  criado_em: string;
}

interface NotificacaoAdmin {
  id: string;
  titulo: string;
  mensagem: string;
  tipo_destinatario: string;
  destinatario_id: string | null;
  criado_em: string;
  lida: boolean;
}

interface Depoimento {
  id: string;
  nome_cliente: string;
  empresa: string | null;
  avaliacao: number;
  texto: string;
  publicado: boolean;
  criado_em: string;
}

export default function AdminPage() {
  const [busca, setBusca] = useState('');
  const [activeTab, setActiveTab] = useState<'clientes' | 'notificacoes' | 'depoimentos' | 'historico'>('clientes');
  const [emailLogado, setEmailLogado] = useState<string | null>(null);
  const [verificandoSessao, setVerificandoSessao] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmailLogado(data.user?.email ?? null);
      setVerificandoSessao(false);
    });
  }, []);

  // ==========================================
  // CLIENTES (Supabase)
  // ==========================================
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregandoClientes, setCarregandoClientes] = useState(true);
  const [modalClienteAberto, setModalClienteAberto] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [formNome, setFormNome] = useState('');
  const [formCnpj, setFormCnpj] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPlano, setFormPlano] = useState('Essencial');
  const [formStatus, setFormStatus] = useState('Ativo');
  const [formUserId, setFormUserId] = useState('');
  const [salvandoCliente, setSalvandoCliente] = useState(false);
  const [erroCliente, setErroCliente] = useState('');

  const carregarClientes = async () => {
    setCarregandoClientes(true);
    const { data } = await supabase
      .from('clientes')
      .select('id, user_id, nome, cnpj, email, plano, status, criado_em')
      .order('criado_em', { ascending: false });
    if (data) setClientes(data as Cliente[]);
    setCarregandoClientes(false);
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const clientesFiltrados = clientes.filter((c) =>
    c.nome.toLowerCase().includes(busca.toLowerCase()) || (c.cnpj ?? '').includes(busca)
  );

  const abrirModalNovoCliente = () => {
    setClienteEditando(null);
    setFormNome('');
    setFormCnpj('');
    setFormEmail('');
    setFormPlano('Essencial');
    setFormStatus('Ativo');
    setFormUserId('');
    setErroCliente('');
    setModalClienteAberto(true);
  };

  const abrirModalEditarCliente = (c: Cliente) => {
    setClienteEditando(c);
    setFormNome(c.nome);
    setFormCnpj(c.cnpj ?? '');
    setFormEmail(c.email ?? '');
    setFormPlano(c.plano);
    setFormStatus(c.status);
    setFormUserId(c.user_id ?? '');
    setErroCliente('');
    setModalClienteAberto(true);
  };

  const handleSalvarCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvandoCliente(true);
    setErroCliente('');

    const payload = {
      nome: formNome,
      cnpj: formCnpj || null,
      email: formEmail || null,
      plano: formPlano,
      status: formStatus,
      user_id: formUserId || null,
      atualizado_em: new Date().toISOString(),
    };

    const { error } = clienteEditando
      ? await supabase.from('clientes').update(payload).eq('id', clienteEditando.id)
      : await supabase.from('clientes').insert(payload);

    setSalvandoCliente(false);

    if (error) {
      setErroCliente('Não foi possível salvar. Confira os dados e tente novamente.');
      return;
    }

    setModalClienteAberto(false);
    carregarClientes();
  };

  // ==========================================
  // NOTIFICAÇÕES
  // ==========================================
  const [notificacoes, setNotificacoes] = useState<NotificacaoAdmin[]>([]);
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novaMensagem, setNovaMensagem] = useState('');
  const [novoTipoDestinatario, setNovoTipoDestinatario] = useState<'todos' | 'individual'>('todos');
  const [novoDestinatarioId, setNovoDestinatarioId] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mensagemStatus, setMensagemStatus] = useState('');

  const carregarNotificacoes = async () => {
    const { data } = await supabase
      .from('notificacoes')
      .select('id, titulo, mensagem, tipo_destinatario, destinatario_id, criado_em, lida')
      .order('criado_em', { ascending: false });
    if (data) setNotificacoes(data as NotificacaoAdmin[]);
  };

  useEffect(() => {
    if (activeTab === 'notificacoes') {
      carregarNotificacoes();
    }
  }, [activeTab]);

  const handleEnviarNotificacao = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setMensagemStatus('');

    const { data: userData } = await supabase.auth.getUser();

    const { error } = await supabase.from('notificacoes').insert({
      titulo: novoTitulo,
      mensagem: novaMensagem,
      tipo_destinatario: novoTipoDestinatario,
      destinatario_id: novoTipoDestinatario === 'individual' ? novoDestinatarioId : null,
      criado_por: userData.user?.id ?? null,
    });

    setEnviando(false);

    if (error) {
      setMensagemStatus('Não foi possível enviar. Verifique se você está logado e tente novamente.');
      return;
    }

    setMensagemStatus('Notificação enviada com sucesso!');
    setNovoTitulo('');
    setNovaMensagem('');
    setNovoDestinatarioId('');
    carregarNotificacoes();
  };

  // ==========================================
  // DEPOIMENTOS
  // ==========================================
  const [depoimentos, setDepoimentos] = useState<Depoimento[]>([]);
  const [modalDepoimentoAberto, setModalDepoimentoAberto] = useState(false);
  const [depoimentoEditando, setDepoimentoEditando] = useState<Depoimento | null>(null);
  const [formNomeCliente, setFormNomeCliente] = useState('');
  const [formEmpresaDepoimento, setFormEmpresaDepoimento] = useState('');
  const [formAvaliacao, setFormAvaliacao] = useState(5);
  const [formTextoDepoimento, setFormTextoDepoimento] = useState('');
  const [formPublicado, setFormPublicado] = useState(true);
  const [salvandoDepoimento, setSalvandoDepoimento] = useState(false);
  const [erroDepoimento, setErroDepoimento] = useState('');

  const carregarDepoimentos = async () => {
    const { data } = await supabase
      .from('depoimentos')
      .select('id, nome_cliente, empresa, avaliacao, texto, publicado, criado_em')
      .order('criado_em', { ascending: false });
    if (data) setDepoimentos(data as Depoimento[]);
  };

  useEffect(() => {
    if (activeTab === 'depoimentos') {
      carregarDepoimentos();
    }
  }, [activeTab]);

  const abrirModalNovoDepoimento = () => {
    setDepoimentoEditando(null);
    setFormNomeCliente('');
    setFormEmpresaDepoimento('');
    setFormAvaliacao(5);
    setFormTextoDepoimento('');
    setFormPublicado(true);
    setErroDepoimento('');
    setModalDepoimentoAberto(true);
  };

  const abrirModalEditarDepoimento = (d: Depoimento) => {
    setDepoimentoEditando(d);
    setFormNomeCliente(d.nome_cliente);
    setFormEmpresaDepoimento(d.empresa ?? '');
    setFormAvaliacao(d.avaliacao);
    setFormTextoDepoimento(d.texto);
    setFormPublicado(d.publicado);
    setErroDepoimento('');
    setModalDepoimentoAberto(true);
  };

  const handleSalvarDepoimento = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvandoDepoimento(true);
    setErroDepoimento('');

    const payload = {
      nome_cliente: formNomeCliente,
      empresa: formEmpresaDepoimento || null,
      avaliacao: formAvaliacao,
      texto: formTextoDepoimento,
      publicado: formPublicado,
    };

    const { error } = depoimentoEditando
      ? await supabase.from('depoimentos').update(payload).eq('id', depoimentoEditando.id)
      : await supabase.from('depoimentos').insert(payload);

    setSalvandoDepoimento(false);

    if (error) {
      setErroDepoimento('Não foi possível salvar. Confira os dados e tente novamente.');
      return;
    }

    setModalDepoimentoAberto(false);
    carregarDepoimentos();
  };

  const handleExcluirDepoimento = async (id: string) => {
    if (!confirm('Remover este depoimento? Essa ação não pode ser desfeita.')) return;
    await supabase.from('depoimentos').delete().eq('id', id);
    carregarDepoimentos();
  };

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
              onClick={() => setActiveTab('depoimentos')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'depoimentos' ? 'bg-[#4C1B53]' : 'text-white/60 hover:bg-white/5'
              }`}
            >
              <Quote size={16} /> Depoimentos
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

        {!verificandoSessao && (
          <div className={`rounded-xl px-4 py-2.5 text-xs font-medium ${
            emailLogado ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'
          }`}>
            {emailLogado
              ? `Sessão ativa como: ${emailLogado}`
              : 'Você não está logado — faça login em /login antes de usar o painel, senão os cadastros serão recusados.'}
          </div>
        )}

        {activeTab === 'clientes' && (
          <section className="space-y-4">
            <div className="flex justify-between items-center gap-4 flex-wrap">
              <div className="relative flex-1 max-w-sm">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar por nome ou CNPJ..."
                  className="w-full pl-10 pr-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#4C1B53] bg-white"
                />
              </div>
              <button
                onClick={abrirModalNovoCliente}
                className="flex items-center gap-2 bg-[#4C1B53] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#301E37] transition-colors"
              >
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
                  {carregandoClientes && (
                    <tr><td colSpan={5} className="py-8 text-center text-gray-400">Carregando...</td></tr>
                  )}
                  {!carregandoClientes && clientesFiltrados.length === 0 && (
                    <tr><td colSpan={5} className="py-8 text-center text-gray-400">Nenhum cliente cadastrado ainda.</td></tr>
                  )}
                  {clientesFiltrados.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50/50">
                      <td className="py-3 px-4 font-medium text-gray-800">{c.nome}</td>
                      <td className="py-3 px-4 text-gray-500">{c.cnpj || '—'}</td>
                      <td className="py-3 px-4 text-gray-500">{c.plano}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-md font-medium text-[11px] ${
                          c.status === 'Ativo' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button onClick={() => abrirModalEditarCliente(c)} className="text-[#4C1B53] font-bold hover:underline">Editar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'notificacoes' && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-[#EBEAE6] rounded-2xl p-6 shadow-sm space-y-4 h-fit">
              <h3 className="text-sm font-serif text-gray-900">Nova notificação</h3>
              <form onSubmit={handleEnviarNotificacao} className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Título</label>
                  <input
                    value={novoTitulo}
                    onChange={(e) => setNovoTitulo(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#4C1B53]"
                    placeholder="Ex: Lembrete de pagamento"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Mensagem</label>
                  <textarea
                    value={novaMensagem}
                    onChange={(e) => setNovaMensagem(e.target.value)}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#4C1B53]"
                    placeholder="Escreva a mensagem para o cliente..."
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Destinatário</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setNovoTipoDestinatario('todos')}
                      className={`flex-1 text-xs font-bold py-2 rounded-xl border transition-colors ${
                        novoTipoDestinatario === 'todos' ? 'bg-[#4C1B53] text-white border-[#4C1B53]' : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      Todos os clientes
                    </button>
                    <button
                      type="button"
                      onClick={() => setNovoTipoDestinatario('individual')}
                      className={`flex-1 text-xs font-bold py-2 rounded-xl border transition-colors ${
                        novoTipoDestinatario === 'individual' ? 'bg-[#4C1B53] text-white border-[#4C1B53]' : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      Um cliente específico
                    </button>
                  </div>
                </div>
                {novoTipoDestinatario === 'individual' && (
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      ID do usuário (UID do Supabase Authentication)
                    </label>
                    <input
                      value={novoDestinatarioId}
                      onChange={(e) => setNovoDestinatarioId(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#4C1B53]"
                      placeholder="Ex: 32fcee39-b225-496c-aab7-b471a5e5ce6b"
                    />
                  </div>
                )}
                {mensagemStatus && (
                  <p className={`text-xs rounded-xl px-3 py-2 ${mensagemStatus.includes('sucesso') ? 'text-green-700 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                    {mensagemStatus}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={enviando}
                  className="w-full flex items-center justify-center gap-2 bg-[#4C1B53] text-white text-xs font-bold py-3 rounded-xl hover:bg-[#301E37] transition-colors disabled:opacity-60"
                >
                  <Send size={14} /> {enviando ? 'Enviando...' : 'Enviar notificação'}
                </button>
              </form>
            </div>

            <div className="bg-white border border-[#EBEAE6] rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-serif text-gray-900 mb-4">Notificações enviadas</h3>
              <div className="space-y-3 max-h-[420px] overflow-y-auto">
                {notificacoes.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-8">Nenhuma notificação enviada ainda.</p>
                )}
                {notificacoes.map((n) => (
                  <div key={n.id} className="border border-gray-100 rounded-xl p-3">
                    <div className="flex justify-between items-start">
                      <p className="text-xs font-bold text-gray-900">{n.titulo}</p>
                      <span className="text-[9px] font-bold text-gray-400 uppercase">
                        {n.tipo_destinatario === 'todos' ? 'Todos' : 'Individual'}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">{n.mensagem}</p>
                    <p className="text-[9px] text-gray-300 mt-1.5">{new Date(n.criado_em).toLocaleString('pt-BR')}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'depoimentos' && (
          <section className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={abrirModalNovoDepoimento}
                className="flex items-center gap-2 bg-[#4C1B53] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#301E37] transition-colors"
              >
                <Plus size={14} /> Novo depoimento
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {depoimentos.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-8 col-span-2">Nenhum depoimento cadastrado ainda.</p>
              )}
              {depoimentos.map((d) => (
                <div key={d.id} className="bg-white border border-[#EBEAE6] rounded-2xl p-5 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-gray-900">{d.nome_cliente}</p>
                      {d.empresa && <p className="text-[10px] text-gray-400">{d.empresa}</p>}
                    </div>
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md ${
                      d.publicado ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-50'
                    }`}>
                      {d.publicado ? 'Publicado' : 'Rascunho'}
                    </span>
                  </div>
                  <div className="flex gap-0.5 my-2 text-[#4C1B53]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} fill={i < d.avaliacao ? '#4C1B53' : 'none'} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{d.texto}</p>
                  <div className="flex gap-3 mt-3">
                    <button onClick={() => abrirModalEditarDepoimento(d)} className="text-[10px] font-bold text-[#4C1B53] hover:underline">
                      Editar
                    </button>
                    <button onClick={() => handleExcluirDepoimento(d.id)} className="text-[10px] font-bold text-red-500 hover:underline flex items-center gap-1">
                      <Trash2 size={11} /> Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'historico' && (
          <section className="bg-white border border-[#EBEAE6] rounded-2xl p-8 text-center text-sm text-gray-400">
            Histórico de alterações — conecte a tabela <code>historico_alteracoes</code> do Supabase para exibir os registros reais.
          </section>
        )}
      </main>


      {/* MODAL CADASTRAR / EDITAR CLIENTE */}
      {modalClienteAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-serif font-bold text-gray-900">
                {clienteEditando ? 'Editar cliente' : 'Cadastrar cliente'}
              </h3>
              <button onClick={() => setModalClienteAberto(false)} className="text-gray-400 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSalvarCliente} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Nome da empresa</label>
                <input
                  value={formNome}
                  onChange={(e) => setFormNome(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#4C1B53]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">CNPJ</label>
                <input
                  value={formCnpj}
                  onChange={(e) => setFormCnpj(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#4C1B53]"
                  placeholder="00.000.000/0001-00"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Email</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#4C1B53]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Plano</label>
                  <select
                    value={formPlano}
                    onChange={(e) => setFormPlano(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#4C1B53]"
                  >
                    <option value="Essencial">Essencial</option>
                    <option value="Premium Finance Pro">Premium Finance Pro</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#4C1B53]"
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Suspenso">Suspenso</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  ID do usuário de login (opcional)
                </label>
                <input
                  value={formUserId}
                  onChange={(e) => setFormUserId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#4C1B53]"
                  placeholder="UID do Supabase Authentication"
                />
                <p className="text-[9px] text-gray-400 mt-1">
                  Crie o login em Authentication → Users primeiro, depois cole o UID aqui pra ligar o cliente à conta dele.
                </p>
              </div>

              {erroCliente && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{erroCliente}</p>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalClienteAberto(false)}
                  className="w-full bg-gray-100 text-gray-700 text-xs font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvandoCliente}
                  className="w-full bg-[#4C1B53] text-white text-xs font-bold py-3 rounded-xl hover:bg-[#301E37] transition-colors disabled:opacity-60"
                >
                  {salvandoCliente ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CADASTRAR / EDITAR DEPOIMENTO */}
      {modalDepoimentoAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-serif font-bold text-gray-900">
                {depoimentoEditando ? 'Editar depoimento' : 'Novo depoimento'}
              </h3>
              <button onClick={() => setModalDepoimentoAberto(false)} className="text-gray-400 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSalvarDepoimento} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Nome do cliente</label>
                <input
                  value={formNomeCliente}
                  onChange={(e) => setFormNomeCliente(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#4C1B53]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Empresa (opcional)</label>
                <input
                  value={formEmpresaDepoimento}
                  onChange={(e) => setFormEmpresaDepoimento(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#4C1B53]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Avaliação</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setFormAvaliacao(n)}
                      className="text-[#4C1B53]"
                    >
                      <Star size={22} fill={n <= formAvaliacao ? '#4C1B53' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Depoimento</label>
                <textarea
                  value={formTextoDepoimento}
                  onChange={(e) => setFormTextoDepoimento(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#4C1B53]"
                  placeholder="Cole aqui o depoimento real do cliente..."
                />
              </div>
              <label className="flex items-center gap-2 text-xs text-gray-600">
                <input
                  type="checkbox"
                  checked={formPublicado}
                  onChange={(e) => setFormPublicado(e.target.checked)}
                  className="rounded"
                />
                Publicar no site imediatamente
              </label>

              {erroDepoimento && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{erroDepoimento}</p>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalDepoimentoAberto(false)}
                  className="w-full bg-gray-100 text-gray-700 text-xs font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvandoDepoimento}
                  className="w-full bg-[#4C1B53] text-white text-xs font-bold py-3 rounded-xl hover:bg-[#301E37] transition-colors disabled:opacity-60"
                >
                  {salvandoDepoimento ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
