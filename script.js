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
    link.addEventListener("click", () => carregarNoticias(link.dataset.cat));
});

// NOTÍCIAS FALSAS (por agora)
let noticiasFake = {
    ultimas: [
        {
            titulo: "Benfica treina no Seixal",
            texto: "Preparação para o próximo jogo.",
            imagem: "https://source.unsplash.com/random/800x600?football"
        },
        {
            titulo: "Nova contratação a caminho",
            texto: "Jogador chega esta semana.",
            imagem: "https://source.unsplash.com/random/800x600?player"
        }
    ],
    futebol: [],
    modalidades: [],
    clube: [],
    opiniao: []
};

// CARREGAR NOTÍCIAS
function carregarNoticias(categoria = "ultimas") {
    const newsGrid = document.getElementById("newsGrid");
    const tituloCategoria = document.getElementById("tituloCategoria");

    tituloCategoria.innerText = categoria.charAt(0).toUpperCase() + categoria.slice(1);

    newsGrid.innerHTML = "";

    noticiasFake[categoria].forEach(noticia => {
        const card = document.createElement("article");

        card.innerHTML = `
            <img src="${noticia.imagem}" class="noticia-img">
            <h3>${noticia.titulo}</h3>
            <p>${noticia.texto}</p>
        `;

        card.addEventListener("click", () => {
            window.location.href =
                `article.html?titulo=${encodeURIComponent(noticia.titulo)}&texto=${encodeURIComponent(noticia.texto)}&imagem=${encodeURIComponent(noticia.imagem)}`;
        });

        newsGrid.appendChild(card);
    });
}

// CARREGAR INICIAL
carregarNoticias("ultimas");
