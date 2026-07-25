// ==========================================
// CLIENTE SUPABASE
// ==========================================
// Este arquivo está pronto para conectar ao Supabase real.
// Por enquanto, sem as variáveis de ambiente configuradas, a aplicação
// usa dados mockados (veja lib/data.ts e os componentes de página).
//
// PARA ATIVAR O SUPABASE DE VERDADE:
// 1. Crie um projeto gratuito em https://supabase.com
// 2. Copie a "Project URL" e a "anon public key"
// 3. Crie um arquivo .env.local na raiz do projeto com:
//      NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
//      NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
// 4. Rode: npm install @supabase/supabase-js
// 5. Descomente o código abaixo.

// import { createClient } from '@supabase/supabase-js';
//
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
//
// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const SUPABASE_CONFIGURED = false;
