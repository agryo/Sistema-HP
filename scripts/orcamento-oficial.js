let valorAlmocoGlobal = 30.0;
let categorias = [
  {
    id: "std_prom",
    nome: "Standard Promocional",
    alta: [154, 121],
    baixa: [130, 89.9],
    cap: 1,
    casal: 0,
    solteiro: 1,
  },
  {
    id: "std_plus",
    nome: "Standard Plus",
    alta: [242, 198],
    baixa: [198, 154],
    cap: 2,
    casal: 1,
    solteiro: 0,
  },
];
let listaItens = [];
let idParaExcluir = null;

function showMsg(titulo, texto, tipo = "sucesso") {
  document.getElementById("msgTitle").innerText = titulo;
  document.getElementById("msgText").innerText = texto;
  document.getElementById("msgIcon").innerText =
    tipo === "sucesso" ? "✅" : "❌";
  document.getElementById("modalMsg").style.display = "block";
}

function fecharModalMsg() {
  document.getElementById("modalMsg").style.display = "none";
}

function carregarConfiguracoes() {
  const precos = localStorage.getItem("plaza_tarifario");
  if (precos) {
    try {
      const parsed = JSON.parse(precos);
      categorias = parsed.t || parsed;
    } catch (err) {
      categorias = [];
    }
  }
  const vAlmoco = localStorage.getItem("plaza_valor_almoco");
  if (vAlmoco) valorAlmocoGlobal = parseFloat(vAlmoco);
}

function adicionarLinha() {
  if (categorias.length === 0) return;
  listaItens.push({
    id: Date.now(),
    catId: categorias[0].id,
    qtd: 1,
    cafe: true,
    almoco: false,
    cargo: "",
  });
  renderizarEdicao();
}

function fecharModalConfirmacao() {
  const modal = document.getElementById("modalConfirmDelete");
  if (modal) modal.style.display = "none";
  idParaExcluir = null;
}

function confirmarExclusao() {
  if (idParaExcluir !== null) {
    listaItens = listaItens.filter((i) => i.id !== idParaExcluir);
    renderizarEdicao();
  }
  fecharModalConfirmacao();
}

function removerLinha(id) {
  idParaExcluir = id;
  const modal = document.getElementById("modalConfirmDelete");
  if (modal) {
    modal.style.display = "block";
  } else {
    // Fallback caso o modal não tenha sido injetado por algum motivo
    if (confirm("Deseja realmente excluir este item?")) {
      listaItens = listaItens.filter((i) => i.id !== id);
      renderizarEdicao();
    }
  }
}

function editar(id, campo, valor) {
  const item = listaItens.find((i) => i.id === id);
  if (item) {
    item[campo] = valor;
    atualizarDoc();
  }
}

function marcarTodos(campo, valor) {
  listaItens.forEach((item) => (item[campo] = valor));
  renderizarEdicao();
}

function renderizarEdicao() {
  const container = document.getElementById("edicaoItens");
  container.innerHTML = listaItens
    .map(
      (item) => `
		<div class="form-row" style="background:#f1f3f4; padding:10px; border-radius:8px; align-items:center; border:1px solid #ddd; margin-bottom:8px;">
			<div style="flex:0.4"><label>Qtd</label><input type="number" class="input-qtd" value="${item.qtd}" min="1" oninput="editar(${item.id}, 'qtd', parseInt(this.value))"></div>
			<div style="flex:2.5"><label>Acomodação</label><select onchange="editar(${item.id}, 'catId', this.value)" style="width:100%">
				${categorias.map((c) => `<option value="${c.id}" ${item.catId == c.id ? "selected" : ""}>${c.nome}</option>`).join("")}
			</select></div>
			<div style="flex:1.5"><label>Função / Equipe</label><input type="text" value="${item.cargo}" oninput="editar(${item.id}, 'cargo', this.value)" style="width:100%"></div>
			<div style="flex:1.2; display:flex; gap:10px; padding-top:18px;">
				<label style="font-size:11px; display:flex; align-items:center;"><input type="checkbox" ${item.cafe ? "checked" : ""} onchange="editar(${item.id}, 'cafe', this.checked)"> Café</label>
				<label style="font-size:11px; display:flex; align-items:center;"><input type="checkbox" ${item.almoco ? "checked" : ""} onchange="editar(${item.id}, 'almoco', this.checked)"> Almoço</label>
			</div>
			<div style="padding-top:18px;"><button class="btn-remover" style="background:#ff4d4d; color:white; border:none; padding:8px; border-radius:4px; cursor:pointer;" onclick="removerLinha(${item.id})">🗑️</button></div>
		</div>
	`,
    )
    .join("");
  atualizarDoc();
}

function formatarCamas(cat) {
  let texto = [];
  if (cat.casal > 0) {
    texto.push(
      cat.casal > 1 ? `${cat.casal} Camas Casal` : `${cat.casal} Cama Casal`,
    );
  }
  if (cat.solteiro > 0) {
    texto.push(
      cat.solteiro > 1
        ? `${cat.solteiro} Camas Solteiro`
        : `${cat.solteiro} Cama Solteiro`,
    );
  }
  return texto.length > 0 ? ` (${texto.join(" + ")})` : "";
}

function atualizarDoc() {
  document.getElementById("docCliente").innerText =
    document.getElementById("clienteNome").value || "Nome do Cliente";
  document.getElementById("obsValorAlmoco").innerText =
    valorAlmocoGlobal.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const d1Input = document.getElementById("dataEntrada").value;
  const d2Input = document.getElementById("dataSaida").value;

  if (!d1Input || !d2Input) return;

  const d1 = new Date(d1Input + "T00:00:00");
  const d2 = new Date(d2Input + "T00:00:00");
  const noites = Math.max(1, Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)));

  document.getElementById("docPeriodo").innerText =
    `${d1.toLocaleDateString("pt-BR")} a ${d2.toLocaleDateString("pt-BR")}`;
  document.getElementById("docNoites").innerText = noites;
  document.getElementById("labelDiaria").innerText =
    noites === 1 ? "diária" : "diárias";
  document.getElementById("checkinData").innerText =
    d1.toLocaleDateString("pt-BR");
  document.getElementById("checkoutData").innerText =
    d2.toLocaleDateString("pt-BR");

  const temp = document.getElementById("temporada").value;
  const tabela = document.getElementById("tabelaCorpo");
  let total = 0;
  tabela.innerHTML = "";

  // Preparação para cálculo misto
  const altaInicioStr = localStorage.getItem("plaza_alta_inicio");
  const altaFimStr = localStorage.getItem("plaza_alta_fim");

  listaItens.forEach((item) => {
    const cat = categorias.find((c) => c.id === item.catId);
    if (!cat) return;

    let somaUnitario = 0;

    if (temp === "auto") {
      // Cálculo dia a dia
      let current = new Date(d1);
      current.setHours(0, 0, 0, 0);
      const end = new Date(d2);
      end.setHours(0, 0, 0, 0);

      while (current < end) {
        let isAlta = false;
        if (altaInicioStr && altaFimStr) {
          const dtAltaIni = new Date(altaInicioStr + "T00:00:00");
          const dtAltaFim = new Date(altaFimStr + "T00:00:00");
          if (current >= dtAltaIni && current <= dtAltaFim) isAlta = true;
        }
        const pDia = isAlta ? cat.alta : cat.baixa;
        somaUnitario += item.cafe ? pDia[0] : pDia[1];
        current.setDate(current.getDate() + 1);
      }
    } else {
      const p = temp === "alta" ? cat.alta : cat.baixa;
      const vDia = item.cafe ? p[0] : p[1];
      somaUnitario = vDia * noites;
    }

    const capEfetiva = cat.grupo === "solteiro" ? 1 : cat.cap;
    // Adiciona almoço (valor fixo por dia * noites)
    if (item.almoco) somaUnitario += valorAlmocoGlobal * capEfetiva * noites;

    const sub = somaUnitario * item.qtd;
    total += sub;

    // Valor médio da diária para exibição na tabela
    const vDiariaMedia = somaUnitario / noites;

    const infoCamas = formatarCamas(cat);

    tabela.innerHTML += `<tr>
			<td>${item.qtd}</td>
			<td><strong>${cat.nome}${infoCamas}</strong>${item.cargo ? "<br><small>• " + item.cargo + "</small>" : ""}</td>
			<td>${(item.cafe ? "Com Café" : "Sem Café") + (item.almoco ? " + Almoço" : "")}</td>
			<td>${vDiariaMedia.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
			<td>${sub.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
		</tr>`;
  });
  document.getElementById("totalGeral").innerText = total.toLocaleString(
    "pt-BR",
    { style: "currency", currency: "BRL" },
  );
}

function exportarOrcamento() {
  const dados = {
    cabecalho: "ORCAMENTO_SALVO_PLAZA",
    cliente: document.getElementById("clienteNome").value,
    temporada: document.getElementById("temporada").value,
    entrada: document.getElementById("dataEntrada").value,
    saida: document.getElementById("dataSaida").value,
    itens: listaItens,
    valorAlmoco: valorAlmocoGlobal,
  };

  const blob = new Blob([JSON.stringify(dados, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download =
    "orcamento_" +
    (dados.cliente.replace(/\s+/g, "_") || "hospedagem") +
    ".json";
  a.click();

  setTimeout(() => {
    showMsg("Orçamento Exportado", "O arquivo foi gerado e salvo com sucesso.");
  }, 500);
}

function importarOrcamento(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);

      // VALIDAÇÃO DA ASSINATURA RIGOROSA
      if (!data || data.cabecalho !== "ORCAMENTO_SALVO_PLAZA") {
        showMsg(
          "Arquivo Inválido",
          "Este arquivo não é um orçamento válido do Hotel Plaza.",
          "erro",
        );
        event.target.value = "";
        return;
      }

      // Captura o estado atual da tela para comparação
      const estadoAtual = {
        cabecalho: "ORCAMENTO_SALVO_PLAZA",
        cliente: document.getElementById("clienteNome").value,
        temporada: document.getElementById("temporada").value,
        entrada: document.getElementById("dataEntrada").value,
        saida: document.getElementById("dataSaida").value,
        itens: listaItens,
        valorAlmoco: valorAlmocoGlobal,
      };

      // Compara se o arquivo é idêntico ao que já está na tela
      if (JSON.stringify(estadoAtual) === JSON.stringify(data)) {
        showMsg(
          "Nenhuma Alteração",
          "O orçamento na tela já é idêntico ao arquivo selecionado.",
        );
      } else {
        // Se for diferente, carrega os dados e restaura
        document.getElementById("clienteNome").value = data.cliente || "";
        document.getElementById("temporada").value = data.temporada || "baixa";
        document.getElementById("dataEntrada").value = data.entrada || "";
        document.getElementById("dataSaida").value = data.saida || "";
        listaItens = data.itens || [];
        renderizarEdicao();
        showMsg("Sucesso!", "O orçamento foi carregado e restaurado.");
      }
    } catch (err) {
      showMsg(
        "Erro de Leitura",
        "O arquivo está corrompido ou não é um formato de orçamento válido.",
        "erro",
      );
    }
    // CORREÇÃO DO BUG: Limpa o input para permitir selecionar o mesmo arquivo novamente
    event.target.value = "";
  };
  reader.readAsText(file);
}

window.onload = () => {
  carregarConfiguracoes();

  // Datas padrão (Hoje e Amanhã)
  const hoje = new Date().toISOString().split("T")[0];
  document.getElementById("dataEntrada").value = hoje;
  const amanha = new Date();
  amanha.setDate(amanha.getDate() + 1);
  document.getElementById("dataSaida").value = amanha
    .toISOString()
    .split("T")[0];

  adicionarLinha();
};
