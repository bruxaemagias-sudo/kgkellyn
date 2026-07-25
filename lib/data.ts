import {
  MessageCircle,
  BarChart3,
  FolderOpen,
  BellRing,
  LayoutDashboard,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

// ==========================================
// DIFERENCIAIS (coleção tipada, conforme especificação)
// ==========================================
export interface Diferencial {
  id: string;
  titulo: string;
  descricao: string;
  icon: LucideIcon;
}

export const DIFERENCIAIS: Diferencial[] = [
  {
    id: 'atendimento-humanizado',
    titulo: 'Atendimento Humanizado',
    descricao: 'Sem contabilês. Falamos a sua língua, do jeito simples.',
    icon: MessageCircle,
  },
  {
    id: 'whatsapp-direto',
    titulo: 'WhatsApp Direto',
    descricao: 'Fale com sua contadora sem burocracia, na palma da mão.',
    icon: MessageCircle,
  },
  {
    id: 'dashboard-financeiro',
    titulo: 'Dashboard Financeiro',
    descricao: 'Enxergue receitas, despesas e impostos em um só lugar.',
    icon: BarChart3,
  },
  {
    id: 'portal-cliente',
    titulo: 'Portal do Cliente',
    descricao: 'Acompanhe sua empresa 24h por dia, de onde estiver.',
    icon: LayoutDashboard,
  },
  {
    id: 'documentos-online',
    titulo: 'Documentos Online',
    descricao: 'Envie e receba documentos sem sair de casa.',
    icon: FolderOpen,
  },
  {
    id: 'lembretes-automaticos',
    titulo: 'Lembretes Automáticos',
    descricao: 'Nunca mais perca um prazo de imposto ou obrigação.',
    icon: BellRing,
  },
];

// ==========================================
// SERVIÇOS
// ==========================================
export interface Servico {
  id: string;
  titulo: string;
  descricao: string;
}

export const SERVICOS: Servico[] = [
  { id: 'contabilidade-digital', titulo: 'Contabilidade Digital', descricao: 'Toda a rotina contábil da sua empresa, resolvida online.' },
  { id: 'finance-pro', titulo: 'Finance Pro', descricao: 'Gestão financeira avançada com dashboards inteligentes.' },
  { id: 'bpo-financeiro', titulo: 'BPO Financeiro', descricao: 'Terceirize o financeiro e foque no seu negócio.' },
  { id: 'abertura-empresa', titulo: 'Abertura de Empresa', descricao: 'Comece com o pé direito, sem dor de cabeça.' },
  { id: 'baixa-empresa', titulo: 'Baixa de Empresa', descricao: 'Encerre sua empresa com segurança e agilidade.' },
  { id: 'consultoria', titulo: 'Consultoria', descricao: 'Orientação estratégica para decisões financeiras.' },
  { id: 'regularizacoes', titulo: 'Regularizações', descricao: 'Coloque sua empresa em dia com o fisco.' },
  { id: 'imposto-renda', titulo: 'Imposto de Renda', descricao: 'Declaração completa, sem erros e sem estresse.' },
];

// ==========================================
// COMO FUNCIONA (timeline)
// ==========================================
export interface EtapaTimeline {
  id: string;
  titulo: string;
  descricao: string;
}

export const TIMELINE: EtapaTimeline[] = [
  { id: 'diagnostico', titulo: 'Diagnóstico', descricao: 'Entendemos a realidade da sua empresa.' },
  { id: 'planejamento', titulo: 'Planejamento', descricao: 'Traçamos o caminho ideal para o seu negócio.' },
  { id: 'atendimento', titulo: 'Atendimento Contínuo', descricao: 'Acompanhamento próximo, todos os meses.' },
  { id: 'objetivo', titulo: 'Objetivo', descricao: 'Sua empresa organizada, crescendo com segurança.' },
];

export const ICON_SPARKLES = Sparkles;
