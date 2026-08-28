import { supabase } from './supabase.js';

const newsGrid = document.getElementById('newsGrid');
const tituloCategoria = document.getElementById('tituloCategoria');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');

const nomesCategorias = {
    ultimas: 'Últimas Notícias',
    futebol: 'Futebol',
    modalidades: 'Modalidades',
    clube: 'Clube',
    opiniao: 'Opinião'
};

function criarCard(noticia) {
    const card = document.createElement('article');
    card.className = 'noticia-card';
    card.tabIndex = 0;
    card.setAttribute('role', 'link');

    if (noticia.imagem) {
        const img = document.createElement('img');
        img.className = 'noticia-img';
        img.src = noticia.imagem;
        img.alt = noticia.titulo || 'Imagem da notícia';
        img.loading = 'lazy';
        img.onerror = () => img.remove();
        card.appendChild(img);
    }

    const h2 = document.createElement('h2');
    h2.textContent = noticia.titulo || '';
    card.appendChild(h2);

    if (noticia.subtitulo) {
        const h3 = document.createElement('h3');
        h3.textContent = noticia.subtitulo;
        card.appendChild(h3);
    }

    const p = document.createElement('p');
    p.textContent = noticia.texto || '';
    card.appendChild(p);

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
    newsGrid.innerHTML = '<p>A carregar notícias...</p>';

    let query = supabase
        .from('noticias')
        .select('id,titulo,subtitulo,texto,imagem,categoria,data_criacao');

    if (categoria !== 'ultimas') {
        query = query.eq('categoria', categoria);
    }

    const { data, error } = await query.order('data_criacao', { ascending: false });

    if (error) {
        console.error('Erro ao comunicar com o Supabase:', error);
        newsGrid.innerHTML = '<p>Erro ao carregar as notícias. Verifica a configuração do Supabase.</p>';
        return;
    }

    newsGrid.replaceChildren();

    if (!data?.length) {
        newsGrid.innerHTML = '<p>Sem notícias nesta categoria.</p>';
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

document.querySelectorAll('[data-cat]').forEach(link => {
    link.addEventListener('click', async (event) => {
        event.preventDefault();
        const categoria = link.dataset.cat;
        if (!nomesCategorias[categoria]) return;

        tituloCategoria.textContent = nomesCategorias[categoria];
        fecharMenu();
        await carregarNoticias(categoria);
    });
});

carregarNoticias();
