// Login simples (por agora hardcoded)
const loginForm = document.getElementById("loginForm");
const loginArea = document.getElementById("loginArea");
const newsArea = document.getElementById("newsArea");
const statusMsg = document.getElementById("statusMsg");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const user = document.getElementById("user").value.trim();
    const pass = document.getElementById("pass").value.trim();

    // Credenciais temporárias
    if (user === "admin" && pass === "benfica") {
        loginArea.classList.add("hidden");
        newsArea.classList.remove("hidden");
    } else {
        alert("Credenciais inválidas.");
    }
});

// Form de criação de notícias
const newsForm = document.getElementById("newsForm");

newsForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const titulo = document.getElementById("titulo").value.trim();
    const categoria = document.getElementById("categoria").value;
    const texto = document.getElementById("texto").value.trim();

    const novaNoticia = {
        titulo,
        categoria,
        texto
    };

    // Aqui é onde ligas ao teu back-end / API real
    // Exemplo de chamada:
    try {
        statusMsg.innerText = "A enviar notícia para o servidor...";

        // SUBSTITUI ESTA URL PELO TEU ENDPOINT REAL
        const response = await fetch("https://api.teu-servidor.com/noticias", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(novaNoticia)
        });

        if (!response.ok) {
            throw new Error("Erro ao guardar notícia");
        }

        statusMsg.innerText = "Notícia guardada com sucesso!";

        newsForm.reset();
    } catch (err) {
        console.error(err);
        statusMsg.innerText = "Falha ao guardar notícia. Verifica a API.";
    }
});
