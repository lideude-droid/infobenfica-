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

// NOTÍCIAS INICIAIS (Caso o localStorage esteja vazio)
const noticiasIniciaisDefault = [
    {
        id: 1,
        titulo: "Benfica treina no Seixal",
        categoria: "ultimas",
        texto: "Preparação intensa para o próximo jogo do campeonato.",
        imagem: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800"
    },
    {
        id: 2,
        titulo: "Vitória importante nas modalidades",
        categoria: "modalidades",
        texto: "Equipa de rinque-hocque/futsal conquista triunfo fora de portas.",
        imagem: "https://images.unsplash.com/photo-1517649763962-0c6232660102?w=800"
    }
];

// Inicializar localStorage se estiver vazio
if (!localStorage.getItem("infobenfica_noticias")) {
    localStorage.setItem("infobenfica_noticias", JSON.stringify(noticiasIniciaisDefault));
}

// CARREGAR NOTÍCIAS
function carregarNoticias(categoria = "ultimas") {
    const newsGrid = document.getElementById("newsGrid");
    const tituloCategoria = document.getElementById("tituloCategoria");

    tituloCategoria.innerText = categoria.charAt(0).toUpperCase() + categoria.slice(1);
    newsGrid.innerHTML = "";

    const todasNoticias = JSON.parse(localStorage.getItem("infobenfica_noticias")) || [];
    
    // Filtrar por categoria (se escolher 'ultimas', mostra todas ou as marcadas como ultimas)
    const filtradas = categoria === "ultimas" 
        ? todasNoticias 
        : todasNoticias.filter(n => n.categoria === categoria);

    if (filtradas.length === 0) {
        newsGrid.innerHTML = "<p>Não existem notícias nesta categoria.</p>";
        return;
    }

    filtradas.forEach(noticia => {
        const card = document.createElement("article");

        card.innerHTML = `
            <img src="${noticia.imagem}" class="noticia-img" onerror="this.src='https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800'">
            <h3>${noticia.titulo}</h3>
            <p>${noticia.texto}</p>
        `;

        card.addEventListener("click", () => {
            window.location.href = `article.html?titulo=${encodeURIComponent(noticia.titulo)}&texto=${encodeURIComponent(noticia.texto)}&imagem=${encodeURIComponent(noticia.imagem)}`;
        });

        newsGrid.appendChild(card);
    });
}

// CARREGAR INICIAL
carregarNoticias("ultimas");
