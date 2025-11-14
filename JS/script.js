  document.addEventListener("DOMContentLoaded", () => {
    const lines = [
      "LOG 01: Iniciando secuencia de aterrizaje en Marte…",
      "LOG 02: Fallo crítico: los sistemas principales dejan de responder.",
      "LOG 03: ALERTA: Marte no aparece en las coordenadas esperadas.",
      "LOG 04: Major Tom activa el protocolo de emergencia.",
      "LOG 05: Enviando transmisión a la Tierra — tiempo estimado: 10 minutos.",
      "LOG 06: ERROR 404: Objetivo no encontrado. Transmisión inestable…"
    ];

    const terminal = document.getElementById("terminalLines");
    const cursor = document.getElementById("cursor");
    const screen = document.getElementById("terminalScreen");

    let lineIndex = 0;
    let charIndex = 0;
    let currentParagraph = null;
    const typingSpeed = 30;   
    const lineDelay = 450;    

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

    type();


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
  });

