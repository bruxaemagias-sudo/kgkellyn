import './globals.css';

export const metadata = {
  title: 'KG Contabilidade | Contadora do Futuro',
  description: 'Contabilidade digital humanizada, tecnologia e proximidade para o seu negócio.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-white text-[#0D0D0D] antialiased">{children}</body>
    </html>
  );
}
