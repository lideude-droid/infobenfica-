// Abrir/fechar menu mobile
const hamburgerBtn = document.getElementById("hamburgerBtn");
const mobileMenu = document.getElementById("mobileMenu");

if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("open");
    });

    document.querySelectorAll(".mobile-menu a").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            mobileMenu.classList.remove("open");
            const cat = link.dataset.cat;
            carregarNoticias(cat);
        });
    });
}

// Ligação das categorias no desktop
document.querySelectorAll(".menu-desktop a").forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const cat = link.dataset.cat;
        carregarNoticias(cat);
    });
});

// Simulação de API de notícias
const noticiasFake = {
    ultimas: [
        { titulo: "Benfica treina no Seixal", texto: "Preparação intensa para o próximo jogo da Liga." },
        { titulo: "Nova contratação a caminho", texto: "Jogador chega esta semana para reforçar o plantel." },
        { titulo: "Direção reúne com equipa técnica", texto: "Planeamento da época e objetivos definidos." }
    ],
    futebol: [
        { titulo: "Benfica vence por 3-0", texto: "Grande exibição das águias com três golos sem resposta." },
        { titulo: "Treinador fala à imprensa", texto: "Confiança total no plantel e foco nos próximos desafios." }
    ],
    modalidades: [
        { titulo: "Basquetebol vence clássico", texto: "Jogo emocionante até ao fim com vitória do Benfica." },
        { titulo: "Hóquei em patins garante triunfo", texto: "Mais uma vitória importante nas modalidades." }
    ],
    clube: [
        { titulo: "Estádio recebe melhorias", texto: "Novos ecrãs LED e melhorias na experiência dos adeptos." },
        { titulo: "Museu do Benfica com nova exposição", texto: "História e troféus em destaque para os visitantes." }
    ],
    opiniao: [
        { titulo: "Comentário da semana", texto: "Análise profunda ao momento atual da equipa." },
        { titulo: "Opinião: reforços necessários?", texto: "Discussão sobre as posições a reforçar no plantel." }
    ]
};

// Carregar notícias por categoria
function carregarNoticias(categoria = "ultimas") {
    const newsGrid = document.getElementById("newsGrid");
    const tituloCategoria = document.getElementById("tituloCategoria");

    if (!newsGrid) return;

    newsGrid.innerHTML = "";

    const lista = noticiasFake[categoria] || [];

    if (tituloCategoria) {
        const nomes = {
            ultimas: "Últimas Notícias",
            futebol: "Futebol",
            modalidades: "Modalidades",
            clube: "Clube",
            opiniao: "Opinião"
        };
        tituloCategoria.innerText = nomes[categoria] || "Notícias";
    }

    lista.forEach(noticia => {
        const card = document.createElement("article");
        card.innerHTML = `
            <h3>${noticia.titulo}</h3>
            <p>${noticia.texto}</p>
        `;
        card.style.cursor = "pointer";

        // Ao clicar, abre página de artigo
        card.addEventListener("click", () => {
            window.location.href = `article.html?titulo=${encodeURIComponent(noticia.titulo)}&texto=${encodeURIComponent(noticia.texto)}`;
        });

        // animação suave
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        newsGrid.appendChild(card);

        setTimeout(() => {
            card.style.transition = "0.4s";
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }, 50);
    });
}

// Carregar categoria inicial
window.addEventListener("DOMContentLoaded", () => {
    carregarNoticias("ultimas");
});
