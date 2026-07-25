# KG Contabilidade — Site + Portal + Admin

## O que já está pronto (visual e navegação completos)
- **/** — Site institucional: Hero, Quem Somos, Serviços, Como Funciona, Diferenciais, Finance Pro, Depoimentos (vazio, aguardando cadastro real), CTA final, Rodapé.
- **/login** — Tela de login.
- **/portal** — Dashboard do Cliente (visão geral, cofrinho, configurações).
- **/admin** — Painel Administrativo (listagem de clientes, notificações, histórico).

## O que ainda é MOCK (dado de exemplo, não é banco de dados real)
Login, clientes, notificações e histórico ainda usam dados fixos no código.
Isso é intencional nesta fase — dá pra navegar, testar o visual e mostrar pra
qualquer pessoa, mas nada é salvo de verdade ainda.

## Como ativar o Supabase (banco de dados e login reais)
1. Crie uma conta gratuita em https://supabase.com e um novo projeto.
2. No projeto, vá em **Project Settings → API** e copie a **Project URL** e a **anon public key**.
3. Na raiz deste projeto, crie um arquivo chamado `.env.local` com:
   ```
   NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
   ```
4. Rode `npm install @supabase/supabase-js`.
5. Abra `lib/supabaseClient.ts` e descomente o código indicado ali.
6. Crie as tabelas no Supabase (usuarios, clientes, planos, dashboard_mensal,
   metas, cofrinho, escudos, analises, tarefas, notificacoes, receitas,
   despesas, impostos, documentos, radar_kg, historico_alteracoes) com Row
   Level Security ativado.
7. Volte pra este chat e me avisa — a partir daí eu troco os dados mockados
   de `app/login`, `app/portal` e `app/admin` pelas consultas reais.

## Rodando localmente
```
npm install
npm run dev
```
Abra http://localhost:3000
