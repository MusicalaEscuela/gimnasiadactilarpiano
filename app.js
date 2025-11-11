// 🎵 app.js — Gimnasia Dactilar para Piano (Musicala)

// === Año dinámico ===
document.getElementById("year").textContent = new Date().getFullYear();

// === Barra de progreso on scroll ===
const progressBar = document.getElementById("progress-bar");
window.addEventListener("scroll", () => {
  const st = document.documentElement.scrollTop || document.body.scrollTop;
  const sh = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const pct = Math.max(0, Math.min(100, (st / sh) * 100));
  progressBar.style.width = pct + "%";
});

// === Scroll suave al hacer clic en links internos ===
const navLinks = document.querySelectorAll('a[href^="#"]');
navLinks.forEach(link => {
  link.addEventListener("click", e => {
    const targetId = link.getAttribute("href");
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      window.scrollTo({
        top: target.offsetTop - 60,
        behavior: "smooth"
      });
    }
  });
});

// === Resalta el enlace del menú activo ===
const sections = document.querySelectorAll("main section[id]");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const id = entry.target.getAttribute("id");
    const navItem = document.querySelector(`.nav a[href="#${id}"]`);
    if (entry.isIntersecting && navItem) {
      document.querySelectorAll(".nav a").forEach(a => a.classList.remove("active"));
      navItem.classList.add("active");
    }
  });
}, { threshold: 0.4 });

sections.forEach(sec => observer.observe(sec));

// === Animación de entrada (fade-in) para secciones ===
const fadeInObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      fadeInObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll(".card, .hero, .video-wrap").forEach(el => {
  el.classList.add("fade");
  fadeInObserver.observe(el);
});

// === Accesibilidad: detectar si el usuario prefiere reducir movimiento ===
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.documentElement.style.scrollBehavior = "auto";
  progressBar.style.transition = "none";
  document.querySelectorAll(".fade").forEach(el => el.classList.remove("fade"));
}

// === Efecto visual adicional: cambio de color dinámico al pasar 50% del scroll ===
window.addEventListener("scroll", () => {
  const scrollPos = window.scrollY;
  if (scrollPos > window.innerHeight / 1.5) {
    progressBar.style.background =
      "linear-gradient(90deg, var(--violeta-beethoven), var(--magenta-brahms))";
  } else {
    progressBar.style.background =
      "linear-gradient(90deg, var(--azul-mozart), var(--violeta-beethoven), var(--magenta-brahms))";
  }
});
