const openEnvelopeBtn = document.getElementById("open-envelope-btn");
const envelopeScreen = document.getElementById("envelope-screen");
const inviteScreen = document.getElementById("invite-screen");
const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");
const actionButtons = document.getElementById("action-buttons");
const confirmedBox = document.getElementById("confirmed-box");
const resetBtn = document.getElementById("reset-btn");

// Personalize os dados da viagem aqui:
const tripConfig = {
  origin: "Florianópolis",
  destination: "Gramado",
  date: "19 a 22 de Dezembro",
  guest: "Você",
  // Data de início da viagem (dia 19 de dezembro de 2026 às 00:00)
  targetDate: "2026-12-19T00:00:00",
  // Coloque seu número com 55 + DDD + número (apenas dígitos, sem espaços ou traços)
  whatsappNumber: "5548988791458",
  whatsappYesMessage:
    "Eu topo! Pode confirmar meu lugar nessa road trip para Gramado! 🚗✨",
  whatsappNoMessage:
    "Oi! Vi o convite para Gramado, mas dessa vez não vou conseguir ir.",
  message:
    "Prepare as malas! Separei esses dias para curtirmos juntos, conhecermos lugares incríveis em Gramado e criarmos memórias inesquecíveis. Topa embarcar nessa para realizar o seu sonho de ir para lá?"
};

function applyTripConfig() {
  document.getElementById("origin-text").textContent = tripConfig.origin;
  document.getElementById("destination-text").textContent = tripConfig.destination;
  document.getElementById("date-text").textContent = tripConfig.date;
  document.getElementById("guest-text").textContent = tripConfig.guest;
  document.getElementById("message-text").textContent = tripConfig.message;
}

applyTripConfig();

// Abre o convite
openEnvelopeBtn.addEventListener("click", () => {
  envelopeScreen.classList.remove("active");
  inviteScreen.classList.add("active");
});

// Monta o link do WhatsApp com mensagem personalizada
function getWhatsAppUrl(customMessage) {
  const text = encodeURIComponent(customMessage);
  return `https://wa.me/${tripConfig.whatsappNumber}?text=${text}`;
}

// Botão "Bora! Eu topo" -> confirma presença + confetes + abre WhatsApp
yesBtn.addEventListener("click", () => {
  actionButtons.classList.add("hidden");
  confirmedBox.classList.remove("hidden");

  const titleEl = confirmedBox.querySelector("h3");
  const descEl = confirmedBox.querySelector("p");
  if (titleEl) titleEl.textContent = "Partiu! Assento confirmado 🎉";
  if (descEl) descEl.textContent = "Já estou contando os dias para essa aventura com você.";

  startConfetti();

  const waUrl = getWhatsAppUrl(tripConfig.whatsappYesMessage);

  if (!document.getElementById("wa-fallback-btn")) {
    const waLink = document.createElement("a");
    waLink.id = "wa-fallback-btn";
    waLink.href = waUrl;
    waLink.target = "_blank";
    waLink.rel = "noopener noreferrer";
    waLink.className = "btn btn-yes";
    waLink.style.display = "inline-block";
    waLink.style.marginTop = "12px";
    waLink.style.textDecoration = "none";
    waLink.textContent = "Confirmar no WhatsApp 💬";
    confirmedBox.insertBefore(waLink, resetBtn);
  } else {
    const existingLink = document.getElementById("wa-fallback-btn");
    existingLink.href = waUrl;
    existingLink.textContent = "Confirmar no WhatsApp 💬";
  }

  setTimeout(() => {
    window.location.href = waUrl;
  }, 1500);
});

// Botão "Não posso ir" -> clique normal e opcionalmente abre WhatsApp
noBtn.addEventListener("click", () => {
  actionButtons.classList.add("hidden");
  confirmedBox.classList.remove("hidden");

  const titleEl = confirmedBox.querySelector("h3");
  const descEl = confirmedBox.querySelector("p");
  if (titleEl) titleEl.textContent = "Resposta registrada";
  if (descEl) descEl.textContent = "Tudo bem, fica para uma próxima! Se quiser avisar por mensagem:";

  const waUrl = getWhatsAppUrl(tripConfig.whatsappNoMessage);

  if (!document.getElementById("wa-fallback-btn")) {
    const waLink = document.createElement("a");
    waLink.id = "wa-fallback-btn";
    waLink.href = waUrl;
    waLink.target = "_blank";
    waLink.rel = "noopener noreferrer";
    waLink.className = "btn btn-no";
    waLink.style.display = "inline-block";
    waLink.style.marginTop = "12px";
    waLink.style.textDecoration = "none";
    waLink.textContent = "Avisar no WhatsApp 💬";
    confirmedBox.insertBefore(waLink, resetBtn);
  } else {
    const existingLink = document.getElementById("wa-fallback-btn");
    existingLink.href = waUrl;
    existingLink.textContent = "Avisar no WhatsApp 💬";
  }
});

resetBtn.addEventListener("click", () => {
  confirmedBox.classList.add("hidden");
  actionButtons.classList.remove("hidden");
});

// Contador regressivo até o dia 19
function startCountdown() {
  const target = new Date(tripConfig.targetDate).getTime();
  const countdownEl = document.getElementById("countdown");
  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minutesEl = document.getElementById("cd-minutes");
  const secondsEl = document.getElementById("cd-seconds");

  if (!countdownEl || !daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  function update() {
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      countdownEl.innerHTML =
        '<p style="grid-column: 1 / -1; color: #4ade80; font-weight: 700;">Chegou o grande dia! Boa viagem 🚗</p>';
      clearInterval(timer);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
  }

  update();
  const timer = setInterval(update, 1000);
}

startCountdown();

// Efeito de confete no canvas
function startConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ["#f97316", "#4ade80", "#38bdf8", "#facc15", "#f472b6"];
  const pieces = Array.from({ length: 90 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    size: Math.random() * 8 + 4,
    speedY: Math.random() * 3 + 2,
    speedX: Math.random() * 2 - 1,
    color: colors[Math.floor(Math.random() * colors.length)]
  }));

  let frames = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((p) => {
      p.y += p.speedY;
      p.x += p.speedX;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size * 0.6);
    });

    frames++;
    if (frames < 180) {
      requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  draw();
}