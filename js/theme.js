/* ═══════════════════════════════════════════════════════════
   MCU TRACKER — THEME SYSTEM
   6 complete themes — switches entire site color scheme
   ═══════════════════════════════════════════════════════════ */

const $ = id => document.getElementById(id);

/* ═══════════ THEMES ═══════════ */
const THEMES = [
  { id: "midnight", name: "Midnight" },
  { id: "stark", name: "Stark" },
  { id: "wakanda", name: "Wakanda" },
  { id: "gamma", name: "Gamma" },
  { id: "cosmic", name: "Cosmic" },
  { id: "infinity", name: "Infinity" }
];

const STORAGE_KEY = "mcuTheme";

/* ═══════════ APPLY THEME ═══════════ */
function applyTheme(themeId) {
  const valid = THEMES.some(t => t.id === themeId) ? themeId : "midnight";

  // Flash animation
  document.body.classList.add("theme-switching");
  setTimeout(() => document.body.classList.remove("theme-switching"), 500);

  // Set data attribute
  document.body.setAttribute("data-theme", valid);
  localStorage.setItem(STORAGE_KEY, valid);

  // Update swatch active state
  document.querySelectorAll(".theme-swatch").forEach(swatch => {
    swatch.classList.toggle("active", swatch.dataset.themePreview === valid);
  });

  // Update theme meta color for mobile
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    const colors = {
      midnight: "#05070d",
      stark: "#0a0505",
      wakanda: "#050a0f",
      gamma: "#050f08",
      cosmic: "#08040f",
      infinity: "#0a0705"
    };
    metaTheme.setAttribute("content", colors[valid] || "#05070d");
  }
}

/* ═══════════ BUILD SWATCHES ═══════════ */
function buildThemeSwatches() {
  const grid = $("themeGrid");
  if (!grid) return;

  grid.innerHTML = "";

  THEMES.forEach(theme => {
    const swatch = document.createElement("button");
    swatch.type = "button";
    swatch.className = "theme-swatch";
    swatch.dataset.themePreview = theme.id;
    swatch.innerHTML = `
      <div class="theme-swatch-preview"></div>
      <div class="theme-swatch-name">${theme.name}</div>
    `;
    swatch.addEventListener("click", () => {
      applyTheme(theme.id);
      window.showToast?.(`✓ Theme: ${theme.name}`, "ok");
    });
    grid.appendChild(swatch);
  });
}

/* ═══════════ THEME PANEL TOGGLE ═══════════ */
function setupThemePanel() {
  const toggleBtn = $("themeToggle");
  const panel = $("themePanel");

  if (!toggleBtn || !panel) return;

  toggleBtn.addEventListener("click", e => {
    e.stopPropagation();
    panel.classList.toggle("open");
  });

  // Close on outside click
  document.addEventListener("click", e => {
    if (!panel.classList.contains("open")) return;
    if (panel.contains(e.target) || toggleBtn.contains(e.target)) return;
    panel.classList.remove("open");
  });

  // Close on Escape
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && panel.classList.contains("open")) {
      panel.classList.remove("open");
    }
  });
}

/* ═══════════ SOUND TOGGLE ═══════════ */
function setupSoundToggle() {
  const btn = $("soundToggle");
  const icon = $("soundIcon");
  if (!btn || !icon) return;

  let soundOn = localStorage.getItem("mcuSound") !== "false";
  icon.textContent = soundOn ? "🔊" : "🔇";

  btn.addEventListener("click", () => {
    soundOn = !soundOn;
    localStorage.setItem("mcuSound", soundOn);
    icon.textContent = soundOn ? "🔊" : "🔇";
    if (soundOn) window.showToast?.("🔊 Sound on", "ok");
    else window.showToast?.("🔇 Sound off", "ok");
  });
}

/* ═══════════ BACKGROUND STARS ═══════════ */
function createStars() {
  const container = $("bgStars");
  if (!container) return;

  container.innerHTML = "";
  const count = window.innerWidth < 700 ? 30 : 60;

  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.animationDelay = (Math.random() * 3).toFixed(2) + "s";
    star.style.opacity = (0.3 + Math.random() * 0.6).toFixed(2);
    container.appendChild(star);
  }
}

/* ═══════════ INIT ═══════════ */
function init() {
  buildThemeSwatches();
  setupThemePanel();
  setupSoundToggle();
  createStars();

  // Apply saved theme
  const saved = localStorage.getItem(STORAGE_KEY) || "midnight";
  applyTheme(saved);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

/* ═══════════ EXPORTS ═══════════ */
window.applyTheme = applyTheme;
window.MCU = window.MCU || {};
window.MCU.getTheme = () => document.body.getAttribute("data-theme");

console.log("✅ Theme module loaded");