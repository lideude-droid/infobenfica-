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

// NOTÍCIAS (agora com imagem)
let noticiasFake = {
    ultimas: [],
    futebol: [],
    modalidades: [],
    clube: [],
    opiniao: []
};

// RECEBER NOTÍCIAS DO ADMIN
window.addEventListener("message", (event) => {
    if (event.data.tipo === "novaNoticia") {
        noticiasFake[event.data.categoria].push(event.data);
        carregarNoticias(event.data.categoria);
    }
});

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

carregarNoticias("ultimas");
