let cardContainer = document.querySelector(".card-container");
let allDados = []; // Armazena todos os dados originais

// Assume que existe um input com id="searchInput" no seu HTML
let searchInput = null; // Será inicializado após o DOM carregar

async function IniciarBusca(searchTerm = '') { // Adiciona um parâmetro opcional para o termo de busca
    // Busca os dados apenas uma vez, se ainda não foram carregados
    if (allDados.length === 0) {
        let resposta = await fetch("data.json");
        allDados = await resposta.json();
    }

    let dadosToRender = allDados;

    // Aplica o filtro se houver um termo de busca
    if (searchTerm && searchTerm.trim() !== '') {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        dadosToRender = allDados.filter(dado =>
            dado.nome.toLowerCase().includes(lowerCaseSearchTerm) || // Busca no nome
            dado.descricao.toLowerCase().includes(lowerCaseSearchTerm) || // Busca na descrição (corrigido)
            (dado.tags && dado.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm))) // Busca nas tags
        );
    }

    // Só renderiza os cards se houver um termo de busca. Caso contrário, limpa a tela.
    const shouldRender = searchTerm && searchTerm.trim() !== '';
    renderizarCards(shouldRender ? dadosToRender : []);
}

function renderizarCards(dados) {
    cardContainer.innerHTML = ""; // Limpa os cards existentes antes de renderizar novos

    if (dados.length === 0) {
        cardContainer.innerHTML = "<p>Nenhum resultado encontrado.</p>";
        return;
    }

    for (let dado of dados) {
        let article = document.createElement("article");
        article.classList.add("card");
        article.innerHTML = `
        <h2>${dado.nome}</h2>
        <p>${dado.data_criacao}</p>
        <p>${dado.descricao}</p> 
        <a href="${dado.link}" target="_blank">Saiba mais</a>
        `; // Adicionado ponto e vírgula para consistência
        cardContainer.appendChild(article);
    }
}

// Adiciona um listener para carregar os dados e configurar a busca quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("botao-busca");
    searchInput = document.getElementById("searchInput");

    if (searchInput && searchButton) {
        // Aciona a busca quando o botão for clicado
        searchButton.addEventListener("click", () => IniciarBusca(searchInput.value));

    } else {
        console.warn("Elemento com ID 'searchInput' não encontrado. A funcionalidade de busca não estará disponível.");
    }
    // Apenas carrega os dados em segundo plano, sem renderizar nada na tela.
    // A renderização ocorrerá apenas quando o usuário digitar no campo de busca.
    (async () => {
        let resposta = await fetch("data.json");
        allDados = await resposta.json();
    })();
});
