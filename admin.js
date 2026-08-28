import { supabase } from './supabase.js';

document.getElementById('criarForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const titulo = document.getElementById('tituloCriar').value;
    const subtitulo = document.getElementById('subtituloCriar').value;
    const categoria = document.getElementById('categoriaCriar').value;
    const texto = document.getElementById('textoCriar').value;
    const imagem = document.getElementById('imagemCriar').value;

    const { data, error } = await supabase
        .from('noticias')
        .insert([{ titulo, subtitulo, categoria, texto, imagem }]);

    if (error) {
        console.error('Erro ao inserir:', error);
        alert('Erro ao guardar notícia: ' + error.message);
    } else {
        alert('Notícia guardada com sucesso!');
        document.getElementById('criarForm').reset();
    }
});
