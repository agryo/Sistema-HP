let tarifaKwh = 1.8;

window.onload = () => {
  const salvo = localStorage.getItem("plaza_valor_kwh");
  if (salvo) {
    tarifaKwh = parseFloat(salvo);
  }
  document.getElementById("displayTarifa").innerText =
    tarifaKwh.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) +
    " / kWh";
};

function calcular() {
  const input = document.getElementById("consumo").value;
  const valDisplay = document.getElementById("valorFinal");
  const divDetalhes = document.getElementById("detalhesCalculo");
  const valEnergia = document.getElementById("valEnergia");

  if (!input || input <= 0) {
    valDisplay.innerText = "R$ 0,00";
    valDisplay.classList.remove("destaque");
    if (divDetalhes) divDetalhes.style.display = "none";
    return;
  }

  const consumo = parseFloat(input);
  const subtotal = consumo * tarifaKwh;
  const total = subtotal;

  if (divDetalhes) divDetalhes.style.display = "block";
  if (valEnergia)
    valEnergia.innerText = subtotal.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  valDisplay.innerText = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  valDisplay.classList.add("destaque");
}

function limpar() {
  document.getElementById("consumo").value = "";
  document.getElementById("tempo").value = "";
  calcular();
  document.getElementById("consumo").focus();
}

function copiarZap() {
  const input = document.getElementById("consumo").value;
  const inputTempo = document.getElementById("tempo").value;

  if (!input || input <= 0) {
    showMsg("Atenção", "Insira o consumo em kWh antes de gerar a mensagem.");
    return;
  }

  const consumo = parseFloat(input);
  const subtotal = consumo * tarifaKwh;
  const total = subtotal;

  const subtotalFmt = subtotal.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  const totalFmt = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  const tarifaFmt = tarifaKwh.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  // Data e Hora do Término (Agora)
  const agora = new Date();
  const dia = String(agora.getDate()).padStart(2, "0");
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const ano = agora.getFullYear();
  const hora = String(agora.getHours()).padStart(2, "0");
  const min = String(agora.getMinutes()).padStart(2, "0");

  const dataFim = `${dia}/${mes}/${ano}`;
  const horaFim = `${hora}:${min}`;

  let infoTempo = "";

  if (inputTempo) {
    if (inputTempo.includes(":")) {
      const [h, m] = inputTempo.split(":");
      infoTempo = `\n⏱ *Tempo de Carga:* ${h}h ${m}m`;
    } else {
      infoTempo = `\n⏱ *Tempo de Carga:* ${inputTempo}`;
    }
  }

  const texto = `🔋 *Recarga Veículo Elétrico - Hotel Plaza*\n\n📅 *Data:* ${dataFim} às ${horaFim}\n\n⚡ *Consumo:* ${consumo} kWh\n💲 *Tarifa Base:* ${tarifaFmt}/kWh\n📊 *Energia:* ${subtotalFmt}${infoTempo}\n\n💰 *TOTAL A PAGAR: ${totalFmt}*`;

  navigator.clipboard.writeText(texto).then(() => {
    document.getElementById("msgIcon").innerText = "✅";
    showMsg(
      "Copiado!",
      "Resumo da recarga copiado para a área de transferência.",
    );
  });
}

function abrirAjuda() {
  document.getElementById("modalAjuda").style.display = "block";
}

function fecharAjuda() {
  document.getElementById("modalAjuda").style.display = "none";
}
