import { supabase } from './supabase.js';

document.addEventListener("DOMContentLoaded", async () => {
    await carregarNoticias('ultimas');

    // Cliques nas categorias do menu
    document.querySelectorAll('nav a, aside a').forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const cat = e.target.getAttribute('data-cat');
            document.getElementById('tituloCategoria').innerText = e.target.innerText;
            await carregarNoticias(cat);
        });
    });
});

async function carregarNoticias(categoria) {
    const newsGrid = document.getElementById('newsGrid');
    newsGrid.innerHTML = '<p>A carregar notícias...</p>';

    // Certifica-te que a tabela no Supabase se chama 'noticias'
    const { data, error } = await supabase
        .from('noticias')
        .select('*')
        .eq('categoria', categoria)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Erro ao comunicar com o Supabase:', error);
        newsGrid.innerHTML = '<p>Erro ao carregar notícias.</p>';
        return;
    }

    newsGrid.innerHTML = '';
    if (!data || data.length === 0) {
        newsGrid.innerHTML = '<p>Sem notícias nesta categoria.</p>';
        return;
    }

    data.forEach(noticia => {
        const card = document.createElement('div');
        card.classList.add('news-card');
        card.innerHTML = `
            <img src="${noticia.imagem || 'https://via.placeholder.com/300'}" alt="${noticia.titulo}">
            <h3>${noticia.titulo}</h3>
            <p>${noticia.subtitulo || ''}</p>
            <a href="article.html?titulo=${encodeURIComponent(noticia.titulo)}&subtitulo=${encodeURIComponent(noticia.subtitulo || '')}&texto=${encodeURIComponent(noticia.texto)}&imagem=${encodeURIComponent(noticia.imagem || '')}">Ler mais</a>
        `;
        newsGrid.appendChild(card);
    });
}
