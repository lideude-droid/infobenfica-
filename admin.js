import { supabase } from './supabase.js';

const loginArea = document.getElementById('loginArea');
const dashboardArea = document.getElementById('dashboardArea');
const criarArea = document.getElementById('criarArea');
const listaNoticias = document.getElementById('listaNoticias');
const loginForm = document.getElementById('loginForm');
const criarForm = document.getElementById('criarForm');
const loginError = document.getElementById('loginError');
const formError = document.getElementById('formError');

function mostrar(area) {
    [loginArea, dashboardArea, criarArea].forEach(el => el.classList.add('hidden'));
    area.classList.remove('hidden');
}

function limparErros() {
    loginError.textContent = '';
    formError.textContent = '';
}

async function atualizarUI() {
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
        mostrar(dashboardArea);
        await carregarNoticias();
    } else {
        mostrar(loginArea);
    }
}

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    limparErros();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('pass').value;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        loginError.textContent = 'Login inválido. Verifica o email e a password.';
        return;
    }

    loginForm.reset();
    await atualizarUI();
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
    await supabase.auth.signOut();
    await atualizarUI();
});

document.getElementById('btnCriar').addEventListener('click', () => {
    limparErros();
    criarForm.reset();
    mostrar(criarArea);
});

document.getElementById('cancelCriar').addEventListener('click', () => {
    mostrar(dashboardArea);
});

criarForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    limparErros();

    const noticia = {
        titulo: document.getElementById('tituloCriar').value.trim(),
        subtitulo: document.getElementById('subtituloCriar').value.trim() || null,
        categoria: document.getElementById('categoriaCriar').value,
        texto: document.getElementById('textoCriar').value.trim(),
        imagem: document.getElementById('imagemCriar').value.trim() || null
    };

    const { error } = await supabase.from('noticias').insert(noticia);

    if (error) {
        console.error(error);
        formError.textContent = 'Erro ao guardar a notícia. Verifica as políticas RLS do Supabase.';
        return;
    }

    criarForm.reset();
    mostrar(dashboardArea);
    await carregarNoticias();
});

async function carregarNoticias() {
    listaNoticias.innerHTML = '<p>A carregar...</p>';

    const { data, error } = await supabase
        .from('noticias')
        .select('id,titulo,subtitulo,categoria,data_criacao')
        .order('data_criacao', { ascending: false });

    if (error) {
        console.error(error);
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

        const h2 = document.createElement('h2');
        h2.textContent = noticia.titulo || '';
        card.appendChild(h2);

        const meta = document.createElement('p');
        meta.textContent = `${noticia.categoria || ''}${noticia.data_criacao ? ' • ' + new Date(noticia.data_criacao).toLocaleString('pt-PT') : ''}`;
        card.appendChild(meta);

        const link = document.createElement('a');
        link.href = `article.html?id=${encodeURIComponent(noticia.id)}`;
        link.textContent = 'Ver notícia';
        link.target = '_blank';
        link.rel = 'noopener';
        card.appendChild(link);

        listaNoticias.appendChild(card);
    });
}

supabase.auth.onAuthStateChange(() => atualizarUI());
atualizarUI();
