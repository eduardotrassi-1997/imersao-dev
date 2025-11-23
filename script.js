let cardContainer = document.querySelector(".card-container");
let allDados = []; // Armazena todos os dados originais
let searchInput = null; // Será inicializado após o DOM carregar

async function IniciarBusca(searchTerm = '') {
    let dadosToRender = allDados;

    // Aplica o filtro se houver um termo de busca não vazio
    if (searchTerm && searchTerm.trim() !== '') {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        dadosToRender = allDados.filter(dado =>
            dado.nome.toLowerCase().includes(lowerCaseSearchTerm) ||
            dado.descricao.toLowerCase().includes(lowerCaseSearchTerm) ||
            (dado.tags && dado.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm))) // Busca nas tags
        );
    }

    // Renderiza os cards filtrados ou todos os cards se a busca estiver vazia
    renderizarCards(dadosToRender);
}

function renderizarCards(dados) {
    cardContainer.innerHTML = ""; // Limpa os cards existentes antes de renderizar novos

    // Remove o item "Todos os Esportes" da lista antes de renderizar
    const dadosFiltrados = dados.filter(dado => dado.nome !== "Todos os Esportes");

    if (dadosFiltrados.length === 0) {
        cardContainer.innerHTML = "<p>Nenhum resultado encontrado.</p>";
        return;
    }

    for (let dado of dadosFiltrados) {
        let article = document.createElement("article");
        article.classList.add("card");
        article.innerHTML = `
        <h2>${dado.nome}</h2>
        <p>${dado.data_criacao}</p>
        <p>${dado.descricao}</p> 
        <a href="${dado.link}" target="_blank">Saiba mais</a>
        `;
        cardContainer.appendChild(article);
    }
}

// Adiciona um listener para carregar os dados e configurar a busca quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", async () => {
    const searchButton = document.getElementById("botao-busca");
    searchInput = document.getElementById("searchInput");

    // Carrega os dados iniciais
    let resposta = await fetch("data.json");
    allDados = await resposta.json();
    
    // Garante que a tela comece em branco
    cardContainer.innerHTML = "";

    if (searchInput && searchButton) {
        // Aciona a busca quando o botão for clicado
        searchButton.addEventListener("click", () => IniciarBusca(searchInput.value));

    } else {
        console.warn("Elemento com ID 'searchInput' não encontrado. A funcionalidade de busca não estará disponível.");
    }
});
