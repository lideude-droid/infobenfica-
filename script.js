import { supabase } from './supabase.js';

const newsGrid = document.getElementById('newsGrid');
const tituloCategoria = document.getElementById('tituloCategoria');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenuBtn = document.getElementById('closeMenu');

const nomesCategorias = {
    ultimas: 'Últimas Notícias',
    futebol: 'Futebol',
    modalidades: 'Modalidades',
    clube: 'Clube',
    opiniao: 'Opinião'
};

function formatarData(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).replace('.', '');
}

function criarCard(noticia) {
    const card = document.createElement('article');
    card.className = 'noticia-card';
    card.tabIndex = 0;
    card.setAttribute('role', 'link');

    const media = document.createElement('div');
    media.className = 'card-media';

    if (noticia.imagem) {
        const img = document.createElement('img');
        img.className = 'noticia-img';
        img.src = noticia.imagem;
        img.alt = noticia.titulo || 'Imagem da notícia';
        img.loading = 'lazy';
        img.onerror = () => {
            media.classList.add('no-image');
            img.remove();
        };
        media.appendChild(img);
    } else {
        media.classList.add('no-image');
        media.textContent = 'INFOBENFICA';
    }

    const content = document.createElement('div');
    content.className = 'card-content';

    const meta = document.createElement('div');
    meta.className = 'card-meta';

    const category = document.createElement('span');
    category.textContent = noticia.categoria || 'Notícia';
    meta.appendChild(category);

    const date = formatarData(noticia.data_criacao);
    if (date) {
        const time = document.createElement('time');
        time.textContent = date;
        meta.appendChild(time);
    }

    content.appendChild(meta);

    const h2 = document.createElement('h2');
    h2.textContent = noticia.titulo || '';
    content.appendChild(h2);

    if (noticia.subtitulo) {
        const h3 = document.createElement('h3');
        h3.textContent = noticia.subtitulo;
        content.appendChild(h3);
    }

    const p = document.createElement('p');
    const texto = noticia.texto || '';
    p.textContent = texto.length > 150 ? `${texto.slice(0, 150).trim()}…` : texto;
    content.appendChild(p);

    const link = document.createElement('span');
    link.className = 'read-more';
    link.textContent = 'Ler notícia';
    content.appendChild(link);

    card.append(media, content);

    const abrir = () => {
        if (noticia.id != null) {
            window.location.href = `article.html?id=${encodeURIComponent(noticia.id)}`;
        }
    };

    card.addEventListener('click', abrir);
    card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            abrir();
        }
    });

    return card;
}

async function carregarNoticias(categoria = 'ultimas') {
    newsGrid.innerHTML = '<p class="loading">A carregar notícias…</p>';

    let query = supabase
        .from('noticias')
        .select('id,titulo,subtitulo,texto,imagem,categoria,data_criacao');

    if (categoria !== 'ultimas') {
        query = query.eq('categoria', categoria);
    }

    const { data, error } = await query.order('data_criacao', { ascending: false });

    if (error) {
        console.error('Erro ao comunicar com o Supabase:', error);
        newsGrid.innerHTML = '<div class="empty-state"><strong>Não foi possível carregar as notícias.</strong><span>Verifica a ligação ao Supabase.</span></div>';
        return;
    }

    newsGrid.replaceChildren();

    if (!data?.length) {
        newsGrid.innerHTML = '<div class="empty-state"><strong>Sem notícias nesta categoria.</strong><span>Volta mais tarde para novas atualizações.</span></div>';
        return;
    }

    const fragment = document.createDocumentFragment();
    data.forEach(noticia => fragment.appendChild(criarCard(noticia)));
    newsGrid.appendChild(fragment);
}

function fecharMenu() {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
}

hamburgerBtn.addEventListener('click', () => {
    const aberto = mobileMenu.classList.toggle('open');
    mobileMenu.setAttribute('aria-hidden', String(!aberto));
    hamburgerBtn.setAttribute('aria-expanded', String(aberto));
});

closeMenuBtn?.addEventListener('click', fecharMenu);

document.querySelectorAll('[data-cat]').forEach(link => {
    link.addEventListener('click', async (event) => {
        event.preventDefault();
        const categoria = link.dataset.cat;
        if (!nomesCategorias[categoria]) return;

        document.querySelectorAll('[data-cat]').forEach(item => item.classList.remove('active'));
        document.querySelectorAll(`[data-cat="${categoria}"]`).forEach(item => item.classList.add('active'));

        tituloCategoria.textContent = nomesCategorias[categoria];
        fecharMenu();
        await carregarNoticias(categoria);
    });
});

carregarNoticias();
