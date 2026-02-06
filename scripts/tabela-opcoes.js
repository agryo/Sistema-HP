let categorias = [];
let valorAlmocoGlobal = 0;

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

function carregar() {
  const salvo = localStorage.getItem("plaza_tarifario");

  // PUXA O VALOR DO ALMOÇO DO INDEX IGUAL NO OR.HTML
  const almocoSalvo = localStorage.getItem("plaza_valor_almoco");
  valorAlmocoGlobal = almocoSalvo ? parseFloat(almocoSalvo) : 0;

  if (salvo) {
    const parsed = JSON.parse(salvo);
    categorias = parsed.t || parsed;
  }

  renderizarCheckboxes();
  document.getElementById("ent").value = new Date().toISOString().split("T")[0];
  const am = new Date();
  am.setDate(am.getDate() + 1);
  document.getElementById("sai").value = am.toISOString().split("T")[0];
  gerar();
}

function renderizarCheckboxes() {
  const solDiv = document.getElementById("listaSolteiros");
  const casDiv = document.getElementById("listaCasais");
  solDiv.innerHTML = "";
  casDiv.innerHTML = "";

  categorias.forEach((q) => {
    // Respeita `q.grupo` quando definido (manual). Caso contrário, infere com regras:
    // - Se tiver 3 ou mais camas solteiro e nenhuma cama casal -> 'solteiro' (ex.: triplo com 3 camas solteiro)
    // - Se tiver pelo menos 1 cama casal e pelo menos 1 cama solteiro -> 'casal' (familia)
    // - Se tiver cama casal -> 'casal'
    // - Senão -> 'solteiro'
    let grupoFinal;
    if (q.grupo) {
      grupoFinal = q.grupo;
    } else if ((q.solteiro || 0) >= 3 && (q.casal || 0) === 0) {
      grupoFinal = "solteiro";
    } else if ((q.casal || 0) >= 1 && (q.solteiro || 0) >= 1) {
      grupoFinal = "casal"; // familiar -> exibido na coluna casal/família
    } else if ((q.casal || 0) > 0) {
      grupoFinal = "casal";
    } else {
      grupoFinal = "solteiro";
    }

    const html = `<label class="item-quarto"><input type="checkbox" class="chk-quarto" data-grupo="${grupoFinal}" value="${q.id}" onchange="atualizarInterface()"> ${q.nome}</label>`;

    if (grupoFinal === "casal") casDiv.innerHTML += html;
    else solDiv.innerHTML += html;
  });
}

function toggleGrupo(grupo) {
  const chks = document.querySelectorAll(`.chk-quarto[data-grupo="${grupo}"]`);
  const todos = Array.from(chks).every((c) => c.checked);
  chks.forEach((c) => (c.checked = !todos));
  atualizarInterface();
}

function atualizarInterface() {
  ["solteiro", "casal"].forEach((g) => {
    const chks = document.querySelectorAll(`.chk-quarto[data-grupo="${g}"]`);
    const btn = document.getElementById(`btn-${g}`);
    if (chks.length > 0)
      btn.innerHTML = Array.from(chks).every((c) => c.checked)
        ? "⬜ Desmarcar Todos"
        : "☑️ Marcar Todos";
  });
  gerar();
}

function formatarCamas(q) {
  let p = [];
  if (q.casal > 0) p.push(`${q.casal} Cama${q.casal > 1 ? "s" : ""} Casal`);
  if (q.solteiro > 0)
    p.push(`${q.solteiro} Cama${q.solteiro > 1 ? "s" : ""} Solteiro`);
  return p.join(" + ");
}

function gerar() {
  const previaElement = document.getElementById("previa");
  previaElement.innerText = "";

  const d1Value = document.getElementById("ent").value;
  const d2Value = document.getElementById("sai").value;
  if (!d1Value || !d2Value) return;

  const d1 = new Date(d1Value + "T00:00:00");
  const d2 = new Date(d2Value + "T00:00:00");
  const t = document.getElementById("temp").value;
  const noites = Math.max(1, Math.ceil((d2 - d1) / 86400000));

  const selecionados = Array.from(
    document.querySelectorAll(".chk-quarto:checked"),
  ).map((cb) => categorias.find((c) => c.id === cb.value));

  if (selecionados.length === 0) {
    previaElement.innerText = "Selecione as acomodações...";
    return;
  }

  let texto = `*ORÇAMENTO DE HOSPEDAGEM*\n🏨 *Hotel Plaza - Cruzeta/RN*\n\n📅 *Período:* ${d1.toLocaleDateString("pt-BR")} a ${d2.toLocaleDateString("pt-BR")}\n🌙 *Duração:* ${noites} diária(s)\n\n--- *OPÇÕES DE ACOMODAÇÃO* ---\n`;

  // Preparação para cálculo misto
  const altaInicioStr = localStorage.getItem("plaza_alta_inicio");
  const altaFimStr = localStorage.getItem("plaza_alta_fim");

  const resultadosCalculados = [];

  selecionados.forEach((q) => {
    let somaCom = 0;
    let somaSem = 0;

    if (t === "auto") {
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
        if (isAlta) {
          somaCom += q.alta[0];
          somaSem += q.alta[1];
        } else {
          somaCom += q.baixa[0];
          somaSem += q.baixa[1];
        }
        current.setDate(current.getDate() + 1);
      }
    } else {
      // Forçado Alta ou Baixa
      const base = t === "alta" ? q.alta : q.baixa;
      somaCom = base[0] * noites;
      somaSem = base[1] * noites;
    }

    resultadosCalculados.push({ nome: q.nome, com: somaCom, sem: somaSem });

    // Valor diária para exibição (média se for auto/misto)
    const diariaMediaCom = somaCom / noites;
    const diariaMediaSem = somaSem / noites;

    // Se a UH foi explicitamente marcada como 'solteiro', mostrar capacidade como 1
    const capacidadeExibida = q.grupo === "solteiro" ? 1 : q.cap;
    const capacidadeTexto =
      capacidadeExibida === 1
        ? `Apenas ${capacidadeExibida} pessoa`
        : `Até ${capacidadeExibida} pessoas`;
    texto += `\n🟢 *${q.nome.toUpperCase()}*\n${q.desc ? "_" + q.desc + "_\n" : ""}🛏️ ${formatarCamas(q)}\n👤 Capacidade: ${capacidadeTexto}\n💰 Diária: ${diariaMediaCom.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} (c/ café) ou ${diariaMediaSem.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} (s/ café)\n☕ *Total com café:* ${somaCom.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\n🍽️ *Total sem café:* ${somaSem.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\n`;
  });

  // COMODIDADES COMUNS
  let comuns = [];
  if (selecionados.length > 0) {
    comuns = selecionados[0].comodidades || [];
    selecionados.forEach((q) => {
      const comps = q.comodidades || [];
      comuns = comuns.filter((c) => comps.includes(c));
    });
  }

  texto += `\n----------------------------------\n`;
  if (comuns.length > 0) {
    texto += `✅ *Todas as opções acima possuem:* ${comuns.join(", ")}.\n\n`;
  }

  // Horários das refeições
  let horarios = {
    cafe: ["07:00", "09:00", true],
    almoco: ["11:00", "13:00", true],
    janta: ["18:00", "20:00", true],
  };
  try {
    const h = localStorage.getItem("plaza_horarios_refeicoes");
    if (h) horarios = JSON.parse(h);
  } catch (e) {}

  // Verifica visibilidade (índice 2 do array, padrão true se undefined)
  const showCafe = horarios.cafe[2] !== false;
  const showAlmoco = horarios.almoco[2] !== false;
  const showJanta = horarios.janta[2] !== false;

  if (showCafe || showAlmoco || showJanta) {
    texto += `⏰ *Horários das Refeições:*\n`;
    if (showCafe)
      texto += `*- Café da manhã:* ${horarios.cafe[0]} às ${horarios.cafe[1]}\n`;
    if (showAlmoco)
      texto += `*- Almoço:* ${horarios.almoco[0]} às ${horarios.almoco[1]} (opcional)\n`;
    if (showJanta)
      texto += `*- Lanche à Noite:* ${horarios.janta[0]} às ${horarios.janta[1]} (opcional)\n`;
    texto += `\n`;
  }

  // --- LÓGICA DE PROMOÇÃO ---
  const promoAtiva = localStorage.getItem("plaza_promo_ativa") === "true";

  if (promoAtiva) {
    const promoMin =
      parseInt(localStorage.getItem("plaza_promo_min_diarias")) || 0;
    const promoPct =
      parseFloat(localStorage.getItem("plaza_promo_porcentagem")) || 0;
    const promoTxt =
      localStorage.getItem("plaza_promo_texto") || "pagamento à vista";

    if (noites >= promoMin) {
      texto += `🔥 *PROMOÇÃO ESPECIAL ATIVA:*\n`;
      texto += `Ganhe *${promoPct}% de desconto* para ${promoTxt}!\n`;
      texto += `👇 *Valores com desconto aplicado:*\n`;

      resultadosCalculados.forEach((res) => {
        const finalCom = res.com - res.com * (promoPct / 100);
        const finalSem = res.sem - res.sem * (promoPct / 100);
        texto += `🔹 *${res.nome}*\n`;
        texto += `   ✅ C/ Café: *${finalCom.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}*\n`;
        texto += `   ❌ S/ Café: *${finalSem.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}*\n`;
      });
      texto += `\n`;
    } else {
      texto += `🔥 *PROMOÇÃO ESPECIAL:* Reserve *${promoMin} diárias* ou mais e ganhe *${promoPct}% de desconto* para ${promoTxt}!\n\n`;
    }
  }

  texto += `⚠️ _Valores sujeitos a disponibilidade no ato da reserva._\n\nDeseja garantir sua reserva?`;

  previaElement.innerText = texto;
}

function copiar() {
  const texto = document.getElementById("previa").innerText;
  if (texto === "Selecione as acomodações...") return;
  navigator.clipboard
    .writeText(texto)
    .then(() => showMsg("Copiado!", "Tabela pronta para colar no WhatsApp."));
}

window.onload = carregar;
