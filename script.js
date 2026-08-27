noticiasFake[categoria].forEach(noticia => {
    const card = document.createElement("article");
    card.innerHTML = `
        <h3>${noticia.titulo}</h3>
        <p>${noticia.texto}</p>
    `;

    // Tornar clicável
    card.style.cursor = "pointer";
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
