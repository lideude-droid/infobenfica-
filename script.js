import { supabase } from './supabase.js';

document.addEventListener("DOMContentLoaded", async () => {
    await carregarNoticias('ultimas');

    document.querySelectorAll('.menu-desktop a, .mobile-menu a').forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const cat = e.target.getAttribute('data-cat');
            if (!cat) return;
            document.getElementById('tituloCategoria').innerText = e.target.innerText;
            await carregarNoticias(cat);
        });
    });
});

async function carregarNoticias(categoria = "ultimas") {
    const newsGrid = document.getElementById('newsGrid');
    if (!newsGrid) return;
    newsGrid.innerHTML = '<p>A carregar notícias...</p>';

    let query = supabase.from('noticias').select('*');

    if (categoria !== 'ultimas') {
        query = query.eq('categoria', categoria);
    }

    // Usar data_criacao em vez de created_at para corresponder à tabela do Supabase
    const { data, error } = await query.order('data_criacao', { ascending: false });

    if (error) {
        console.error('Erro ao comunicar com o Supabase:', error);
        newsGrid.innerHTML = `<p>Erro ao carregar notícias: ${error.message}</p>`;
        return;
    }

    newsGrid.innerHTML = '';
    if (!data || data.length === 0) {
        newsGrid.innerHTML = '<p>Sem notícias nesta categoria.</p>';
        return;
    }

    data.forEach(noticia => {
        const card = document.createElement('article');
        card.innerHTML = `
            <img src="${noticia.imagem || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800'}" class="noticia-img">
            <h3>${noticia.titulo}</h3>
            ${noticia.subtitulo ? `<h4>${noticia.subtitulo}</h4>` : ''}
            <p>${noticia.texto}</p>
        `;

        card.addEventListener("click", () => {
            window.location.href = `article.html?titulo=${encodeURIComponent(noticia.titulo)}&subtitulo=${encodeURIComponent(noticia.subtitulo || '')}&texto=${encodeURIComponent(noticia.texto)}&imagem=${encodeURIComponent(noticia.imagem || '')}`;
        });

        newsGrid.appendChild(card);
    });
}
