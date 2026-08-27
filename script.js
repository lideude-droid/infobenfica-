// Abrir/fechar menu mobile
const hamburgerBtn = document.getElementById("hamburgerBtn");
const mobileMenu = document.getElementById("mobileMenu");

hamburgerBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
});

// Fechar menu ao clicar numa categoria
document.querySelectorAll(".mobile-menu a").forEach(link => {
    link.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        carregarNoticias(link.dataset.cat);
    });
});

// Ligação das categorias no desktop
document.querySelectorAll(".menu-desktop a").forEach(link => {
    link.addEventListener("click", () => {
        carregarNoticias(link.dataset.cat);
    });
});

// --- Sistema de carregamento de notícias (simulação de back-end) ---
function carregarNoticias(categoria) {

    const newsGrid = document.getElementById("newsGrid");
    newsGrid.innerHTML = ""; // limpar

    // Simulação de API (podes substituir por fetch)
    const noticiasFake = {
        ultimas: [
            { titulo: "Benfica treina no Seixal", texto: "Preparação para o próximo jogo." },
            { titulo: "Nova contratação a caminho", texto: "Jogador chega esta semana." }
        ],
        futebol: [
            { titulo: "Benfica vence por 3-0", texto: "Grande exibição das águias." },
            { titulo: "Treinador fala à imprensa", texto: "Confiança total no plantel." }
        ],
        modalidades: [
            { titulo: "Basquetebol vence clássico", texto: "Jogo emocionante até ao fim." }
        ],
        clube: [
            { titulo: "Estádio recebe melhorias", texto: "Novos ecrãs LED instalados." }
        ],
        opiniao: [
            { titulo: "Comentário da semana", texto: "Análise profunda ao momento da equipa." }
        ]
    };

    noticiasFake[categoria].forEach(noticia => {
        const card = document.createElement("article");
        card.innerHTML = `
            <h3>${noticia.titulo}</h3>
            <p>${noticia.texto}</p>
        `;
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        newsGrid.appendChild(card);

        // animação suave
        setTimeout(() => {
            card.style.transition = "0.4s";
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }, 50);
    });
}
