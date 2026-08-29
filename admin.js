import { supabase } from './supabase.js';

const loginArea = document.getElementById('loginArea');
const dashboardArea = document.getElementById('dashboardArea');
const criarArea = document.getElementById('criarArea');
const listaNoticias = document.getElementById('listaNoticias');
const loginForm = document.getElementById('loginForm');
const criarForm = document.getElementById('criarForm');
const loginError = document.getElementById('loginError');
const formError = document.getElementById('formError');
const formTitulo = document.getElementById('formTitulo');
const imagemAtual = document.getElementById('imagemAtual');
const imagemCriar = document.getElementById('imagemCriar');
const removerImagemBtn = document.getElementById('removerImagem');

let noticiaEmEdicao = null;
let imagemParaRemover = false;

function mostrar(area) {
    [loginArea, dashboardArea, criarArea].forEach(el => el.classList.add('hidden'));
    area.classList.remove('hidden');
}

function limparErros() {
    loginError.textContent = '';
    formError.textContent = '';
}

async function obterSessao() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
}

function sessaoEhAdmin(session) {
    return session?.user?.app_metadata?.role === 'admin';
}

async function atualizarUI() {
    limparErros();

    try {
        const session = await obterSessao();

        if (!session) {
            mostrar(loginArea);
            return;
        }

        if (!sessaoEhAdmin(session)) {
            await supabase.auth.signOut();
            mostrar(loginArea);
            loginError.textContent = 'Esta conta não tem permissões de administrador.';
            return;
        }

        mostrar(dashboardArea);
        await carregarNoticias();
    } catch (error) {
        console.error('Erro de autenticação:', error);
        mostrar(loginArea);
        loginError.textContent = 'Não foi possível verificar a sessão.';
    }
}

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    limparErros();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('pass').value;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        console.error(error);
        loginError.textContent = 'Login inválido. Verifica o email e a password.';
        return;
    }

    if (!sessaoEhAdmin(data.session)) {
        await supabase.auth.signOut();
        loginError.textContent = 'Login efetuado, mas esta conta não é administrador.';
        return;
    }

    loginForm.reset();
    await atualizarUI();
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
    await supabase.auth.signOut();
    await atualizarUI();
});

document.getElementById('btnCriar').addEventListener('click', () => abrirFormulario());
document.getElementById('cancelCriar').addEventListener('click', () => {
    noticiaEmEdicao = null;
    mostrar(dashboardArea);
});

function abrirFormulario(noticia = null) {
    limparErros();
    noticiaEmEdicao = noticia;
    imagemParaRemover = false;
    criarForm.reset();
    imagemAtual.textContent = '';
    removerImagemBtn.classList.add('hidden');

    if (noticia) {
        formTitulo.textContent = 'Editar Notícia';
        document.getElementById('tituloCriar').value = noticia.titulo || '';
        document.getElementById('subtituloCriar').value = noticia.subtitulo || '';
        document.getElementById('categoriaCriar').value = noticia.categoria || 'futebol';
        document.getElementById('textoCriar').value = noticia.texto || '';
        if (noticia.imagem) {
            imagemAtual.textContent = 'Imagem atual: ' + noticia.imagem;
            removerImagemBtn.classList.remove('hidden');
        }
    } else {
        formTitulo.textContent = 'Criar Notícia';
    }

    mostrar(criarArea);
}

removerImagemBtn.addEventListener('click', () => {
    imagemParaRemover = true;
    imagemAtual.textContent = 'A imagem atual será removida ao guardar.';
    imagemCriar.value = '';
});

function nomeSeguro(nome) {
    const ext = nome.includes('.') ? nome.split('.').pop().toLowerCase() : 'jpg';
    const base = nome
        .replace(/\.[^/.]+$/, '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9_-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 80) || 'imagem';
    return `${base}.${ext}`;
}

async function apagarImagemStorage(path) {
    if (!path) return;
    const { error } = await supabase.storage.from('noticias-imagens').remove([path]);
    if (error) console.warn('Não foi possível remover a imagem antiga:', error);
}

async function uploadImagem(file, userId) {
    if (!file) return null;

    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!tiposPermitidos.includes(file.type)) {
        throw new Error('Formato de imagem não permitido. Usa JPG, PNG, WEBP ou GIF.');
    }
    if (file.size > 8 * 1024 * 1024) {
        throw new Error('A imagem é demasiado grande. O limite é 8 MB.');
    }

    const path = `${userId}/${crypto.randomUUID()}-${nomeSeguro(file.name)}`;
    const { error } = await supabase.storage
        .from('noticias-imagens')
        .upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type });

    if (error) throw error;

    const { data } = supabase.storage.from('noticias-imagens').getPublicUrl(path);
    return { path, url: data.publicUrl };
}

criarForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    limparErros();

    try {
        const session = await obterSessao();
        if (!sessaoEhAdmin(session)) throw new Error('Apenas administradores podem guardar notícias.');

        const titulo = document.getElementById('tituloCriar').value.trim();
        const subtitulo = document.getElementById('subtituloCriar').value.trim() || null;
        const categoria = document.getElementById('categoriaCriar').value;
        const texto = document.getElementById('textoCriar').value.trim();
        const ficheiro = imagemCriar.files[0] || null;

        let imagem = noticiaEmEdicao?.imagem || null;
        let imagem_path = noticiaEmEdicao?.imagem_path || null;

        if (imagemParaRemover) {
            await apagarImagemStorage(imagem_path);
            imagem = null;
            imagem_path = null;
        }

        if (ficheiro) {
            const novaImagem = await uploadImagem(ficheiro, session.user.id);
            if (imagem_path) await apagarImagemStorage(imagem_path);
            imagem = novaImagem.url;
            imagem_path = novaImagem.path;
        }

        const payload = { titulo, subtitulo, categoria, texto, imagem, imagem_path };

        if (noticiaEmEdicao) {
            const { error } = await supabase
                .from('noticias')
                .update(payload)
                .eq('id', noticiaEmEdicao.id);
            if (error) throw error;
        } else {
            const { error } = await supabase.from('noticias').insert(payload);
            if (error) {
                if (imagem_path) await apagarImagemStorage(imagem_path);
                throw error;
            }
        }

        noticiaEmEdicao = null;
        criarForm.reset();
        mostrar(dashboardArea);
        await carregarNoticias();
    } catch (error) {
        console.error('Erro ao guardar notícia:', error);
        formError.textContent = error.message || 'Não foi possível guardar a notícia.';
    }
});

async function carregarNoticias() {
    listaNoticias.innerHTML = '<p>A carregar...</p>';

    const { data, error } = await supabase
        .from('noticias')
        .select('id,titulo,subtitulo,texto,imagem,imagem_path,categoria,data_criacao')
        .order('data_criacao', { ascending: false });

    if (error) {
        console.error('Erro ao carregar notícias:', error);
        listaNoticias.innerHTML = '<p class="error">Não foi possível carregar as notícias.</p>';
        return;
    }

    listaNoticias.replaceChildren();

    if (!data?.length) {
        listaNoticias.innerHTML = '<p>Ainda não existem notícias.</p>';
        return;
    }

    data.forEach(noticia => {
        const card = document.createElement('article');
        card.className = 'noticia-card';

        if (noticia.imagem) {
            const img = document.createElement('img');
            img.src = noticia.imagem;
            img.alt = noticia.titulo || '';
            img.loading = 'lazy';
            card.appendChild(img);
        }

        const h2 = document.createElement('h2');
        h2.textContent = noticia.titulo || '';
        card.appendChild(h2);

        const meta = document.createElement('p');
        meta.textContent = `${noticia.categoria || ''}${noticia.data_criacao ? ' • ' + new Date(noticia.data_criacao).toLocaleString('pt-PT') : ''}`;
        card.appendChild(meta);

        const actions = document.createElement('div');
        actions.className = 'card-actions';

        const ver = document.createElement('a');
        ver.href = `article.html?id=${encodeURIComponent(noticia.id)}`;
        ver.textContent = 'Ver';
        ver.target = '_blank';
        ver.rel = 'noopener';
        actions.appendChild(ver);

        const editar = document.createElement('button');
        editar.type = 'button';
        editar.textContent = 'Editar';
        editar.addEventListener('click', () => abrirFormulario(noticia));
        actions.appendChild(editar);

        const apagar = document.createElement('button');
        apagar.type = 'button';
        apagar.className = 'danger';
        apagar.textContent = 'Apagar';
        apagar.addEventListener('click', () => apagarNoticia(noticia));
        actions.appendChild(apagar);

        card.appendChild(actions);
        listaNoticias.appendChild(card);
    });
}

async function apagarNoticia(noticia) {
    if (!confirm(`Apagar a notícia "${noticia.titulo}"? Esta ação não pode ser desfeita.`)) return;

    try {
        const session = await obterSessao();
        if (!sessaoEhAdmin(session)) throw new Error('Apenas administradores podem apagar notícias.');

        const { error } = await supabase.from('noticias').delete().eq('id', noticia.id);
        if (error) throw error;

        if (noticia.imagem_path) await apagarImagemStorage(noticia.imagem_path);
        await carregarNoticias();
    } catch (error) {
        console.error('Erro ao apagar notícia:', error);
        alert(error.message || 'Não foi possível apagar a notícia.');
    }
}

supabase.auth.onAuthStateChange(() => atualizarUI());
atualizarUI();
