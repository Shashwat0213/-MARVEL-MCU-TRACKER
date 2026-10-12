/* ═══════════════════════════════════════════════════════════
   MCU TRACKER — THEME + SOUND SYSTEM
   Clean version — no layout breaking
   ═══════════════════════════════════════════════════════════ */

(function() {
  "use strict";

  const $ = id => document.getElementById(id);

  /* ═══════════ THEME DATA ═══════════ */
  const themeData = {
    cosmos:     { label: "Cosmos",      title: "Guardians of the Galaxy",              subtitle: "Cosmos • Phase 2",      poster: "https://image.tmdb.org/t/p/w500/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg" },
    arcreactor: { label: "Arc Reactor", title: "Iron Man",                            subtitle: "Arc Reactor • Phase 1", poster: "https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg" },
    inferno:    { label: "Inferno",     title: "Avengers: Endgame",                   subtitle: "Inferno • Phase 3",     poster: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg" },
    vibranium:  { label: "Vibranium",   title: "Black Panther: Wakanda Forever",      subtitle: "Vibranium • Phase 4",   poster: "https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg" },
    bifrost:    { label: "Bifrost",     title: "Thor: Ragnarok",                      subtitle: "Bifrost • Phase 3",     poster: "https://image.tmdb.org/t/p/w500/rzRwTcFvttcN1ZpX2xv4j3tSdJu.jpg" },
    doomsday:   { label: "Doomsday",    title: "Avengers: Doomsday",                  subtitle: "Doomsday • Phase 6",    poster: "https://images.flickdirect.com/movies/avengers-doomsday/avengers-doomsday-poster.jpg" },
    noir:       { label: "Noir",        title: "Iron Man",                            subtitle: "Noir • Phase 1",        poster: "https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg" }
  };

  /* ═══════════ SOUND SYSTEM ═══════════ */
  let soundEnabled = true;
  try { soundEnabled = localStorage.getItem("mcuSound") !== "false"; } catch (e) {}

  const SOUNDS = {
    button:   "https://actions.google.com/sounds/v1/cartoon/pop.ogg",
    theme:    "https://actions.google.com/sounds/v1/science_fiction/laser_1.ogg",
    tick:     "https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg",
    loading:  "https://actions.google.com/sounds/v1/science_fiction/robot_code_scan.ogg",
    startup:  "https://actions.google.com/sounds/v1/science_fiction/computer_ready.ogg"
  };

  function playSound(url, volume) {
    if (!soundEnabled) return;
    volume = volume || 0.35;
    try {
      const audio = new Audio(url);
      audio.volume = volume;
      audio.play().catch(function() {});
    } catch (e) {}
  }

  window.playButtonSound = () => playSound(SOUNDS.button, 0.35);
  window.playThemeSound = () => playSound(SOUNDS.theme, 0.35);
  window.playTickSound = () => playSound(SOUNDS.tick, 0.35);
  window.playLoadingSound = () => playSound(SOUNDS.loading, 0.25);

  /* ═══════════ APPLY THEME ═══════════ */
  function applyTheme(themeId) {
    if (!themeData[themeId]) themeId = "cosmos";

    document.body.classList.add("theme-switching");
    setTimeout(function() {
      document.body.classList.remove("theme-switching");
    }, 600);

    document.body.classList.remove(
      "theme-cosmos", "theme-arcreactor", "theme-inferno",
      "theme-vibranium", "theme-bifrost", "theme-doomsday", "theme-noir"
    );

    if (themeId !== "cosmos") {
      document.body.classList.add("theme-" + themeId);
    }

    try { localStorage.setItem("mcuHeroTheme", themeId); } catch (e) {}

    document.querySelectorAll("[data-hero-theme]").forEach(function(btn) {
      btn.classList.toggle("active", btn.dataset.heroTheme === themeId);
    });

    const data = themeData[themeId];
    const poster = $("themePoster");
    const title = $("themePosterTitle");
    const subtitle = $("themePosterSubtitle");

    if (poster) { poster.src = data.poster; poster.alt = data.title + " poster"; }
    if (title) title.textContent = data.title;
    if (subtitle) subtitle.textContent = data.subtitle;

    console.log("🎨 Theme:", themeId);
  }

  /* ═══════════ BIND THEME BUTTONS ═══════════ */
  function bindThemeButtons() {
    document.querySelectorAll("[data-hero-theme]").forEach(function(btn) {
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
    });

    document.querySelectorAll("[data-hero-theme]").forEach(function(btn) {
      btn.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        const theme = btn.dataset.heroTheme;
        applyTheme(theme);
        playThemeSound();

        if (window.showToast) {
          const data = themeData[theme];
          window.showToast("✓ Theme: " + (data ? data.label : theme), "ok");
        }
      });
    });
  }

  function loadSavedTheme() {
    let saved = "cosmos";
    try { saved = localStorage.getItem("mcuHeroTheme") || "cosmos"; } catch (e) {}
    applyTheme(saved);
  }

  /* ═══════════ DARK / LIGHT ═══════════ */
  const themeBtn = $("themeBtn");

  function applyLightMode(isLight) {
    if (isLight) {
      document.body.classList.add("light-mode");
      if (themeBtn) themeBtn.textContent = "🌙 Dark";
    } else {
      document.body.classList.remove("light-mode");
      if (themeBtn) themeBtn.textContent = "☀️ Light";
    }
  }

  function loadDarkMode() {
    let saved = null;
    try { saved = localStorage.getItem("mcuTheme"); } catch (e) {}
    applyLightMode(saved === "light");
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", function() {
      playButtonSound();
      const willBeLight = !document.body.classList.contains("light-mode");
      applyLightMode(willBeLight);
      try { localStorage.setItem("mcuTheme", willBeLight ? "light" : "dark"); } catch (e) {}
      if (window.showToast) {
        window.showToast(willBeLight ? "☀️ Light mode" : "🌙 Dark mode", "ok");
      }
    });
  }

  loadDarkMode();

  /* ═══════════ SOUND TOGGLE ═══════════ */
  const soundBtn = $("soundBtn");

  function updateSoundBtn() {
    if (soundBtn) soundBtn.textContent = soundEnabled ? "🔊 Sound" : "🔇 Sound";
  }

  if (soundBtn) {
    soundBtn.addEventListener("click", function() {
      soundEnabled = !soundEnabled;
      try { localStorage.setItem("mcuSound", soundEnabled); } catch (e) {}
      updateSoundBtn();
      if (soundEnabled) playButtonSound();
      if (window.showToast) {
        window.showToast(soundEnabled ? "🔊 Sound on" : "🔇 Sound off", "ok");
      }
    });
  }

  updateSoundBtn();

  /* ═══════════ RESET ═══════════ */
  const resetBtn = $("resetBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", function() {
      playButtonSound();
      if (window.resetTracker) window.resetTracker();
    });
  }

  /* ═══════════ EXPLORE ═══════════ */
  const heroExploreBtn = $("heroExploreBtn");
  if (heroExploreBtn) {
    heroExploreBtn.addEventListener("click", function() {
      playButtonSound();
      const movieList = $("movieList");
      if (movieList) movieList.scrollIntoView({ behavior: "smooth" });
    });
  }

  /* ═══════════ V3 NAME ═══════════ */
  function renderV3Name() {
    let name = "Shashwat";
    try { name = localStorage.getItem("mcuV3Name") || "Shashwat"; } catch (e) {}

    const greeting = $("v3Greeting");
    const avatar = $("v3Avatar");
    const nameInput = $("v3NameInput");

    if (greeting) greeting.textContent = "Welcome back, " + name + " ⚡";
    if (avatar) avatar.textContent = (name.trim().charAt(0).toUpperCase()) || "S";
    if (nameInput) nameInput.value = name;
  }

  const v3SaveName = $("v3SaveName");
  if (v3SaveName) {
    v3SaveName.addEventListener("click", function() {
      playButtonSound();
      const input = $("v3NameInput");
      const value = (input && input.value.trim()) || "Shashwat";
      try { localStorage.setItem("mcuV3Name", value); } catch (e) {}
      renderV3Name();
      if (window.showToast) window.showToast("✓ Name saved", "ok");
    });
  }

  renderV3Name();

  /* ═══════════ DOOMSDAY COUNTDOWN ═══════════ */
  (function() {
    const TARGET = Date.parse("2026-12-18T00:00:00+05:30");
    function pad(n) { return String(n).padStart(2, "0"); }
    function tick() {
      const diff = Math.max(0, TARGET - Date.now());
      const total = Math.floor(diff / 1000);
      const days = Math.floor(total / 86400);
      let rest = total % 86400;
      const hours = Math.floor(rest / 3600);
      rest %= 3600;
      const minutes = Math.floor(rest / 60);
      const seconds = rest % 60;
      const d = $("doomsdayDays");
      const h = $("doomsdayHours");
      const m = $("doomsdayMinutes");
      const s = $("doomsdaySeconds");
      if (d) d.textContent = String(days).padStart(3, "0");
      if (h) h.textContent = pad(hours);
      if (m) m.textContent = pad(minutes);
      if (s) s.textContent = pad(seconds);
    }
    tick();
    setInterval(tick, 1000);
  })();

  /* ═══════════ INIT ═══════════ */
  function init() {
    bindThemeButtons();
    loadSavedTheme();
    console.log("✅ Theme + Sound system ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  setTimeout(bindThemeButtons, 500);
  setTimeout(loadSavedTheme, 600);

  window.applyTheme = applyTheme;
})();