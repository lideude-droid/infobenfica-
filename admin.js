// LOGIN
const loginForm = document.getElementById("loginForm");
const loginArea = document.getElementById("loginArea");
const dashboardArea = document.getElementById("dashboardArea");
const criarArea = document.getElementById("criarArea");
const editarArea = document.getElementById("editarArea");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const user = document.getElementById("user").value.trim();
    const pass = document.getElementById("pass").value.trim();

    if (user === "admin" && pass === "benfica") {
        loginArea.classList.add("hidden");
        dashboardArea.classList.remove("hidden");
        renderNoticias();
    } else {
        alert("Credenciais inválidas.");
    }
});

// ARRAY DE NOTÍCIAS (simulação de base de dados)
let noticias = [];
let idCounter = 1;

// MOSTRAR NOTÍCIAS
function renderNoticias() {
    const lista = document.getElementById("listaNoticias");
    lista.innerHTML = "";

    noticias.forEach(n => {
        const div = document.createElement("div");
        div.className = "noticia-card";

        div.innerHTML = `
            <h3>${n.titulo}</h3>
            <p><strong>Categoria:</strong> ${n.categoria}</p>
            <p>${n.texto}</p>
            <button onclick="editarNoticia(${n.id})">Editar</button>
            <button onclick="removerNoticia(${n.id})">Remover</button>
        `;

        lista.appendChild(div);
    });
}

// BOTÃO CRIAR
document.getElementById("btnCriar").addEventListener("click", () => {
    dashboardArea.classList.add("hidden");
    criarArea.classList.remove("hidden");
});

// CANCELAR CRIAÇÃO
document.getElementById("cancelCriar").addEventListener("click", () => {
    criarArea.classList.add("hidden");
    dashboardArea.classList.remove("hidden");
});

// CRIAR NOTÍCIA
document.getElementById("criarForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const titulo = document.getElementById("tituloCriar").value.trim();
    const categoria = document.getElementById("categoriaCriar").value;
    const texto = document.getElementById("textoCriar").value.trim();

    noticias.push({
        id: idCounter++,
        titulo,
        categoria,
        texto
    });

    document.getElementById("criarForm").reset();
    criarArea.classList.add("hidden");
    dashboardArea.classList.remove("hidden");
    renderNoticias();
});

// EDITAR NOTÍCIA
function editarNoticia(id) {
    const noticia = noticias.find(n => n.id === id);

    document.getElementById("editarId").value = noticia.id;
    document.getElementById("tituloEditar").value = noticia.titulo;
    document.getElementById("categoriaEditar").value = noticia.categoria;
    document.getElementById("textoEditar").value = noticia.texto;

    dashboardArea.classList.add("hidden");
    editarArea.classList.remove("hidden");
}

// CANCELAR EDIÇÃO
document.getElementById("cancelEditar").addEventListener("click", () => {
    editarArea.classList.add("hidden");
    dashboardArea.classList.remove("hidden");
});

// GUARDAR ALTERAÇÕES
document.getElementById("editarForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const id = parseInt(document.getElementById("editarId").value);
    const titulo = document.getElementById("tituloEditar").value.trim();
    const categoria = document.getElementById("categoriaEditar").value;
    const texto = document.getElementById("textoEditar").value.trim();

    const noticia = noticias.find(n => n.id === id);
    noticia.titulo = titulo;
    noticia.categoria = categoria;
    noticia.texto = texto;

    editarArea.classList.add("hidden");
    dashboardArea.classList.remove("hidden");
    renderNoticias();
});

// REMOVER NOTÍCIA
function removerNoticia(id) {
    noticias = noticias.filter(n => n.id !== id);
    renderNoticias();
}
