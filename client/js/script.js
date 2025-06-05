// ... código anterior ...

// Função para aplicar filtros
function aplicarFiltros() {
    const categoria = document.getElementById('filtro-categoria').value;
    const precoMin = document.getElementById('filtro-preco-min').value;
    const precoMax = document.getElementById('filtro-preco-max').value;
    const ordenar = document.getElementById('filtro-ordenar').value;
    
    const params = new URLSearchParams();
    if (categoria) params.append('categoria', categoria);
    if (precoMin) params.append('precoMin', precoMin);
    if (precoMax) params.append('precoMax', precoMax);
    if (ordenar) params.append('ordenar', ordenar);
    
    fetch(`/api/produtos?${params.toString()}`)
        .then(response => response.json())
        .then(produtos => {
            const produtosGrid = document.querySelector('.produtos-grid');
            produtosGrid.innerHTML = '';
            
            if (produtos.length === 0) {
                produtosGrid.innerHTML = '<p class="sem-resultados">Nenhum produto encontrado com esses filtros.</p>';
                return;
            }
            
            produtos.forEach(produto => {
                const produtoHTML = `
                    <div class="produto-card" data-id="${produto._id}">
                        <div class="produto-img">
                            <img src="${produto.imagens[0]}" alt="${produto.nome}">
                        </div>
                        <div class="produto-info">
                            <h3>${produto.nome}</h3>
                            <p>${produto.descricao.substring(0, 100)}...</p>
                            <span class="produto-preco">R$ ${produto.preco.toFixed(2)}</span>
                            <button class="btn add-to-cart">Adicionar ao Carrinho</button>
                            <a href="produto.html?id=${produto._id}" class="btn btn-secundario">Ver Detalhes</a>
                        </div>
                    </div>
                `;
                produtosGrid.insertAdjacentHTML('beforeend', produtoHTML);
            });
            
            // Adiciona eventos aos botões
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', function() {
                    const produtoId = this.closest('.produto-card').getAttribute('data-id');
                    adicionarAoCarrinho(produtoId);
                });
            });
        });
}

// Função para buscar produtos
function buscarProdutos() {
    const termoBusca = document.getElementById('busca-input').value.trim();
    
    if (termoBusca) {
        fetch(`/api/produtos?busca=${encodeURIComponent(termoBusca)}`)
            .then(response => response.json())
            .then(produtos => {
                // Mesma lógica de exibição dos produtos que em aplicarFiltros()
            });
    }
}

// Event listeners para filtros e busca
document.getElementById('filtro-aplicar').addEventListener('click', aplicarFiltros);
document.getElementById('busca-botao').addEventListener('click', buscarProdutos);
document.getElementById('busca-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') buscarProdutos();
});

// Carregar categorias para filtro
function carregarCategorias() {
    fetch('/api/produtos/categorias')
        .then(response => response.json())
        .then(categorias => {
            const select = document.getElementById('filtro-categoria');
            categorias.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria;
                option.textContent = categoria;
                select.appendChild(option);
            });
        });
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    carregarCategorias();
    carregarProdutos();
    
    // Verificar se há um termo de busca na URL
    const urlParams = new URLSearchParams(window.location.search);
    const buscaParam = urlParams.get('busca');
    
    if (buscaParam) {
        document.getElementById('busca-input').value = buscaParam;
        buscarProdutos();
    }
});