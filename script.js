// MENU MOBILE
const hamburgerBtn = document.getElementById("hamburgerBtn");
const mobileMenu = document.getElementById("mobileMenu");

hamburgerBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
});

document.querySelectorAll(".mobile-menu a").forEach(link => {
    link.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        carregarNoticias(link.dataset.cat);
    });
});

document.querySelectorAll(".menu-desktop a").forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        carregarNoticias(link.dataset.cat);
    });
});

// CARREGAR NOTÍCIAS DO SUPABASE
async function carregarNoticias(categoria = "ultimas") {
    const newsGrid = document.getElementById("newsGrid");
    const tituloCategoria = document.getElementById("tituloCategoria");

    tituloCategoria.innerText = categoria.charAt(0).toUpperCase() + categoria.slice(1);
    newsGrid.innerHTML = "<p>A carregar notícias...</p>";

    let query = supabase.from("noticias").select("*").order("data_criacao", { ascending: false });

    if (categoria !== "ultimas") {
        query = query.eq("categoria", categoria);
    }

    const { data: noticias, error } = await query;

    if (error) {
        console.error("Erro ao carregar notícias:", error);
        newsGrid.innerHTML = "<p>Erro ao carregar as notícias da base de dados.</p>";
        return;
    }

    newsGrid.innerHTML = "";

    if (!noticias || noticias.length === 0) {
        newsGrid.innerHTML = "<p>Não existem notícias nesta categoria.</p>";
        return;
    }

    noticias.forEach(noticia => {
        const card = document.createElement("article");

        card.innerHTML = `
            <img src="${noticia.imagem || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800'}" class="noticia-img" onerror="this.src='https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800'">
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

// CARREGAR INICIAL
carregarNoticias("ultimas");
