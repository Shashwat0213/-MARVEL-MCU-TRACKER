/* ═══════════════════════════════════════════════════════════
   MCU TRACKER — THEME SYSTEM
   6 complete themes
   ═══════════════════════════════════════════════════════════ */

(function() {
  "use strict";

  const THEMES = [
    { id: "midnight", name: "Midnight" },
    { id: "stark", name: "Stark" },
    { id: "wakanda", name: "Wakanda" },
    { id: "gamma", name: "Gamma" },
    { id: "cosmic", name: "Cosmic" },
    { id: "infinity", name: "Infinity" }
  ];

  const STORAGE_KEY = "mcuTheme";

  function applyTheme(themeId) {
    const valid = THEMES.some(t => t.id === themeId) ? themeId : "midnight";
    document.body.setAttribute("data-theme", valid);
    try { localStorage.setItem(STORAGE_KEY, valid); } catch (e) {}
    document.querySelectorAll(".theme-swatch").forEach(s => {
      s.classList.toggle("active", s.dataset.themePreview === valid);
    });
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      const colors = {
        midnight: "#05070d", stark: "#0a0505", wakanda: "#050a0f",
        gamma: "#050f08", cosmic: "#08040f", infinity: "#0a0705"
      };
      metaTheme.setAttribute("content", colors[valid] || "#05070d");
    }
  }

  function buildSwatches() {
    const grid = document.getElementById("themeGrid");
    if (!grid) return;
    grid.innerHTML = "";
    THEMES.forEach(theme => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "theme-swatch";
      btn.dataset.themePreview = theme.id;
      btn.innerHTML = `<div class="theme-swatch-preview"></div><div class="theme-swatch-name">${theme.name}</div>`;
      btn.addEventListener("click", () => {
        applyTheme(theme.id);
        if (window.showToast) window.showToast(`✓ Theme: ${theme.name}`, "ok");
      });
      grid.appendChild(btn);
    });
  }

  function setupPanel() {
    const toggle = document.getElementById("themeToggle");
    const panel = document.getElementById("themePanel");
    if (!toggle || !panel) return;
    toggle.addEventListener("click", e => {
      e.stopPropagation();
      panel.classList.toggle("open");
    });
    document.addEventListener("click", e => {
      if (!panel.classList.contains("open")) return;
      if (panel.contains(e.target) || toggle.contains(e.target)) return;
      panel.classList.remove("open");
    });
  }

  function setupSound() {
    const btn = document.getElementById("soundToggle");
    const icon = document.getElementById("soundIcon");
    if (!btn || !icon) return;
    let on = true;
    try { on = localStorage.getItem("mcuSound") !== "false"; } catch (e) {}
    icon.textContent = on ? "🔊" : "🔇";
    btn.addEventListener("click", () => {
      on = !on;
      try { localStorage.setItem("mcuSound", on); } catch (e) {}
      icon.textContent = on ? "🔊" : "🔇";
      if (window.showToast) window.showToast(on ? "🔊 Sound on" : "🔇 Sound off", "ok");
    });
  }

  function makeStars() {
    const box = document.getElementById("bgStars");
    if (!box) return;
    box.innerHTML = "";
    const count = window.innerWidth < 700 ? 30 : 60;
    for (let i = 0; i < count; i++) {
      const s = document.createElement("div");
      s.className = "star";
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 100 + "%";
      s.style.animationDelay = (Math.random() * 3).toFixed(2) + "s";
      box.appendChild(s);
    }
  }

  function init() {
    buildSwatches();
    setupPanel();
    setupSound();
    makeStars();
    let saved = "midnight";
    try { saved = localStorage.getItem(STORAGE_KEY) || "midnight"; } catch (e) {}
    applyTheme(saved);
    console.log("✅ Theme ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();