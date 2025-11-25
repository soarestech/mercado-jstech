// ===============================
// app.js para outras páginas.html
// ===============================

document.addEventListener('DOMContentLoaded', () => {

  // ---------------- Variáveis ----------------
  const mercadoInput = document.getElementById('mercado');
  const produtoInput = document.getElementById('produto');
  const embalagemSelect = document.getElementById('embalagem');
  const valorInput = document.getElementById('valor');
  const lista = document.getElementById('produtosList'); // tbody da tabela
  const adicionarBtn = document.getElementById('adicionar');
  const apagarTudoBtn = document.getElementById('apagarTudo');
  const salvarListaBtn = document.getElementById('salvarLista');
  const exportarBtn = document.getElementById('exportarTXT');
  const listasContainer = document.getElementById('listasContainer');
  const nomeMercadoAtual = document.getElementById('nomeMercadoAtual');

  let produtos = [];
  let indiceEdicao = null;

  // ---------------- Funções ----------------
  function atualizarLista() {
    if (!lista) return;
    lista.innerHTML = '';
    produtos.forEach((p, i) => {
      const row = document.createElement('tr');

      row.innerHTML = `
        <td>${p.nome}</td>
        <td>${p.embalagem}</td>
        <td class="${p.cor === 'green' ? 'valor-verde' : p.cor === 'red' ? 'valor-vermelho' : ''}">${p.valor.toFixed(2)}</td>
      `;

      // Editar produto ao clicar na linha
      row.addEventListener('click', () => {
        produtoInput.value = p.nome;
        embalagemSelect.value = p.embalagem;
        valorInput.value = p.valor.toFixed(2);
        indiceEdicao = i;

        adicionarBtn.textContent = 'Atualizar';
        adicionarBtn.classList.remove('green');
        adicionarBtn.classList.add('orange');

        lista.querySelectorAll('tr').forEach(tr => tr.classList.remove('editando'));
        row.classList.add('editando');
      });

      lista.appendChild(row);
    });
  }

  function atualizarNomeMercado() {
    nomeMercadoAtual.textContent = mercadoInput.value.trim() ? `— ${mercadoInput.value.trim()}` : '';
  }

  // ---------------- Eventos ----------------
  if (adicionarBtn) {
    adicionarBtn.addEventListener('click', () => {
      const nome = produtoInput.value.trim();
      const embalagem = embalagemSelect.value;
      const valor = parseFloat(valorInput.value);

      if (!nome || !embalagem || isNaN(valor)) {
        Swal.fire('Preencha todos os campos corretamente!');
        return;
      }

      if (indiceEdicao !== null) {
        // Atualizar existente
        const valorAntigo = produtos[indiceEdicao].valor;
        let cor = null;
        if (valor < valorAntigo) cor = 'green';
        else if (valor > valorAntigo) cor = 'red';
        else cor = produtos[indiceEdicao].cor || null;

        produtos[indiceEdicao] = { nome, embalagem, valor, cor };
        indiceEdicao = null;
        adicionarBtn.textContent = 'Adicionar';
        adicionarBtn.classList.remove('orange');
        adicionarBtn.classList.add('green');
      } else {
        // Novo produto
        produtos.push({ nome, embalagem, valor, cor: null });
      }

      produtoInput.value = '';
      embalagemSelect.selectedIndex = 0;
      valorInput.value = '';
      atualizarLista();
      lista.querySelectorAll('tr').forEach(tr => tr.classList.remove('editando'));
      atualizarNomeMercado();
    });
  }

  if (apagarTudoBtn) {
    apagarTudoBtn.addEventListener('click', () => {
      produtos = [];
      atualizarLista();
      mercadoInput.value = '';
      produtoInput.value = '';
      embalagemSelect.selectedIndex = 0;
      valorInput.value = '';
      indiceEdicao = null;
      adicionarBtn.textContent = 'Adicionar';
      adicionarBtn.classList.remove('orange');
      adicionarBtn.classList.add('green');
      atualizarNomeMercado();
      Swal.fire('Lista limpa!');
    });
  }

  if (salvarListaBtn) {
    salvarListaBtn.addEventListener('click', () => {
      const mercado = mercadoInput.value.trim();
      if (!mercado || produtos.length === 0) {
        Swal.fire('Preencha o nome do mercado e adicione produtos!');
        return;
      }

      const dataStr = new Date().toLocaleString('pt-BR');
      let listasSalvas = JSON.parse(localStorage.getItem('listasDeCompras') || '[]');

      const indiceExistente = listasSalvas.findIndex(l => l.mercado.toLowerCase() === mercado.toLowerCase());

      if (indiceExistente >= 0) {
        listasSalvas[indiceExistente].produtos = produtos;
        listasSalvas[indiceExistente].data = dataStr;
      } else {
        listasSalvas.push({ mercado, data: dataStr, produtos });
      }

      localStorage.setItem('listasDeCompras', JSON.stringify(listasSalvas));

      produtos = [];
      atualizarLista();
      mercadoInput.value = '';
      produtoInput.value = '';
      embalagemSelect.selectedIndex = 0;
      valorInput.value = '';
      indiceEdicao = null;
      adicionarBtn.textContent = 'Adicionar';
      adicionarBtn.classList.remove('orange');
      adicionarBtn.classList.add('green');
      atualizarNomeMercado();
      renderizarListasSalvas();
      Swal.fire('Lista salva com sucesso!');
    });
  }

  function renderizarListasSalvas() {
    if (!listasContainer) return;
    const listasSalvas = JSON.parse(localStorage.getItem('listasDeCompras') || '[]');
    listasContainer.innerHTML = '';

    if (listasSalvas.length === 0) {
      listasContainer.innerHTML = '<p class="grey-text">Nenhuma lista salva.</p>';
      return;
    }

    listasSalvas.forEach((l, i) => {
      const div = document.createElement('div');
      div.classList.add('lista-card');
      div.innerHTML = `
        <span class="lista-info">${l.mercado} | ${l.data}</span>
        <div class="lista-botoes">
          <button class="btn green small" onclick="abrirLista(${i})">ABRIR</button>
        </div>
      `;
      listasContainer.appendChild(div);
    });
  }

  window.abrirLista = (index) => {
    const listasSalvas = JSON.parse(localStorage.getItem('listasDeCompras') || '[]');
    const listaSelecionada = listasSalvas[index];
    if (!listaSelecionada) return;

    produtos = listaSelecionada.produtos.map(p => ({
      nome: p.nome,
      embalagem: p.embalagem,
      valor: parseFloat(p.valor),
      cor: p.cor || null
    }));

    mercadoInput.value = listaSelecionada.mercado;
    atualizarLista();
    atualizarNomeMercado();
  };

  renderizarListasSalvas();

  // ---------------- Exportar TXT ----------------
  if (exportarBtn) {
    exportarBtn.addEventListener('click', () => {
      const listas = JSON.parse(localStorage.getItem('listasDeCompras') || '[]');
      if (listas.length === 0) {
        Swal.fire('Nenhuma lista salva!');
        return;
      }

      let conteudo = '=== RELATÓRIO DE LISTAS SALVAS ===\n\n';
      listas.forEach(l => {
        conteudo += `MERCADO: ${l.mercado}    DATA: ${l.data}\n`;
        conteudo += 'Produto'.padEnd(25) + 'Embalagem'.padEnd(18) + 'Valor (R$)\n';
        (l.produtos || []).forEach(p => {
          conteudo += (p.nome || '').padEnd(25) + (p.embalagem || '').padEnd(18) + p.valor.toFixed(2).padEnd(10) + '\n';
        });
        conteudo += '\n======================================================\n\n';
      });

      const blob = new Blob([conteudo], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'listas_salvas.txt';
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  // ---------------- BottomTabs ----------------
  const bottomTabs = document.getElementById('bottomTabs');
  if (bottomTabs) {
    bottomTabs.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const page = btn.dataset.page;
        bottomTabs.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        window.location.href = page + '.html';
      });
    });
  }

});
