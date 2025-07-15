const output = document.getElementById("output");
const input = document.getElementById("input");
const cardsSection = document.getElementById("cards");

// Função para exibir a resposta
function mostrarResposta(texto) {
  output.textContent += `\nAletheia: ${texto}\n`;
  falar(texto);
}

// Envia a entrada
function enviar() {
  const texto = input.value.trim();
  if (!texto) return;
  output.textContent += `\nVocê: ${texto}`;
  input.value = "";

  // Lógica simples de IA
  if (texto.toLowerCase().includes("hora")) {
    const agora = new Date();
    mostrarResposta(`Agora são ${agora.getHours()} horas e ${agora.getMinutes()} minutos.`);
  } else if (texto.toLowerCase().includes("meu nome")) {
    mostrarResposta("Você ainda não me disse seu nome, mestre.");
  } else {
    mostrarResposta("Estou processando sua solicitação...");
    fetchBuscaWeb(texto);
  }
}

// Voz (resposta)
function falar(texto) {
  const utter = new SpeechSynthesisUtterance(texto);
  utter.lang = "pt-BR";
  speechSynthesis.speak(utter);
}

// Voz (comando)
document.getElementById("vozBtn").addEventListener("click", () => {
  const reconhecimento = new webkitSpeechRecognition() || new SpeechRecognition();
  reconhecimento.lang = "pt-BR";
  reconhecimento.start();

  reconhecimento.onresult = (event) => {
    input.value = event.results[0][0].transcript;
    enviar();
  };
});

// Busca online
function fetchBuscaWeb(texto) {
  mostrarResposta(`(Busca simulada): "${texto}" – Em breve terei acesso à web real.`);
}

// Carregar cards dos apps
fetch("apps.json")
  .then(res => res.json())
  .then(apps => {
    apps.forEach(app => {
      const div = document.createElement("div");
      div.className = "card";
      div.textContent = app.nome;
      div.onclick = () => window.open(app.url, "_blank");
      cardsSection.appendChild(div);
    });
  })
  .catch(() => {
    mostrarResposta("Não consegui carregar os apps.");
  });
