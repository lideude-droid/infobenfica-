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

document.getElementById("criarForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const novaNoticia = {
        titulo: document.getElementById("tituloCriar").value,
        subtitulo: document.getElementById("subtituloCriar") ? document.getElementById("subtituloCriar").value : "",
        categoria: document.getElementById("categoriaCriar").value,
        texto: document.getElementById("textoCriar").value,
        imagem: document.getElementById("imagemCriar").value || "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800"
    };

    const { error } = await supabase.from("noticias").insert([novaNoticia]);

    if (error) {
        console.error("Erro ao guardar notícia:", error);
        alert("Erro ao guardar a notícia na base de dados.");
        return;
    }

    alert("Notícia criada com sucesso!");
    document.getElementById("criarForm").reset();
    criarArea.classList.add("hidden");
    dashboardArea.classList.remove("hidden");
    carregarNoticiasAdmin();
});

// LISTAR NOTÍCIAS NO ADMIN
async function carregarNoticiasAdmin() {
    const listaNoticias = document.getElementById("listaNoticias");
    listaNoticias.innerHTML = "<p>A carregar...</p>";

    const { data: noticias, error } = await supabase
        .from("noticias")
        .select("*")
        .order("data_criacao", { ascending: false });

    if (error) {
        listaNoticias.innerHTML = "<p>Erro ao carregar notícias.</p>";
        return;
    }

    if (!noticias || noticias.length === 0) {
        listaNoticias.innerHTML = "<p>Sem notícias criadas.</p>";
        return;
    }

    listaNoticias.innerHTML = "";

    noticias.forEach(noticia => {
        const card = document.createElement("div");
        card.className = "noticia-card";
        card.innerHTML = `
            <h3>${noticia.titulo}</h3>
            <p><b>Categoria:</b> ${noticia.categoria}</p>
            <p>${noticia.texto.substring(0, 80)}...</p>
            <button onclick="apagarNoticia(${noticia.id})" style="background: #cc0000; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer;">Apagar</button>
        `;
        listaNoticias.appendChild(card);
    });
}

// APAGAR NOTÍCIA
window.apagarNoticia = async function(id) {
    if (!confirm("Tens a certeza que pretendes apagar esta notícia?")) return;

    const { error } = await supabase.from("noticias").delete().eq("id", id);

    if (error) {
        alert("Erro ao apagar a notícia.");
        console.error(error);
        return;
    }

    carregarNoticiasAdmin();
};
