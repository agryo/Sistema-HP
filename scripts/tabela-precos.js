function carregarDados() {
  const salvos = localStorage.getItem("plaza_tarifario");
  if (!salvos) return [];
  try {
    const parsed = JSON.parse(salvos);
    return parsed.t || parsed;
  } catch (err) {
    return [];
  }
}

function gerarTabela(temporada) {
  const categorias = carregarDados();
  const container = document.getElementById("conteudo-tabela");
  const titulo = document.getElementById("titulo-temporada");

  titulo.innerText =
    "TABELA DE PREÇOS " +
    (temporada === "alta" ? "ALTA" : "BAIXA") +
    " TEMPORADA";
  titulo.className = temporada === "alta" ? "titulo-alta" : "titulo-baixa";
  container.innerHTML = "";

  if (categorias.length === 0) {
    container.innerHTML =
      "<p style='text-align:center'>Nenhum dado encontrado no sistema.</p>";
    return;
  }

  let todasComUhs = categorias.filter(
    (c) => c.numeros_uhs && c.numeros_uhs.length > 0,
  );
  let grupos = [];
  let processadosIds = new Set();

  todasComUhs.forEach((cat) => {
    if (processadosIds.has(cat.id)) return;
    const catNums = Array.isArray(cat.numeros_uhs)
      ? [...cat.numeros_uhs].sort()
      : [];
    let mesmoGrupo = todasComUhs.filter((c) => {
      const cNums = Array.isArray(c.numeros_uhs)
        ? [...c.numeros_uhs].sort()
        : [];
      return JSON.stringify(cNums) === JSON.stringify(catNums);
    });
    mesmoGrupo.forEach((m) => processadosIds.add(m.id));

    let prioridade = 3;
    const nomeLower = (cat.nome || "").toLowerCase();
    const temCasal = (cat.casal || 0) > 0;

    if (
      nomeLower.includes("master") ||
      nomeLower.includes("deluxe") ||
      (temCasal && !nomeLower.includes("superior"))
    ) {
      prioridade = 1;
    } else if (mesmoGrupo.length > 1) {
      prioridade = 2;
    }
    grupos.push({
      prioridade: prioridade,
      uhs: catNums.join(", "),
      itens: mesmoGrupo,
    });
  });

  grupos.sort((a, b) => a.prioridade - b.prioridade);

  grupos.forEach((grupo) => {
    const principal = grupo.itens[0];
    let htmlBloco = `
			<div class="bloco-categoria">
				<div class="numero-uh-topo">${grupo.uhs}</div>
				<div class="conteudo-detalhes">
					<div class="titulo-uh">${principal.nome.split("(")[0].replace("Casal", "").replace("1 Pessoa", "").toUpperCase().trim()}</div>
					<div class="comodidades-gerais">${(principal.comodidades || []).join(", ")}</div>
		`;

    grupo.itens.forEach((sub) => {
      const preco = temporada === "alta" ? sub.alta : sub.baixa;
      const v1 = preco[0].toFixed(2).replace(".", ",");
      const v2 = preco[1].toFixed(2).replace(".", ",");

      let camas = [];
      if (sub.casal > 0) camas.push(sub.casal + " Cama de Casal");
      if (sub.solteiro > 0) camas.push(sub.solteiro + " Cama de Solteiro");

      let label = "";
      if (grupo.itens.length > 1) {
        const n = sub.nome.toLowerCase();
        if (n.includes("pessoa") || n.includes("single") || n.includes("1")) {
          label = " (1 Pessoa)";
        } else {
          label = " (Casal ou adulto com criança)";
        }
      }

      // Regra exclusiva Suíte Deluxe na Alta Temporada
      let htmlPrecoSemCafe = ` - <span class="sem-cafe">R$ ${v2} Sem Café.</span>`;
      if (temporada === "alta" && sub.nome.toLowerCase().includes("deluxe")) {
        htmlPrecoSemCafe = "";
      }

      htmlBloco += `
				<div class="item-preco-linha">
					<span class="desc-especifica">${camas.join(" e ")} - ${sub.desc || ""}</span><br>
					<span class="preco-texto">
						R$ ${v1}${htmlPrecoSemCafe}
						<span style="font-weight:normal; font-size:12px;">${label}</span>
					</span>
				</div>
			`;
    });

    htmlBloco += `</div></div>`;
    container.innerHTML += htmlBloco;
  });
}

window.onload = () => gerarTabela("baixa");
