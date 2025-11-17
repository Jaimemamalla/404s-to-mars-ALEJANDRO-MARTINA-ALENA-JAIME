// js/script.js
document.addEventListener("DOMContentLoaded", () => {
 
  const lines = [
    "LOG 01: Iniciando secuencia de aterrizaje en Marte…",
    "LOG 02: Fallo crítico: los sistemas principales dejan de responder.",
    "LOG 03: ALERTA: Marte no aparece en las coordenadas esperadas.",
    "LOG 04: Major Tom activa el protocolo de emergencia.",
    "LOG 05: Enviando transmisión a la Tierra — Tiempo estimado: ",
    "LOG 06: ERROR 404: Objetivo no encontrado. Transmisión inestable…"
  ];

  //DOM
  const terminal = document.getElementById("terminalLines");
  const cursor = document.getElementById("cursor");
  const screen = document.getElementById("terminalScreen");
  const externalTemporizador = document.getElementById("temporizador");

  //variabels
  let lineIndex = 0;
  let charIndex = 0;
  let currentParagraph = null;
  const typingSpeed = 30;
  const lineDelay = 450;

  //contador
  let tiempoTotalEnSegundos = 10 * 60;
  let intervaloContador = null;
  let countdownStarted = false;

  function formatTime(segundos) {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    const mm = minutos < 10 ? "0" + minutos : "" + minutos;
    const ss = segundosRestantes < 10 ? "0" + segundosRestantes : "" + segundosRestantes;
    return `${mm}:${ss}`;
  }

  function startCountdown(targetElement) {
    if (countdownStarted) return;
    countdownStarted = true;

    
    targetElement.textContent = formatTime(tiempoTotalEnSegundos);

    intervaloContador = setInterval(() => {
      tiempoTotalEnSegundos--;
      if (tiempoTotalEnSegundos <= 0) {
        clearInterval(intervaloContador);
        targetElement.textContent = "00:00";
        //mensaje extra
        const rem = document.createElement("span");
        rem.textContent = " — TRANSMISIÓN EXPIRADA";
        rem.className = "transmission-expired";
        rem.style.marginLeft = "8px";
        
        if (currentParagraph) currentParagraph.appendChild(rem);
        else terminal.appendChild(rem);
      } else {
        targetElement.textContent = formatTime(tiempoTotalEnSegundos);
      }
    }, 1000);
  }

  function type() {
    if (lineIndex >= lines.length) {
      return;
    }

    if (!currentParagraph) {
      currentParagraph = document.createElement("p");
      currentParagraph.className = "typed-line";
      terminal.appendChild(currentParagraph);
    }

    const line = lines[lineIndex];

    
    if (lineIndex === 4) {
      if (charIndex < line.length) {
        //texto escribir
        currentParagraph.textContent += line.charAt(charIndex);
        charIndex++;
        setTimeout(type, typingSpeed);
      } else {
        // texto linea 5 + temporizador
        let inlineTimerEl = null;

        if (externalTemporizador) {
          //reloj
          inlineTimerEl = externalTemporizador;
          //inline 100%
          inlineTimerEl.style.display = "inline-block";
          inlineTimerEl.style.marginLeft = "6px";
          //mover reloj 
          currentParagraph.appendChild(inlineTimerEl);
        } else {
          //span contador
          inlineTimerEl = document.createElement("span");
          inlineTimerEl.id = "timerInline";
          inlineTimerEl.className = "countdown-inline";
          inlineTimerEl.style.marginLeft = "6px";
          inlineTimerEl.style.fontWeight = "700";
          currentParagraph.appendChild(inlineTimerEl);
        }

        //contador iniciar
        startCountdown(inlineTimerEl);

        //siguiente línea
        lineIndex++;
        charIndex = 0;
        currentParagraph = null;
        setTimeout(type, lineDelay);
      }

      //auto scroll
      terminal.parentElement.scrollTop = terminal.parentElement.scrollHeight;
      return;
    }

    //resto de líneas
    if (charIndex < line.length) {
      currentParagraph.textContent += line.charAt(charIndex);
      charIndex++;
      setTimeout(type, typingSpeed);
    } else {
      lineIndex++;
      charIndex = 0;
      currentParagraph = null;
      setTimeout(type, lineDelay);
    }

    terminal.parentElement.scrollTop = terminal.parentElement.scrollHeight;
  }

  //inicio tecto
  type();

  //GLITCH
  function triggerGlitch() {
    screen.classList.add("screen-glitch");
    screen.classList.add("glitch-lines");
    screen.style.setProperty("--glitch-y", Math.floor(Math.random() * 90));

    setTimeout(() => {
      screen.classList.remove("screen-glitch", "glitch-lines");
    }, 180);
  }

  function randomGlitch() {
    const delay = Math.random() * (1400 - 800) + 800;
    setTimeout(() => {
      triggerGlitch();
      randomGlitch();
    }, delay);
  }

  randomGlitch();

  //borrar intervalos
  window.addEventListener("beforeunload", () => {
    if (intervaloContador) clearInterval(intervaloContador);
  });
});
