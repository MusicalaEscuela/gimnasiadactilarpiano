// 🎵 app.js — Gimnasia Dactilar para Piano (Musicala)

// =========================
// Año dinámico en el footer
// =========================
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// =========================
// Barra de progreso on scroll
// =========================
const progressBar = document.getElementById("progress-bar");

function handleScroll() {
  const st =
    document.documentElement.scrollTop || document.body.scrollTop;
  const sh =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const pct = Math.max(0, Math.min(100, (st / sh) * 100));

  if (progressBar) {
    progressBar.style.width = pct + "%";

    // Cambio de color dinámico según el scroll
    const scrollPos = window.scrollY;
    if (scrollPos > window.innerHeight / 1.5) {
      progressBar.style.background =
        "linear-gradient(90deg, var(--violeta-beethoven), var(--magenta-brahms))";
    } else {
      progressBar.style.background =
        "linear-gradient(90deg, var(--azul-mozart), var(--violeta-beethoven), var(--magenta-brahms))";
    }
  }
}

window.addEventListener("scroll", handleScroll);

// =========================
// Scroll suave en links internos
// =========================
const navLinks = document.querySelectorAll('a[href^="#"]');

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (!href || href === "#") return;

    const targetId = href.substring(1);
    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;

    e.preventDefault();

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const topOffset = 80; // compensa la topbar fija
    const targetTop =
      targetEl.getBoundingClientRect().top + window.scrollY - topOffset;

    window.scrollTo({
      top: targetTop,
      behavior: prefersReduced ? "auto" : "smooth",
    });
  });
});

// =========================
// Tabs de video
// =========================
const videoTabs = document.querySelectorAll(".video-tab");
const videoPanels = document.querySelectorAll(".video-panel");
const VIDEO_TAB_STORAGE_KEY = "gimnasiaVideoActiveTab";

function setActiveVideoTab(tabName) {
  // Tabs
  videoTabs.forEach((tab) => {
    const name = tab.getAttribute("data-video");
    if (name === tabName) {
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");
    } else {
      tab.classList.remove("is-active");
      tab.setAttribute("aria-selected", "false");
    }
  });

  // Panels
  videoPanels.forEach((panel) => {
    const name = panel.getAttribute("data-video-panel");
    if (name === tabName) {
      panel.classList.add("is-active");
    } else {
      panel.classList.remove("is-active");
    }
  });

  // Guardar preferencia
  try {
    localStorage.setItem(VIDEO_TAB_STORAGE_KEY, tabName);
  } catch (err) {
    // si localStorage falla, no pasa nada grave
  }
}

// Listener de tabs
videoTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const name = tab.getAttribute("data-video");
    if (!name) return;
    setActiveVideoTab(name);
  });
});

// Restaurar tab activo al cargar
(function restoreActiveVideoTab() {
  if (!videoTabs.length || !videoPanels.length) return;

  let stored = null;
  try {
    stored = localStorage.getItem(VIDEO_TAB_STORAGE_KEY);
  } catch (err) {
    stored = null;
  }

  const validNames = Array.from(videoTabs).map((t) =>
    t.getAttribute("data-video")
  );

  const defaultName = "general";
  const initial =
    stored && validNames.includes(stored) ? stored : defaultName;

  setActiveVideoTab(initial);
})();

// =========================
// Checklist de niveles
// =========================
const levelsChecklist = document.getElementById("levels-checklist");
const levelsMessage = document.getElementById("levels-message");
const LEVELS_STORAGE_KEY = "gimnasiaLevelsProgress";

function loadLevelsProgress() {
  if (!levelsChecklist) return;

  let saved = null;
  try {
    saved = JSON.parse(localStorage.getItem(LEVELS_STORAGE_KEY));
  } catch (err) {
    saved = null;
  }

  const checkboxes = levelsChecklist.querySelectorAll(
    'input[type="checkbox"][data-level]'
  );

  checkboxes.forEach((cb) => {
    const level = cb.getAttribute("data-level");
    if (!level) return;

    if (saved && typeof saved[level] === "boolean") {
      cb.checked = saved[level];
    }
  });

  updateLevelsMessage();
}

function saveLevelsProgress() {
  if (!levelsChecklist) return;

  const checkboxes = levelsChecklist.querySelectorAll(
    'input[type="checkbox"][data-level]'
  );

  const data = {};
  checkboxes.forEach((cb) => {
    const level = cb.getAttribute("data-level");
    if (!level) return;
    data[level] = cb.checked;
  });

  try {
    localStorage.setItem(LEVELS_STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    // si localStorage falla, seguimos tranquilos
  }

  updateLevelsMessage();
}

function updateLevelsMessage() {
  if (!levelsChecklist || !levelsMessage) return;

  const checkboxes = levelsChecklist.querySelectorAll(
    'input[type="checkbox"][data-level]'
  );
  const total = checkboxes.length;
  let checked = 0;
  checkboxes.forEach((cb) => {
    if (cb.checked) checked++;
  });

  if (checked === 0) {
    levelsMessage.textContent =
      "Cuando vayas marcando, podrás ver tu progreso sin necesidad de memorizarlo todo.";
  } else if (checked < total) {
    levelsMessage.textContent = `Llevas ${checked} de ${total} niveles marcados como estables. Sigue avanzando a tu ritmo.`;
  } else {
    levelsMessage.textContent =
      "¡Genial! Tienes los 3 niveles marcados como estables. Ahora repítelos algunos días para que tus manos lo integren con calma.";
  }
}

// Escuchar cambios en el checklist
if (levelsChecklist) {
  levelsChecklist.addEventListener("change", (e) => {
    if (
      e.target &&
      e.target.matches('input[type="checkbox"][data-level]')
    ) {
      saveLevelsProgress();
    }
  });

  // Cargar estado al inicio
  loadLevelsProgress();
}
