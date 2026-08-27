// LOGIN
const loginForm = document.getElementById("loginForm");
const loginArea = document.getElementById("loginArea");
const dashboardArea = document.getElementById("dashboardArea");
const criarArea = document.getElementById("criarArea");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (user.value === "admin" && pass.value === "benfica") {
        loginArea.classList.add("hidden");
        dashboardArea.classList.remove("hidden");
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

    const noticia = {
        tipo: "novaNoticia",
        titulo: tituloCriar.value,
        categoria: categoriaCriar.value,
        texto: textoCriar.value,
        imagem: imagemCriar.value
    };

    window.opener.postMessage(noticia);

    criarArea.classList.add("hidden");
    dashboardArea.classList.remove("hidden");
});
