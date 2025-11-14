// js/script.js
document.addEventListener("DOMContentLoaded", () => {
  // Texto que se va a escribir (observa que la línea 5 acaba en ": " para añadir el contador después)
  const lines = [
    "LOG 01: Iniciando secuencia de aterrizaje en Marte…",
    "LOG 02: Fallo crítico: los sistemas principales dejan de responder.",
    "LOG 03: ALERTA: Marte no aparece en las coordenadas esperadas.",
    "LOG 04: Major Tom activa el protocolo de emergencia.",
    "LOG 05: Enviando transmisión a la Tierra — Tiempo estimado: ",
    "LOG 06: ERROR 404: Objetivo no encontrado. Transmisión inestable…"
  ];

  // Elementos del DOM
  const terminal = document.getElementById("terminalLines");
  const cursor = document.getElementById("cursor"); // lo dejamos por compatibilidad visual
  const screen = document.getElementById("terminalScreen");
  const externalTemporizador = document.getElementById("temporizador"); // si existe en HTML lo reutilizamos

  // Tipado
  let lineIndex = 0;
  let charIndex = 0;
  let currentParagraph = null;
  const typingSpeed = 30;   // ms por carácter
  const lineDelay = 450;    // ms entre líneas

  // Contador (10 minutos)
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

    // targetElement es un elemento en línea (span / div) dentro de la misma línea
    targetElement.textContent = formatTime(tiempoTotalEnSegundos);

    intervaloContador = setInterval(() => {
      tiempoTotalEnSegundos--;
      if (tiempoTotalEnSegundos <= 0) {
        clearInterval(intervaloContador);
        targetElement.textContent = "00:00";
        // Mensaje adicional en la misma línea (opcional)
        const rem = document.createElement("span");
        rem.textContent = " — TRANSMISIÓN EXPIRADA";
        rem.className = "transmission-expired";
        rem.style.marginLeft = "8px";
        // si currentParagraph sigue disponible, lo añadimos; si no, lo añadimos al terminal
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

    // Tratamiento especial para la línea 5 (índice 4): añadimos span del contador en la misma línea
    if (lineIndex === 4) {
      if (charIndex < line.length) {
        // escribimos carácter a carácter la parte de texto que precede al contador
        currentParagraph.textContent += line.charAt(charIndex);
        charIndex++;
        setTimeout(type, typingSpeed);
      } else {
        // texto de la línea 5 ya escrito -> insertar el contador INLINE
        let inlineTimerEl = null;

        if (externalTemporizador) {
          // mover / reutilizar el div#temporizador dentro de la misma línea
          inlineTimerEl = externalTemporizador;
          // Asegurar que el elemento se comporte inline
          inlineTimerEl.style.display = "inline-block";
          inlineTimerEl.style.marginLeft = "6px";
          // Si el externalTemporizador estaba en otro sitio, lo movemos aquí
          currentParagraph.appendChild(inlineTimerEl);
        } else {
          // crear un span inline para el contador
          inlineTimerEl = document.createElement("span");
          inlineTimerEl.id = "timerInline";
          inlineTimerEl.className = "countdown-inline";
          inlineTimerEl.style.marginLeft = "6px";
          inlineTimerEl.style.fontWeight = "700";
          currentParagraph.appendChild(inlineTimerEl);
        }

        // Iniciar el contador (solo una vez)
        startCountdown(inlineTimerEl);

        // Preparar siguiente línea
        lineIndex++;
        charIndex = 0;
        currentParagraph = null;
        setTimeout(type, lineDelay);
      }

      // asegurar auto-scroll
      terminal.parentElement.scrollTop = terminal.parentElement.scrollHeight;
      return;
    }

    // Resto de líneas normales (no especiales)
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

  // Iniciar escritura
  type();

  // --- GLITCH aleatorio (igual que antes) ---
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

  // Opcional: limpiar intervalos si el usuario navega fuera de la página
  window.addEventListener("beforeunload", () => {
    if (intervaloContador) clearInterval(intervaloContador);
  });
});
