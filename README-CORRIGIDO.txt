INFOBENFICA — versão corrigida

Principais correções:
1. O login de admin agora usa Supabase Auth (email + password).
2. O dashboard e o formulário de criação passam a abrir/fechar corretamente.
3. O logout foi implementado.
4. O menu hamburger mobile funciona.
5. Os artigos deixam de transportar todo o texto pela URL: agora usam article.html?id=...
6. Foi removido o uso de innerHTML com dados vindos da base de dados, reduzindo o risco de XSS.
7. Foram adicionados estados de erro/carregamento e melhor suporte mobile.
8. O código passou a usar explicitamente o id e data_criacao da tabela noticias.

IMPORTANTE:
- Em Supabase, tem de existir um utilizador em Authentication para entrar no admin.
- A tabela "noticias" deve ter, pelo menos:
  id, titulo, subtitulo, categoria, texto, imagem, data_criacao
- As políticas RLS do Supabase têm de permitir SELECT público (se o site for público)
  e INSERT autenticado para o admin.
- A chave usada no frontend é a chave anon. Nunca coloques uma service_role key no frontend.

Nota:
A versão original tinha um login visual, mas nenhum código que processasse esse login.
Também tinha o botão "Criar Notícia" sem handler e o hamburger sem handler.
