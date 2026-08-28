// LOGIN
const loginForm = document.getElementById("loginForm");
const loginArea = document.getElementById("loginArea");
const dashboardArea = document.getElementById("dashboardArea");
const criarArea = document.getElementById("criarArea");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const user = document.getElementById("user").value;
    const pass = document.getElementById("pass").value;

    if (user === "admin" && pass === "benfica") {
        loginArea.classList.add("hidden");
        dashboardArea.classList.remove("hidden");
        carregarNoticiasAdmin();
    } else {
        alert("Credenciais inválidas");
    }
});

// CRIAR NOTÍCIA
document.getElementById("btnCriar").onclick = () => {
    dashboardArea.classList.add("hidden");
    criarArea.classList.remove("hidden");
};

document.getElementById("cancelCriar").onclick = () => {
    criarArea.classList.add("hidden");
    dashboardArea.classList.remove("hidden");
};

document.getElementById("criarForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const novaNoticia = {
        id: Date.now(),
        titulo: document.getElementById("tituloCriar").value,
        categoria: document.getElementById("categoriaCriar").value,
        texto: document.getElementById("textoCriar").value,
        imagem: document.getElementById("imagemCriar").value || "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800"
    };

    // Buscar notícias guardadas ou iniciar array vazio
    let noticias = JSON.parse(localStorage.getItem("infobenfica_noticias")) || [];
    noticias.unshift(novaNoticia); // Adiciona no início
    localStorage.setItem("infobenfica_noticias", JSON.stringify(noticias));

    // Limpar formulário e voltar ao dashboard
    document.getElementById("criarForm").reset();
    criarArea.classList.add("hidden");
    dashboardArea.classList.remove("hidden");
    carregarNoticiasAdmin();
});

// LISTAR NOTÍCIAS NO ADMIN (com opção de apagar)
function carregarNoticiasAdmin() {
    const listaNoticias = document.getElementById("listaNoticias");
    listaNoticias.innerHTML = "";

    let noticias = JSON.parse(localStorage.getItem("infobenfica_noticias")) || [];

    if (noticias.length === 0) {
        listaNoticias.innerHTML = "<p>Sem notícias criadas.</p>";
        return;
    }

    noticias.forEach(noticia => {
        const card = document.createElement("div");
        card.className = "noticia-card";
        card.innerHTML = `
            <h3>${noticia.titulo}</h3>
            <p><b>Categoria:</b> ${noticia.categoria}</p>
            <p>${noticia.texto.substring(0, 80)}...</p>
            <button onclick="apagarNoticia(${noticia.id})" style="background: #cc0000;">Apagar</button>
        `;
        listaNoticias.appendChild(card);
    });
}

// APAGAR NOTÍCIA
window.apagarNoticia = function(id) {
    let noticias = JSON.parse(localStorage.getItem("infobenfica_noticias")) || [];
    noticias = noticias.filter(n => n.id !== id);
    localStorage.setItem("infobenfica_noticias", JSON.stringify(noticias));
    carregarNoticiasAdmin();
};
