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

  //variables
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

        // si quedan menos de 60s añadir clase urgent (cambio visual)
        if (tiempoTotalEnSegundos <= 60) {
          targetElement.classList.add("countdown-urgent");
        }
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

  //inicio texto
  type();

  //GLITCH EFFECTS
  function makeGlitchSlice(container, opts = {}) {
    //parametros slice
    const top = opts.topPercent ?? (Math.random() * 85 + 2); // 2 - 87%
    const height = opts.heightPx ?? Math.floor(Math.random() * 36) + 8; // 8-44px
    const duration = opts.duration ?? (Math.random() * 420 + 200); // ms
    const small = opts.smallFlag ?? (Math.random() > 0.6);

    const slice = document.createElement("div");
    slice.className = "glitch-slice" + (small ? " small" : "");
    slice.style.top = top + "%";
    slice.style.height = height + "px";
    slice.style.opacity = "0";

    const inner = document.createElement("div");
    inner.className = "slice-inner";
    //RGB glitch
    const r = document.createElement("div");
    r.style.position = "absolute";
    r.style.inset = "0";
    r.style.transform = "translateX(" + (small ? "-6%" : "-10%") + ")";
    r.style.background = "linear-gradient(90deg, rgba(255,30,90,0.12), transparent)";
    r.style.mixBlendMode = "screen";

    const g = document.createElement("div");
    g.style.position = "absolute";
    g.style.inset = "0";
    g.style.transform = "translateX(" + (small ? "3%" : "5%") + ")";
    g.style.background = "linear-gradient(90deg, rgba(0,220,140,0.10), transparent)";
    g.style.mixBlendMode = "screen";

    const b = document.createElement("div");
    b.style.position = "absolute";
    b.style.inset = "0";
    b.style.transform = "translateX(" + (small ? "0%" : "8%") + ")";
    b.style.background = "linear-gradient(90deg, rgba(0,200,255,0.08), transparent)";
    b.style.mixBlendMode = "screen";

    inner.appendChild(r);
    inner.appendChild(g);
    inner.appendChild(b);
    slice.appendChild(inner);

    container.appendChild(slice);

    //anim slice
    slice.style.animation = `slice-in ${Math.max(280, duration)}ms cubic-bezier(.2,.7,.2,1) forwards`;
    //fade out
    setTimeout(() => {
      if (slice && slice.parentElement) slice.parentElement.removeChild(slice);
    }, duration + 80);
  }

  //glitch trigger
  function triggerGlitch() {
    screen.classList.add("screen-glitch");
    screen.classList.add("glitch-lines");
    screen.style.setProperty("--glitch-y", Math.floor(Math.random() * 90));

    //slices
    const slices = Math.floor(Math.random() * 4) + 1;
    for (let i = 0; i < slices; i++) {
      //delay slice
      setTimeout(() => {
        makeGlitchSlice(screen, {
          topPercent: Math.random() * 90,
          heightPx: Math.floor(Math.random() * 36) + 6,
          duration: Math.floor(Math.random() * 420) + 180,
          smallFlag: Math.random() > 0.5
        });
      }, Math.floor(Math.random() * 140));
    }

    //temblor 404
    const big404 = document.querySelector(".big-404");
    if (big404) {
      big404.style.transform = `translate(${(Math.random()-.5)*8}px, ${(Math.random()-.5)*6}px) rotate(${(Math.random()-.5)*1.2}deg)`;
      setTimeout(() => {
        big404.style.transform = "";
      }, 160 + Math.random() * 200);
    }

    setTimeout(() => {
      screen.classList.remove("screen-glitch", "glitch-lines");
    }, 180 + Math.random() * 260);
  }

  //random glitch loop
  function randomGlitch() {
    const delay = Math.random() * (1400 - 700) + 700;
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
