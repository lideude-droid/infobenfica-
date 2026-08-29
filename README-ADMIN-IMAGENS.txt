INFOBENFICA — ADMIN + UPLOAD DE IMAGENS

1) Executa /mnt/data/setup-admin-imagens.sql no Supabase SQL Editor.

2) ATRIBUI O TEU UTILIZADOR COMO ADMIN

No Supabase SQL Editor, executa:

update auth.users
set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'::jsonb
where email = 'O-TEU-EMAIL-AQUI';

Substitui O-TEU-EMAIL-AQUI pelo email do teu utilizador.

IMPORTANTE: usamos app_metadata, não user_metadata. O utilizador não consegue alterar
app_metadata através do frontend.

3) Depois de alterar o role, termina a sessão e entra novamente no /admin.html.
Isto força a criação de um novo JWT com role=admin.

4) IMAGENS

No admin, escolhe uma imagem do PC. Ela é enviada para o Supabase Storage no bucket
"noticias-imagens" e a URL pública + caminho ficam guardados na tabela noticias.

Formatos: JPG, PNG, WEBP e GIF.
Limite no frontend: 8 MB.

5) PERMISSÕES

- Visitantes: podem ler notícias e ver imagens.
- Utilizadores autenticados sem role=admin: NÃO podem criar, editar, apagar notícias
  nem fazer upload/apagar imagens.
- Admins: podem criar, editar, apagar notícias e gerir imagens.

NÃO coloques a service_role/secret key no frontend.
