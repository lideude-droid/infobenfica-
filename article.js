import { supabase } from './supabase.js';

const container = document.getElementById('articleContainer');
const id = new URLSearchParams(window.location.search).get('id');

function formatarData(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
}

async function carregarArtigo() {
    if (!id) {
        container.innerHTML = '<div class="empty-state"><strong>Notícia não encontrada.</strong><a href="index.html">Voltar às notícias</a></div>';
        return;
    }

    const { data, error } = await supabase
        .from('noticias')
        .select('id,titulo,subtitulo,texto,imagem,categoria,data_criacao')
        .eq('id', id)
        .single();

    if (error || !data) {
        console.error(error);
        container.innerHTML = '<div class="empty-state"><strong>Não foi possível carregar a notícia.</strong><a href="index.html">Voltar às notícias</a></div>';
        return;
    }

    document.title = `${data.titulo || 'Notícia'} - Infobenfica`;
    container.replaceChildren();

    const meta = document.createElement('div');
    meta.className = 'article-meta';

    const category = document.createElement('span');
    category.textContent = data.categoria || 'Notícia';
    meta.appendChild(category);

    const date = formatarData(data.data_criacao);
    if (date) {
        const time = document.createElement('time');
        time.dateTime = data.data_criacao;
        time.textContent = date;
        meta.appendChild(time);
    }

    const h1 = document.createElement('h1');
    h1.textContent = data.titulo || '';

    container.appendChild(meta);
    container.appendChild(h1);

    if (data.subtitulo) {
        const h2 = document.createElement('h2');
        h2.className = 'article-subtitle';
        h2.textContent = data.subtitulo;
        container.appendChild(h2);
    }

    if (data.imagem) {
        const img = document.createElement('img');
        img.className = 'article-image';
        img.src = data.imagem;
        img.alt = data.titulo || '';
        img.loading = 'eager';
        img.onerror = () => img.remove();
        container.appendChild(img);
    }

    const text = document.createElement('div');
    text.className = 'article-text';
    text.textContent = data.texto || '';
    container.appendChild(text);
}

carregarArtigo();
