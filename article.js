import { supabase } from './supabase.js';

const container = document.getElementById('articleContainer');
const id = new URLSearchParams(window.location.search).get('id');

function escapeText(value) {
    return value == null ? '' : String(value);
}

async function carregarArtigo() {
    if (!id) {
        container.innerHTML = '<p>Notícia não encontrada.</p>';
        return;
    }

    const { data, error } = await supabase
        .from('noticias')
        .select('id,titulo,subtitulo,texto,imagem,categoria,data_criacao')
        .eq('id', id)
        .single();

    if (error || !data) {
        console.error(error);
        container.innerHTML = '<p>Não foi possível carregar a notícia.</p>';
        return;
    }

    document.title = `${escapeText(data.titulo)} - Infobenfica`;

    container.replaceChildren();

    if (data.imagem) {
        const img = document.createElement('img');
        img.className = 'noticia-img artigo-imagem';
        img.src = data.imagem;
        img.alt = escapeText(data.titulo);
        img.loading = 'eager';
        img.onerror = () => img.remove();
        container.appendChild(img);
    }

    const h1 = document.createElement('h1');
    h1.textContent = escapeText(data.titulo);
    container.appendChild(h1);

    if (data.subtitulo) {
        const h2 = document.createElement('h2');
        h2.className = 'artigo-subtitulo';
        h2.textContent = escapeText(data.subtitulo);
        container.appendChild(h2);
    }

    if (data.data_criacao) {
        const date = new Date(data.data_criacao);
        if (!Number.isNaN(date.getTime())) {
            const time = document.createElement('time');
            time.dateTime = data.data_criacao;
            time.textContent = date.toLocaleString('pt-PT', {
                dateStyle: 'medium',
                timeStyle: 'short'
            });
            container.appendChild(time);
        }
    }

    const hr = document.createElement('hr');
    container.appendChild(hr);

    const p = document.createElement('p');
    p.className = 'artigo-texto';
    p.textContent = escapeText(data.texto);
    container.appendChild(p);
}

carregarArtigo();
